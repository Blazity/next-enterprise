// iTunes RSS feed response types
// Feed URLs: /us/rss/topsongs/limit=N/json  and  /us/rss/topalbums/limit=N/json

export interface RssImage {
  label: string
  attributes: { height: string }
}

export interface RssEntry {
  "im:name": { label: string }
  "im:artist": { label: string; attributes?: { href?: string } }
  "im:image": RssImage[]
  "id": { label: string; attributes: { "im:id": string } }
  "im:releaseDate"?: { label: string; attributes?: { label?: string } }
  "category"?: { attributes: { term: string } }
}

export interface RssFeed {
  feed: {
    entry: RssEntry[]
    title: { label: string }
  }
}
