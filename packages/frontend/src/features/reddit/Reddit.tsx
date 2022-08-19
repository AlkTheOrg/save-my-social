import { useAppDispatch } from "../../app/hooks";
import { setExportFrom } from "../../app/smsSlice";
import SocialAppBtn from "../../components/SocialAppBtn";
import { getAuthURL as getRedditAuthURL } from "./redditSlice";

function Reddit(): JSX.Element {
  const dispatch = useAppDispatch();

  const handleClick = (): void => {
    dispatch(getRedditAuthURL());
    dispatch(setExportFrom("reddit"));
  };

  return (
    <SocialAppBtn
      buttonClass="social-app"
      onClick={handleClick}
      name="reddit"
      logoPath="logos/reddit.svg"
    />
  );
}

export default Reddit;
