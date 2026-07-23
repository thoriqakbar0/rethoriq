import { useEffect, useRef } from 'react'

const POSITION_VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`

const ATKINSON_FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform float u_isLight;
  uniform vec3 u_background;
  varying vec2 v_texCoord;

  float atkinsonThreshold(vec2 position) {
    int x = int(mod(position.x, 4.0));
    int y = int(mod(position.y, 4.0));
    int index = y * 4 + x;
    float thresholds[16];
    thresholds[0] = 0.0;
    thresholds[1] = 12.0;
    thresholds[2] = 3.0;
    thresholds[3] = 15.0;
    thresholds[4] = 8.0;
    thresholds[5] = 4.0;
    thresholds[6] = 11.0;
    thresholds[7] = 7.0;
    thresholds[8] = 2.0;
    thresholds[9] = 14.0;
    thresholds[10] = 1.0;
    thresholds[11] = 13.0;
    thresholds[12] = 10.0;
    thresholds[13] = 6.0;
    thresholds[14] = 9.0;
    thresholds[15] = 5.0;

    for (int current = 0; current < 16; current++) {
      if (current == index) {
        return thresholds[current] / 16.0;
      }
    }

    return 0.0;
  }

  void main() {
    vec2 sampleCoordinate = vec2(
      v_texCoord.x,
      mix(v_texCoord.y, 1.0 - v_texCoord.y, u_isLight)
    );
    vec4 sourceColor = texture2D(u_image, sampleCoordinate);
    float gray = dot(sourceColor.rgb, vec3(0.299, 0.587, 0.114));

    float screenY = gl_FragCoord.y / u_resolution.y;
    float fade = smoothstep(0.0, 0.4, screenY);
    gray = mix(gray * fade, mix(1.0, gray, fade), u_isLight);
    gray = clamp(gray * 1.2 - 0.1, 0.0, 1.0);

    float threshold = atkinsonThreshold(gl_FragCoord.xy);
    float thresholdLevel = clamp(
      threshold + mix(0.1, -0.1, u_isLight),
      0.001,
      0.999
    );
    float dithered = step(thresholdLevel, gray);

    vec3 darkInk = vec3(0.784, 0.855, 0.898);
    vec3 lightInk = vec3(0.106, 0.212, 0.365);
    vec3 ink = mix(darkInk, lightInk, u_isLight);
    float inkAlpha = mix(dithered, 1.0 - dithered, u_isLight);

    gl_FragColor = vec4(mix(u_background, ink, inkAlpha), 1.0);
  }
`

type OceanSource = HTMLVideoElement | HTMLImageElement

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader

  console.error('Ocean shader compilation failed', gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  return null
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    POSITION_VERTEX_SHADER,
  )
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    ATKINSON_FRAGMENT_SHADER,
  )
  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader)
    if (fragmentShader) gl.deleteShader(fragmentShader)
    return null
  }

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program

  console.error('Ocean shader linking failed', gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
  return null
}

function parseRenderedColor(color: string): readonly [number, number, number] {
  const channels = color
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number)
  if (!channels || channels.length !== 3 || channels.some(Number.isNaN)) {
    return [0.96, 0.96, 0.93]
  }
  return [channels[0] / 255, channels[1] / 255, channels[2] / 255]
}

/**
 * Renders the Dark Thoughts wave footage through a theme-aware WebGL
 * Atkinson-dither shader, with a static image fallback and owned cleanup.
 */
