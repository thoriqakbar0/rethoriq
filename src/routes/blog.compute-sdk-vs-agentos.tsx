import { createFileRoute } from '@tanstack/react-router'
import { BlogArticleLayout } from '#/components/blog-article-layout'
import { ComputeSdkVsAgentOsArticleBody } from '#/content/compute-sdk-vs-agentos'
import { computeSdkVsAgentOsArticle } from '#/content/compute-sdk-vs-agentos.metadata'
import { RuntimeBoundaryExplorer } from '#/content/compute-sdk-vs-agentos.playground'

/**
 * Registers the article route and its document metadata.
 */
export const Route = createFileRoute('/blog/compute-sdk-vs-agentos')({
  head: () => ({
    meta: [
      {
        title: `${computeSdkVsAgentOsArticle.title} — Thoriq Akbar`,
      },
      {
        name: 'description',
        content: computeSdkVsAgentOsArticle.description,
      },
    ],
  }),
  component: ComputeSdkVsAgentOsPost,
})

function ComputeSdkVsAgentOsPost() {
  return (
    <BlogArticleLayout {...computeSdkVsAgentOsArticle}>
      <ComputeSdkVsAgentOsArticleBody
        runtimeBoundaryExplorer={<RuntimeBoundaryExplorer />}
      />
    </BlogArticleLayout>
  )
}
