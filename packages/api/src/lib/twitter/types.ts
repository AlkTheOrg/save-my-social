export interface TweetV2 {
    id: string;
    text: string;
    // edit_history_tweet_ids: string[];
    created_at?: string;
    author_id?: string;
}

export interface TweetResponse extends Exclude<TweetV2, "author_id">{
  url: string;
  author: string
}

export type GetBookmarksResponse = {
  tweets: TweetResponse[],
  next_token: string,
  result_count: number,
}
