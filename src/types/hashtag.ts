export interface Hashtag {
  id: string;
  tag: string;
  createdAt: string;
}

export interface TrendingHashtag {
  hashtag: Hashtag;
  postCount: number;
}
