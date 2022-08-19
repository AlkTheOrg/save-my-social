import Reddit from "../features/reddit/Reddit";
import "../styles/SocialApps.scss";

const SocialApps = (): JSX.Element => {
  return (
    <div className="social-app-container">
      <Reddit />
      <Reddit />
      <Reddit />
      <Reddit />
      <Reddit />
      <Reddit />
      {/* {socialAppProps.map((props) => (<SocialApp key={props.name} {...props} />))} */}
    </div>
  );
};

export default SocialApps;
