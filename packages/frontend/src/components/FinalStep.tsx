import { useAppDispatch, useAppSelector } from "../app/hooks";
import { importItems } from "../features/notion/notionSlice";
import "../styles/FinalStep.scss";
import Loader from "./Loader";

const FinalStep = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    exportFrom,
    exportTo,
    isLoading,
    message,
  } = useAppSelector((state) => state.sms);

  const handleClick = () => {
    dispatch(
      // TODO dynamically decide dispatch type from import type
      importItems(
        // TODO dynamically decide this from export type
        (lastItemID: string) => ({ reddit: { saved: { lastItemID } } }),
      ),
    );
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

      { isLoading ? (
        <div className="final__process__info">
          <Loader />
          <h2>{message}</h2>
        </div>
      ) : (
        <div className="final__buttons">
          <button id="start" type="button" onClick={handleClick} disabled={isLoading}>
            Start Process
          </button>
          <button id="reset" type="button" onClick={handleClick} disabled>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalStep;
