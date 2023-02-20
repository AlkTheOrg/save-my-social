import { FC } from "react";
import { useAppSelector } from "../app/hooks";
import SocialApp from "../features/socialApp/SocialApp";
import {
  getAppInfo,
  getExportableTargetsOfCurApp,
} from "../features/socialApp/socialAppConstants";
import "../styles/SocialApps.scss";

type Props = {
  onAppClick: (...args: unknown[]) => void;
  isDisabled?: boolean;
};
const SocialApps: FC<Props> = ({ onAppClick, isDisabled }) => {
  const { activeApps, areTokensSet, exportFrom } = useAppSelector(
    (state) => state.sms,
  );

  return (
    <div className="social-app-container">
      {(!areTokensSet[0]
        ? activeApps
        : getExportableTargetsOfCurApp(exportFrom)
      ).map(getAppInfo).map(({
        title, appName, disabledText, isAppDisabled,
      }) => (
        <SocialApp
          key={appName}
          appName={appName}
          btnText={title}
          onClick={onAppClick}
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
