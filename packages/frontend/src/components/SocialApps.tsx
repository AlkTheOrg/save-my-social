import { useAppSelector } from "../app/hooks";
import SocialApp from "../features/SocialApp";
import "../styles/SocialApps.scss";

const SocialApps = (): JSX.Element => {
  const activeApps = useAppSelector((state) => state.sms.activeApps);

  return (
    <div className="social-app-container">
      {activeApps.map((appName) => (
        <SocialApp key={appName} appName={appName} />
      ))}
    </div>
  );
};

export default SocialApps;
