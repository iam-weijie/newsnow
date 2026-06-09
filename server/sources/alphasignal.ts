import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const hottestAllTime = defineSource(async () => {
  const baseURL = "https://alphasignal.ai"
  const sitemapURL = `${baseURL}/sitemap.xml`

  try {
    const sitemapXml: any = await myFetch(sitemapURL)
    const $ = cheerio.load(sitemapXml, { xmlMode: true })
    const news: NewsItem[] = []

    // Extract all news URLs from sitemap
    $("url").each((_, el) => {
      const $el = $(el)
      const loc = $el.find("loc").text().trim()

      // Only include /news/ articles
      if (loc && loc.includes("/news/")) {
        // Extract title from URL slug (format: /news/title-with-hyphens-123hash)
        const urlParts = loc.split("/news/")[1]
        if (urlParts) {
          // Remove hash at end and convert hyphens to spaces for title
          const titleSlug = urlParts.replace(/-[a-z0-9]+$/, "").replace(/-/g, " ")
          const title = titleSlug.charAt(0).toUpperCase() + titleSlug.slice(1)

          news.push({
            url: loc,
            title,
            id: loc,
          })
        }
      }
    })

    // Return first 30 articles
    return news.slice(0, 30)
  } catch {
    return []
  }
})

export default defineSource({
  "alphasignal": hottestAllTime,
  "alphasignal-hottest-of-all-time": hottestAllTime,
})
