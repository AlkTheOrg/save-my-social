import { Client } from "@notionhq/client";
import { ExportFrom, FeaturesOfRedditExport, FeaturesOfSocialAppExport } from "../../controllers/types.js";
import { fetchSavedModels } from "../reddit/index.js";
import { ProcessedSavedChildren } from "../reddit/types.js";
import DBCreator from "./dbCreator.js";
import PageCreator, { createRedditPropsForDBPage } from "./pageCreator.js";
import { CreateDBPropArguments } from "./types.js";

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

export const updateDBTitle = (notion: Client, title: string, dbID: string) => {
  return notion.databases.update({
    database_id: dbID,
    title: [
      {
        text: {
          content: title,
        },
      },
    ]
  })
};

// get the export feature (saved, playlist etc.) that is made from the app
export const getAppExportFeatureKey = (
  exportProps: FeaturesOfSocialAppExport,
  appName: ExportFrom
): string => {
  const propertiesOfAppExport = exportProps[appName];
  const featureKey = 
    Object.keys(propertiesOfAppExport).length < 1
      ? null // no feature object found in this app's export props
      : Object.keys(propertiesOfAppExport)[0]; // get the first found feature for now
  // if featureKey is null or an unsupported feature, it will considered invalid
  return featureKey;
};

export const retrieveDB = (notion: Client, dbID: string) =>
  notion.databases.retrieve({ database_id: dbID });

export const createDB = async (
  notion: Client,
  parentPageID: string,
  title: string,
  properties: Array<CreateDBPropArguments>,
) => {
  const dbCreator = DBCreator();
  const db = await dbCreator.createDB(notion, parentPageID, title, properties);
  return db;
};

const createPagesFromRedditModels = async (
  notion: Client,
  dbID: string,
  models: ProcessedSavedChildren[],
) => {
  const pageCreator = PageCreator();
  return Promise.all(
    models.map(async (model) => pageCreator.createDBPage(
        notion,
        dbID,
        createRedditPropsForDBPage(model),
      )
    ),
  );
} 

export const createPagesFromRedditExportProps = async (
  notion: Client,
  redditAccessToken,
  dbID: string,
  exportProps: FeaturesOfRedditExport,
) => {
  const { reddit: { saved: { lastItemID }}} = exportProps as FeaturesOfRedditExport;
  const { models, lastQueried } = await fetchSavedModels(redditAccessToken, lastItemID);
  await createPagesFromRedditModels(notion, dbID, models);
  return lastQueried;
}
