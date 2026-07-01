import type { NewsItem } from "@shared/types"

const README_URL = "https://raw.githubusercontent.com/ruanyf/weekly/master/README.md"
const ISSUE_RE = /- 第 (\d+) 期：\[([^\]]+)\]\(docs\/(issue-\d+\.md)\)/g
const LIMIT = 30

export default defineSource(async () => {
  const readme: string = await myFetch(README_URL)
  const items: NewsItem[] = []

  for (const match of readme.matchAll(ISSUE_RE)) {
    const [, issue, subtitle, path] = match
    items.push({
      id: issue,
      title: `第 ${issue} 期：${subtitle}`,
      url: `https://github.com/ruanyf/weekly/blob/master/docs/${path}`,
    })
    if (items.length >= LIMIT)
      break
  }

  if (!items.length)
    throw new Error("Cannot fetch 科技爱好者周刊 data")

  return items
})
