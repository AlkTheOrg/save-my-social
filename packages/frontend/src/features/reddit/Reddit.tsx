import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
// import WindowOpener from "../../components/WindowOpener";

function Reddit(): JSX.Element {
  const dispatch = useAppDispatch();
  const {
    tokens, selections, importableTo, authURL, isLoading, message,
  } = useAppSelector((state: RootState) => state.reddit);

  useEffect(() => {
    if (authURL) {
      console.log("window should be opned");
    }
  }, [authURL]);

  return (
    <div>
      {/* {authURL && <WindowOpener target={authURL} />} */}
      Reddit
    </div>
  );
}

export default Reddit;
