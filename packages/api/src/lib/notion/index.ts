import { Client } from "@notionhq/client";

export const getLastEditedPage = async (notion: Client) => {
  const {
    results: [page],
  } = await notion.search({
    query: "",
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
    filter: {
      property: "object",
      value: "page",
    },
  });
  return page;
};
