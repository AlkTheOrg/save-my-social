import { useAppDispatch } from "../../app/hooks";
import { setExportFrom } from "../../app/smsSlice";
import { getAuthURL as getRedditAuthURL } from "./redditSlice";

function Reddit(): JSX.Element {
  const dispatch = useAppDispatch();

  const handleClick = (): void => {
    dispatch(getRedditAuthURL());
    dispatch(setExportFrom("reddit"));
  };

  return (
    <button type="button" onClick={handleClick}>
      Reddit
    </button>
  );
}

export default Reddit;
