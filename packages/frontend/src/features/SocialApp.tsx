import { AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "../app/hooks";
import {
  setExportFrom,
  SmsApp,
  appsToExportFrom,
  ExportFrom,
  setExportTo,
} from "../app/smsSlice";
import SocialAppBtn from "../components/SocialAppBtn";
import { getAuthURL as getRedditAuthURL } from "./reddit/redditSlice";
import { getAuthURL as getNotionAuthURL } from "./notion/notionSlice";

type Props = {
  appName: SmsApp;
};

type AppToAuthURLGetterMapping = Record<
  Exclude<SmsApp, "" | "download">,
  AsyncThunk<string, void, Record<string, unknown>>
>;

const SocialApp: (props: Props) => JSX.Element = ({ appName }) => {
  const dispatch = useAppDispatch();

  const appToAuthURLGetterMapping: AppToAuthURLGetterMapping = {
    reddit: getRedditAuthURL,
    spotify: getRedditAuthURL,
    twitter: getRedditAuthURL,
    youtube: getRedditAuthURL,
    notion: getNotionAuthURL,
    sheets: getRedditAuthURL, // TODO: Update these when implemented
  };

  const handleClick = (): void => {
    if (appToAuthURLGetterMapping[appName as keyof AppToAuthURLGetterMapping]) {
      dispatch(appToAuthURLGetterMapping[appName as keyof AppToAuthURLGetterMapping]());
    }

    if ((appsToExportFrom as string[]).includes(appName)) {
      dispatch(setExportFrom(appName as ExportFrom));
    } else {
      dispatch(setExportTo(appName));
    }
  };

  return (
    <SocialAppBtn
      buttonClass="social-app"
      onClick={handleClick}
      name={appName}
      logoPath={`logos/${appName}.svg`}
    />
  );
};

export default SocialApp;
