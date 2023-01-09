export type SavedModel = {
  id: string,
  kind: "Comment" | "Post",
  kindID: string,
  subreddit: string,
  title: string,
  over_18: boolean,
  permalink: string,
  link: string,
};

export type SavedModelResponse = {
  models: SavedModel[],
  lastQueried: string,
};
