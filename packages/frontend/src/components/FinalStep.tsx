import { useAppDispatch, useAppSelector } from "../app/hooks";
import { reset } from "../app/smsSlice";
import "../styles/FinalStep.scss";
import exportPropsGetter from "../util/exportPropsGetter";
import { getExportThunkAction } from "../util/thunkMappings";
import Loader from "./Loader";

const FinalStep = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    exportFrom, exportTo, isLoading, isError, message,
  } = useAppSelector(
    (state) => state.sms,
  );

  const handleClick = () => {
    if (exportFrom && exportTo) {
      if (exportFrom === "reddit" || exportFrom === "spotify") {
        const exportProps = exportPropsGetter(exportFrom);
        dispatch(getExportThunkAction(exportFrom, exportTo, exportProps));
      }
    }
  };

  return (
    <div className="final">
      <div className="final__summary">
        <h2 className="final__summary__title">Export</h2>
        <div className="final__summary__apps">
          <div className="final__summary__apps__app">
            <h4>From</h4>
            <div>
              <img src={`logos/${exportFrom}.svg`} alt={exportFrom} />
              <h3>{exportFrom}</h3>
            </div>
          </div>
          <div className="final__summary__apps__app">
            <h4>To</h4>
            <div>
              <img src={`logos/${exportTo}.svg`} alt={exportTo} />
              <h3>{exportTo}</h3>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="final__process__info">
          <Loader />
          <h2>{message}</h2>
        </div>
      ) : (
        <div className="final__buttons">
          <button
            id="start"
            type="button"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isError ? "Try again" : "Start"}
          </button>
          <button id="reset" type="button" onClick={() => dispatch(reset())} disabled>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalStep;
