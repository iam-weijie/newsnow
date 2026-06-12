const news = defineRSSHubSource("/anthropic/news")
const research = defineRSSSource("https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_research.xml")

export default defineSource({
  "anthropic": news,
  "anthropic-news": news,
  "anthropic-research": research,
})
