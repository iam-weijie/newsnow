function createRedditSource(subreddit: string) {
  return defineRSSSource(`https://www.reddit.com/r/${subreddit}/.rss`)
}

export default defineSource({
  "reddit-apple": createRedditSource("apple"),
  "reddit-artificial": createRedditSource("artificial"),
  "reddit-artificialintelligence": createRedditSource("ArtificialIntelligence"),
  "reddit-careeradvice": createRedditSource("careeradvice"),
  "reddit-computerscience": createRedditSource("computerscience"),
  "reddit-programmerhumor": createRedditSource("programmerhumor"),
  "reddit-wallstreetbets": createRedditSource("wallstreetbets"),
  "reddit-investing": createRedditSource("investing"),
  "reddit-technology": createRedditSource("technology"),
})
