import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { reset } from "../app/smsSlice";
import "../styles/Finished.scss";

function Finished() {
  const dispatch = useAppDispatch();
  const { finalURL, exportFrom, exportTo } = useAppSelector(
    (state) => state.sms,
  );

  useEffect(() => {
    (document.querySelector("#final-link>a") as HTMLAnchorElement)?.click();
  }, []);

  return (
    <div className="finished">
      <h2>
        {"You've successfully exported your data from "}
        <span className="capitalize">{exportFrom}</span> to{" "}
        <span className="capitalize">{exportTo}</span>.
      </h2>
      <h3 id="final-link">
        <a href={finalURL} target="_blank" rel="noreferrer">
          Here
        </a>{" "}
        is your <span className="capitalize">{exportTo}</span> link.
      </h3>
      <button id="restart" type="button" onClick={() => dispatch(reset())}>
        Click to Restart
      </button>
    </div>
  );
}

export default Finished;
