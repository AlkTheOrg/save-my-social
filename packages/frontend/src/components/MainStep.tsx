import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { reset, setStep } from "../app/smsSlice";
import "../styles/MainStep.scss";
import exportPropsGetter from "../util/exportPropsGetter";
import { getExportThunkAction } from "../util/thunkMappings";
import Loader from "./Loader";
import Modal from "./Modal";
import SocialApps from "./SocialApps";
import SocialAppBtn from "./SocialAppBtn";

const getAppLogoPath = (type?: string) => `logos/${type || "plus"}.svg`;

const MainStep = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    exportFrom, exportTo, isLoading, isError, message, areTokensSet,
  } = useAppSelector(
    (state) => state.sms,
  );

  const handleSocialAppBtnClick = () => {
    setIsModalOpen(true);
  };

  const handleFinish = () => {
    if (exportFrom && exportTo) {
      if (exportFrom === "reddit" || exportFrom === "spotify") {
        const exportProps = exportPropsGetter(exportFrom);
        dispatch(setStep(1));
        dispatch(getExportThunkAction(exportFrom, exportTo, exportProps));
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading={exportFrom ? "Select Export To" : "Select Export From"}
      >
        <SocialApps onAppClick={() => setIsModalOpen(false)} isDisabled={!isModalOpen} />
      </Modal>
      <div className="final">
        <div className="final__summary">
          <h2 className="final__summary__title">Export</h2>
          <div className="final__summary__apps">
            <div className="final__summary__apps__app">
              <h4>From</h4>
              <SocialAppBtn
                logoPath={getAppLogoPath(exportFrom)}
                text={exportFrom || "Unselected"}
                onClick={handleSocialAppBtnClick}
                buttonClass={exportFrom ? "" : "unselected"}
              />
            </div>
            <div className="final__summary__apps__app">
              <h4>To</h4>
              <SocialAppBtn
                logoPath={getAppLogoPath(exportTo)}
                text={exportTo || "Unselected"}
                onClick={handleSocialAppBtnClick}
                isDisabled={!areTokensSet[0]}
                buttonClass={exportFrom ? "" : "unselected"}
              />
            </div>
          </div>
        </div>

        {isLoading && <Loader />}
        {(isLoading || isError) && (
          <h2 className="final__process__info" aria-live="polite">{message}</h2>
        )}
        {!isLoading && (
        <div className="final__buttons">
          <button
            id="start"
            type="button"
            onClick={handleFinish}
            disabled={!(exportTo && exportFrom)}
            aria-label={
                !isError
                  ? `Start exporting from ${exportFrom} to ${exportTo}`
                  : "Try Again"
                }
          >
            {isError ? "Try again" : "Start"}
          </button>
          <button id="reset" type="button" onClick={() => dispatch(reset())}>
            Reset
          </button>
        </div>
        )}
      </div>
    </>
  );
};

export default MainStep;
