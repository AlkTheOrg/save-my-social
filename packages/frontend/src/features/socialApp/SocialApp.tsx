import { AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../app/hooks";
import {
  setExportFrom,
  SmsApp,
  appsToExportFrom,
  ExportFrom,
  setExportTo,
} from "../../app/smsSlice";
import SocialAppBtn from "../../components/SocialAppBtn";
import { getAuthURL as getRedditAuthURL } from "../reddit";
import { getAuthURL as getNotionAuthURL } from "../notion";
import { getAuthURL as getSheetsAuthURL } from "../sheets";
import { getAuthURL as getSpotifyAuthURL } from "../spotify";

type Props = {
  appName: SmsApp;
  onClick?: (...args: unknown[]) => void;
  isDisabled?: boolean;
};

type AppToAuthURLGetterMapping = Record<
  Exclude<SmsApp, "" | "download">,
  AsyncThunk<string, void, Record<string, unknown>>
>;

const SocialApp: (props: Props) => JSX.Element = ({ appName, onClick, isDisabled }) => {
  const dispatch = useAppDispatch();

  const appToAuthURLGetterMapping: AppToAuthURLGetterMapping = {
    reddit: getRedditAuthURL,
    spotify: getSpotifyAuthURL,
    twitter: getRedditAuthURL, // TODO: Update these when implemented
    youtube: getRedditAuthURL,
    notion: getNotionAuthURL,
    sheets: getSheetsAuthURL,
  };

  const handleClick = (): void => {
    if (onClick) onClick();
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
      isDisabled={isDisabled}
    />
  );
};

export default SocialApp;