export function OceanBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      premultipliedAlpha: false,
    })
    if (!gl) return

    const program = createProgram(gl)
    if (!program) return

    const positionBuffer = gl.createBuffer()
    const textureCoordinateBuffer = gl.createBuffer()
    const texture = gl.createTexture()

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const textureCoordinateLocation = gl.getAttribLocation(
      program,
      'a_texCoord',
    )
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const lightModeLocation = gl.getUniformLocation(program, 'u_isLight')
    const backgroundLocation = gl.getUniformLocation(program, 'u_background')
    const imageLocation = gl.getUniformLocation(program, 'u_image')
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform1i(imageLocation, 0)

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.autoplay = true
    video.playsInline = true
    video.src = '/media/waves.mp4'

    const fallbackImage = new Image()
    fallbackImage.crossOrigin = 'anonymous'
    fallbackImage.src = '/media/waves-fallback.png'

    let animationId: number | null = null
    let currentSource: OceanSource | null = null
    let isVisible = true
    let isDisposed = false

    const sourceSize = (source: OceanSource) =>
      source === video
        ? { width: video.videoWidth, height: video.videoHeight }
        : {
            width: fallbackImage.naturalWidth,
            height: fallbackImage.naturalHeight,
          }

    const configureCanvas = (source: OceanSource) => {
      const { width: sourceWidth, height: sourceHeight } = sourceSize(source)
      if (!sourceWidth || !sourceHeight) return

      const pixelRatio = Math.min(window.devicePixelRatio, 2)
      canvas.width = Math.round(canvas.offsetWidth * pixelRatio)
      canvas.height = Math.round(canvas.offsetHeight * pixelRatio)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)

      const canvasAspect = canvas.width / canvas.height
      const sourceAspect = sourceWidth / sourceHeight
      let textureTop = 1
      let textureLeft = 0
      let textureRight = 1
      if (sourceAspect > canvasAspect) {
        const scale = canvasAspect / sourceAspect
        textureLeft = (1 - scale) / 2
        textureRight = 1 - textureLeft
      } else {
        textureTop = sourceAspect / canvasAspect
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          textureLeft,
          0,
          textureRight,
          0,
          textureLeft,
          textureTop,
          textureRight,
          textureTop,
        ]),
        gl.STATIC_DRAW,
      )
      gl.enableVertexAttribArray(textureCoordinateLocation)
      gl.vertexAttribPointer(
        textureCoordinateLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0,
      )
      currentSource = source
    }

    const render = () => {
      animationId = null
      if (!currentSource || isDisposed) return

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        currentSource,
      )

      const background = parseRenderedColor(
        window.getComputedStyle(document.body).backgroundColor,
      )
      gl.uniform1f(lightModeLocation, darkMode.matches ? 0 : 1)
      gl.uniform3f(
        backgroundLocation,
        background[0],
        background[1],
        background[2],
      )
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (
        currentSource === video &&
        !video.paused &&
        isVisible &&
        !reducedMotion.matches
      ) {
        animationId = window.requestAnimationFrame(render)
      }
    }

    const startVideo = () => {
      if (reducedMotion.matches || !isVisible || isDisposed) return

      video
        .play()
        .then(() => {
          if (isDisposed) return
          configureCanvas(video)
          if (animationId === null) render()
        })
        .catch(() => {
          if (fallbackImage.complete && fallbackImage.naturalWidth) {
            configureCanvas(fallbackImage)
            render()
          }
        })
    }

    const showFallback = () => {
      if (currentSource) return
      configureCanvas(fallbackImage)
      render()
    }

    const handleVideoReady = () => startVideo()
    const handleInteraction = () => startVideo()
    const handleThemeChange = () => render()
    const handleMotionChange = () => {
      if (reducedMotion.matches) {
        video.pause()
        if (animationId !== null) {
          window.cancelAnimationFrame(animationId)
          animationId = null
        }
        if (fallbackImage.complete && fallbackImage.naturalWidth) {
          configureCanvas(fallbackImage)
        }
        render()
      } else {
        startVideo()
      }
    }
    const handleResize = () => {
      if (!currentSource) return
      configureCanvas(currentSource)
      render()
    }

    const resizeObserver = new ResizeObserver(handleResize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        startVideo()
      } else {
        video.pause()
        if (animationId !== null) {
          window.cancelAnimationFrame(animationId)
          animationId = null
        }
      }
    })

    fallbackImage.addEventListener('load', showFallback)
    video.addEventListener('loadeddata', handleVideoReady)
    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('touchstart', handleInteraction, { once: true })
    document.addEventListener('keydown', handleInteraction, { once: true })
    darkMode.addEventListener('change', handleThemeChange)
    reducedMotion.addEventListener('change', handleMotionChange)
    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)

    if (fallbackImage.complete && fallbackImage.naturalWidth) showFallback()
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) startVideo()

    return () => {
      isDisposed = true
      if (animationId !== null) window.cancelAnimationFrame(animationId)
      video.pause()
      video.removeAttribute('src')
      video.load()
      fallbackImage.removeEventListener('load', showFallback)
      video.removeEventListener('loadeddata', handleVideoReady)
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      darkMode.removeEventListener('change', handleThemeChange)
      reducedMotion.removeEventListener('change', handleMotionChange)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      gl.deleteTexture(texture)
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(textureCoordinateBuffer)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <div className="ocean-banner" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
