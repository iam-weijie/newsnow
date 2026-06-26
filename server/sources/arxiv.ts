import type { NewsItem } from "@shared/types"
import { rss2json } from "#/utils/rss2json"

const categories = {
  "cs-ai": "cs.AI",
  "cs-lg": "cs.LG",
  "cs-cv": "cs.CV",
  "cs-cl": "cs.CL",
} as const

function defineArxivSource(category: string) {
  return async (): Promise<NewsItem[]> => {
    const data = await rss2json(`https://rss.arxiv.org/rss/${category}`)
    if (!data?.items.length) throw new Error("Cannot fetch arxiv data")
    return data.items.map((item) => {
      const author = (item as { author?: string }).author
      const hover = item.description?.replace(/^arXiv:\S+\s+Announce Type: \w+\s+Abstract: /, "").trim()
      return {
        title: item.title,
        url: item.link,
        id: item.link,
        pubDate: item.created,
        extra: {
          info: author,
          hover,
        },
      }
    })
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
