import { FeaturesOfSocialAppExport } from "../features/types";
import { GenuineExportFrom } from "./thunkMappings";

type ActiveExportApps = Exclude< GenuineExportFrom, "youtube">;

const initialMapping: Record<ActiveExportApps, FeaturesOfSocialAppExport> = {
  reddit: {
    reddit: { saved: { lastItemID: "" } },
  },
  spotify: {
    spotify: {
      playlist: {
        id: "",
        offset: 0,
      },
    },
  },
  twitter: {
    twitter: {
      bookmarks: {
        paginationToken: "",
      },
    },
  },
};

const exportPropsGetter = (app: ActiveExportApps) => initialMapping[app];

export default exportPropsGetter;
