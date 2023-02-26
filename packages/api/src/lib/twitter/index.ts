import { TwitterApi } from 'twitter-api-v2';
import { TweetResponse, GetBookmarksResponse } from './types';

export const fetchBookmarks = async (accessToken: string, pagination_token?: string): Promise<GetBookmarksResponse> => {
  const client = new TwitterApi(accessToken);
  // const options = { pagination_token: req.body.pagination_token || undefined };
  const options = pagination_token ? { pagination_token: pagination_token } : {};
  const { tweets, data: { meta: { next_token, result_count } } } = await client.v2.bookmarks(options);
  const tweetIds = tweets.map(t => t.id);
  const bookmarks = await client.v2.tweets( tweetIds, { "tweet.fields": ['author_id', 'created_at'] });
  // Couldn't get any fields other than "tweet.fields" with below code.
  /* const bookmarks = await client.v2.tweets( tweetIds, {
      expansions: ['author_id'],
      "tweet.fields": ['author_id', 'created_at'],
      "media.fields": ['url', 'public_metrics', 'type'],
      "user.fields": ['name', 'username']
    }
  ); */
  const userIds = bookmarks.data.map(b => b.author_id);
  const users = await client.v2.users(userIds);
  const result: TweetResponse[] = bookmarks.data.map((b, i) => ({
    id: b.id,
    text: b.text,
    url: `https://twitter.com/${users.data[i].username}/status/${b.id}`,
    author: users.data[i].username,
    created_at: b.created_at,
  }));
  return ({
    tweets: result,
    next_token,
    result_count,
  });
}
