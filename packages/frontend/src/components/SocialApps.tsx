import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  ExportFrom,
  setExportFrom,
  setExportTo,
  SmsApp,
  toggleConfirmModal,
} from "../app/smsSlice";
import SocialApp from "../features/socialApp/SocialApp";
import {
  getAppInfo,
  getExportableTargetsOfCurApp,
} from "../features/socialApp/socialAppConstants";
import { getAuthURL } from "../features/windowOpener";
import "../styles/SocialApps.scss";

type Props = {
  onAppClick: (...args: unknown[]) => void;
  isDisabled?: boolean;
};

const SocialApps: FC<Props> = ({ onAppClick, isDisabled }) => {
  const dispatch = useAppDispatch();
  const {
    activeApps, areTokensSet, exportFrom, curSelectionContext,
  } = useAppSelector(
    (state) => state.sms,
  );

  const handleClick = (appName: SmsApp) => {
    onAppClick();
    if (appName === "twitter") {
      dispatch(toggleConfirmModal());
    }

    dispatch(getAuthURL(appName));

    if (curSelectionContext === "exportFrom") {
      dispatch(setExportFrom(appName as ExportFrom));
    } else {
      dispatch(setExportTo(appName));
    }
  };

  return (
    <div className="social-app-container">
      {(curSelectionContext === "exportTo" && areTokensSet[0]
        ? getExportableTargetsOfCurApp(exportFrom)
        : activeApps
      ).map(getAppInfo).map(({
        title, appName, disabledText, isAppDisabled,
      }) => (
        <SocialApp
          key={appName}
          appName={appName}
          btnText={title}
          onClick={() => handleClick(appName)}
          isDisabled={isDisabled || isAppDisabled}
          disabledText={disabledText}
        />
      ))}
    </div>
  );
};

SocialApps.defaultProps = {
  isDisabled: false,
};

export default SocialApps;
