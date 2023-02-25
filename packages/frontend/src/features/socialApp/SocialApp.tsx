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
import { getAuthURL as getTwitterAuthURL } from "../twitter";

type Props = {
  appName: SmsApp;
  btnText: string;
  onClick?: (...args: unknown[]) => void;
  isDisabled?: boolean;
  disabledText?: string
};

type AppToAuthURLGetterMapping = Record<
  Exclude<SmsApp, "" | "download">,
  AsyncThunk<string, void, Record<string, unknown>>
>;

const SocialApp: (props: Props) => JSX.Element = ({
  appName,
  btnText,
  onClick,
  isDisabled,
  disabledText,
}) => {
  const dispatch = useAppDispatch();

  const appToAuthURLGetterMapping: AppToAuthURLGetterMapping = {
    reddit: getRedditAuthURL,
    spotify: getSpotifyAuthURL,
    twitter: getTwitterAuthURL,
    youtube: getRedditAuthURL, // TODO: Update when implemented
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
      text={btnText}
      logoPath={`logos/${appName}.svg`}
      isDisabled={isDisabled}
      disabledText={disabledText}
    />
  );
};

export default SocialApp;
