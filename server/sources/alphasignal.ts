import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

function titleFromUrl(url: string): string {
  const slug = url.split("/news/")[1]
  if (!slug)
    return url
  const title = slug.replace(/-/g, " ")
  return title.charAt(0).toUpperCase() + title.slice(1)
}

const hottestAllTime = defineSource(async () => {
  const baseURL = "https://alphasignal.ai"
  const titleByUrl = new Map<string, string>()
  const dateByUrl = new Map<string, number>()

  try {
    const newsSitemap: any = await myFetch(`${baseURL}/news-sitemap.xml`)
    const $news = cheerio.load(newsSitemap, { xmlMode: true })
    $news("url").each((_, el) => {
      const $el = $news(el)
      const loc = $el.find("loc").text().trim()
      const title = $el.find("news\\:title").text().trim()
      const pubDate = $el.find("news\\:publication_date").text().trim()
      if (loc && title)
        titleByUrl.set(loc, title)
      if (loc && pubDate)
        dateByUrl.set(loc, new Date(pubDate).getTime())
    })
  } catch {
    // Google News sitemap is optional; fall back to slug titles from the main news sitemap.
  }

  const newsXml: any = await myFetch(`${baseURL}/sitemaps/news.xml`)
  const $ = cheerio.load(newsXml, { xmlMode: true })
  const news: NewsItem[] = []

  $("url").each((_, el) => {
    const $el = $(el)
    const loc = $el.find("loc").text().trim()
    if (!loc || !loc.includes("/news/"))
      return

    const lastmod = $el.find("lastmod").text().trim()
    const pubDate = dateByUrl.get(loc) ?? (lastmod ? new Date(lastmod).getTime() : undefined)

    news.push({
      url: loc,
      title: titleByUrl.get(loc) ?? titleFromUrl(loc),
      id: loc,
      pubDate,
    })
  })

  return news
    .sort((a, b) => (Number(b.pubDate) || 0) - (Number(a.pubDate) || 0))
    .slice(0, 30)
})

export default defineSource({
  "alphasignal": hottestAllTime,
  "alphasignal-hottest-of-all-time": hottestAllTime,
})
