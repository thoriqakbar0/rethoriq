import { Agentation } from 'agentation'
import { useEffect, useState } from 'react'

const DEFAULT_ENDPOINT = 'http://localhost:4747'

export default function AgentationBridge() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (
    !import.meta.env.DEV ||
    !import.meta.env.VITE_ENABLE_AGENTATION ||
    !mounted
  ) {
    return null
  }

  return (
    <Agentation
      endpoint={import.meta.env.VITE_AGENTATION_ENDPOINT ?? DEFAULT_ENDPOINT}
    />
  )
}
