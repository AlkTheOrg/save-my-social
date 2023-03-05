export interface TweetV2 {
    id: string;
    text: string;
    // edit_history_tweet_ids: string[];
    created_at?: string;
    author_id?: string;
}

export type TweetResponse = {
  url: string,
  author: string,
} & Omit<TweetV2, "author_id">;

export type GetBookmarksResponse = {
  tweets: TweetResponse[],
  nextToken?: string,
  resultCount: number,
}
