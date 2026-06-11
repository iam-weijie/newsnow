import type { NewsItem } from "@shared/types"

const SANITY_QUERY = `
*[
  _type == "newsletter.it"
  && defined(slug.current)
  && defined(publishDate)
  && subjectLine.a != null
  && publishDate <= now()
] | order(publishDate desc)[0...30]{
  "title": subjectLine.a,
  "slug": slug.current,
  "previewText": previewText,
  "publishDate": publishDate
}
`.trim()

interface SanityIssue {
  title: string
  slug: string
  previewText?: string
  publishDate: string
}

interface SanityResponse {
  result: SanityIssue[]
}

const itBrew = defineSource(async () => {
  const url = new URL("https://bl383u0v.apicdn.sanity.io/v2024-01-01/data/query/production")
  url.searchParams.set("query", SANITY_QUERY)

  const { result }: SanityResponse = await myFetch(url.toString())
  if (!result?.length) throw new Error("Cannot fetch IT Brew data")

  return result.map((issue): NewsItem => ({
    id: issue.slug,
    title: issue.title.trim(),
    url: `https://www.itbrew.com/issues/${issue.slug}`,
    pubDate: issue.publishDate,
    extra: issue.previewText
      ? { hover: issue.previewText }
      : undefined,
  }))
})

export default defineSource({
  itbrew: itBrew,
})
