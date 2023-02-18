export type SavedChildren = {
  data: {
    id: string;
    title?: string;
    link_title?: string;
    over_18: boolean;
    permalink: string;
    urL: string;
    category: string;
    subreddit: string;
  };
  kind: string;
};

export type ProcessedSavedChildren = {
  id: string,
  kind: 'Comment' | 'Post',
  kindID: string,
  subreddit: string,
  title: string,
  over_18: boolean,
  permalink: string,
  link: string,
};

export type FetchSavedModelsResponse = {
  models: ProcessedSavedChildren[],
  lastQueried: string,
}

export type AuthHeaders = {
  Authorization: string,
  Accept: string,
  'Content-Type': string,
  'User-Agent'?: string,
}

export interface ReqBodyWithItemAfter {
  after: string,
}
