import { FC } from "react";
import { useAppSelector } from "../app/hooks";
import SocialApp from "../features/socialApp/SocialApp";
import { getExportableTargetsOfCurApp } from "../features/socialApp/socialAppConstants";
import "../styles/SocialApps.scss";

type Props = {
  onAppClick: (...args: unknown[]) => void;
  isDisabled?: boolean;
};
const SocialApps: FC<Props> = ({ onAppClick, isDisabled }) => {
  const { activeApps, tokens, exportFrom } = useAppSelector(
    (state) => state.sms,
  );

  return (
    <div className="social-app-container">
      {(!tokens[0]
        ? activeApps
        : getExportableTargetsOfCurApp(exportFrom)
      ).map((appName) => (
        <SocialApp
          key={appName}
          appName={appName}
          onClick={onAppClick}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
};

SocialApps.defaultProps = {
  isDisabled: false,
};

export default SocialApps;
