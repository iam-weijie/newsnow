import { XMLParser } from "fast-xml-parser"
import type { NewsItem } from "@shared/types"

const categories = {
  "cs-ai": "cs.AI",
  "cs-lg": "cs.LG",
  "cs-cv": "cs.CV",
  "cs-cl": "cs.CL",
} as const

function getText(value: unknown): string {
  if (!value) return ""
  if (typeof value === "string") return value
  if (typeof value === "object" && value !== null && "$text" in value)
    return String((value as { $text: string }).$text)
  return ""
}

function getArxivLink(link: unknown): string {
  if (!link) return ""
  if (typeof link === "string") return link
  if (Array.isArray(link)) {
    const html = link.find((l: { rel?: string, type?: string, href?: string }) => l.rel === "alternate" || l.type === "text/html")
    return html?.href ?? link[0]?.href ?? ""
  }
  if (typeof link === "object" && link !== null && "href" in link)
    return (link as { href: string }).href
  return ""
}

function getAuthors(author: unknown): string | undefined {
  if (!author) return undefined
  if (Array.isArray(author))
    return author.map(a => getText((a as { name?: unknown }).name)).filter(Boolean).join(", ")
  return getText((author as { name?: unknown }).name) || undefined
}

function defineArxivSource(category: string) {
  return async (): Promise<NewsItem[]> => {
    const url = new URL("https://export.arxiv.org/api/query")
    url.searchParams.set("search_query", `cat:${category}`)
    url.searchParams.set("sortBy", "submittedDate")
    url.searchParams.set("sortOrder", "descending")
    url.searchParams.set("max_results", "30")

    const data = await myFetch(url.toString(), { responseType: "text" })
    const xml = new XMLParser({
      attributeNamePrefix: "",
      textNodeName: "$text",
      ignoreAttributes: false,
    })
    const result = xml.parse(data as string)
    let entries = result.feed?.entry ?? []
    if (!Array.isArray(entries)) entries = entries ? [entries] : []

    return entries.map((entry: Record<string, unknown>): NewsItem => {
      const paperUrl = getArxivLink(entry.link)
      const title = getText(entry.title).replace(/\s+/g, " ").trim()
      const summary = getText(entry.summary).replace(/\s+/g, " ").trim()
      return {
        title,
        url: paperUrl,
        id: paperUrl || getText(entry.id),
        pubDate: getText(entry.published) || getText(entry.updated),
        extra: {
          info: getAuthors(entry.author),
          hover: summary,
        },
      }
    }).filter((item: NewsItem) => item.title && item.url)
  }
}

const sources = Object.fromEntries(
  Object.entries(categories).map(([id, category]) => [id, defineArxivSource(category)]),
) as Record<keyof typeof categories, ReturnType<typeof defineArxivSource>>

export default defineSource({
  "arxiv": sources["cs-ai"],
  "arxiv-cs-ai": sources["cs-ai"],
  "arxiv-cs-lg": sources["cs-lg"],
  "arxiv-cs-cv": sources["cs-cv"],
  "arxiv-cs-cl": sources["cs-cl"],
})
