import axios from 'axios';
import { AuthHeaders, ProcessedSavedChildren, SavedChildren } from './types.js';
const Axios = axios.default;

export const processSavedChildren = (children: SavedChildren[]): ProcessedSavedChildren[] =>
  children.map((child) => ({
    id: child.data.id,
    kind: child.kind === 't1' ? 'Comment' : 'Post',
    kindID: `${child.kind}_${child.data.id}`,
    subreddit: child.data.subreddit,
    title: child.data.title || '',
    over_18: child.data.over_18,
    permalink: child.data.permalink,
    // url: child.data.url,
    link: 'https://reddit.com' + child.data.permalink,
    // category: child.data.category
  }));

export const getAuthHeaders = (accessToken: string): AuthHeaders => ({
  Authorization: `Bearer ${accessToken}`,
  Accept: "*/*",
  // "User-Agent": "axios/0.21.1",
  "Content-Type": "application/x-www-form-urlencoded",
});


export async function getSavedModelsRecursive(
  userURL: string,
  headers: AuthHeaders,
  lastQueried: string | undefined | null = undefined,
  resultArr: ProcessedSavedChildren[] = [],
  // maxNumOfRecursions = 2
) {
  // if (!maxNumOfRecursions) return resultArr;
  const params = {
    limit: 100,
    after: lastQueried,
  };
  const { data } = await Axios.get(userURL, { headers, params });
  const { children, after } = data.data;
  resultArr.push(...processSavedChildren(children));
  if (after) {
    await getSavedModelsRecursive(userURL, headers, after, resultArr);
  }
}

export const getMe = async (headers) => {
  const {
    data: {
      subreddit: { url }, // can also return display_name, display_name_prefixed, name
    },
  } = await Axios.get('https://oauth.reddit.com/api/v1/me', { headers });
  return url;
}

export const fetchSavedModels = async (accessToken: string, after?: string) => {
  const headers = getAuthHeaders(accessToken);
  const result = {
    models: [] as ProcessedSavedChildren[],
    lastQueried: '',
  };
  const userURL = await getMe(headers); // /user/<username>/
  const savedEndpoint = `https://oauth.reddit.com${userURL}saved`;
  const params = { limit: 100, after }; // can also be added to the endpoint url as a query string

  const savedResponse = await Axios.get(savedEndpoint, { headers, params });
  const { children } = savedResponse.data.data;
  
  result.models.push(...processSavedChildren(children));
  
  const lastModel = result.models[result.models.length - 1] || null;
  if (lastModel && lastModel.id) {
    result.lastQueried = lastModel.kindID;
  }
  return result;
}
