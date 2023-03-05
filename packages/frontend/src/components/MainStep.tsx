import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  reset,
  SelectionContext,
  setCurSelectionContext,
  setStep,
} from "../app/smsSlice";
import "../styles/MainStep.scss";
import exportPropsGetter from "../util/exportPropsGetter";
import { getExportThunkAction } from "../util/thunkMappings";
import Loader from "./Loader";
import Modal from "./Modal";
import SocialApps from "./SocialApps";
import SocialAppBtn from "./SocialAppBtn";
import TwitterConfirmModal from "./TwitterConfirmModal";

const getAppLogoPath = (type?: string) => `logos/${type || "plus"}.svg`;

const MainStep = (): JSX.Element => {
  const [isSocialAppsModalOpen, setIsSocialAppsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    exportFrom, exportTo, isLoading, isError, message, areTokensSet,
  } = useAppSelector(
    (state) => state.sms,
  );

  const handleSocialAppBtnClick = useCallback((newContext: SelectionContext) => {
    if (isLoading) return;
    dispatch(setCurSelectionContext(newContext));
    setIsSocialAppsModalOpen(true);
  }, [dispatch, isLoading]);

  const handleExportFromAppBtnClick = useCallback(
    () => handleSocialAppBtnClick("exportFrom"),
    [handleSocialAppBtnClick],
  );

  const handleExportToAppBtnClick = useCallback(
    () => handleSocialAppBtnClick("exportTo"),
    [handleSocialAppBtnClick],
  );

  const handleFinish = () => {
    if (exportFrom && exportTo) {
      // TODO: This is to disable ts lint errors. After imp of YT, this won't be necessary
      if (exportFrom !== "youtube") {
        const exportProps = exportPropsGetter(exportFrom);
        dispatch(setStep(1));
        dispatch(getExportThunkAction(exportFrom, exportTo, exportProps));
      }
    }
  };

  return (
    <>
      <div className="final">
        <div className="final__summary">
          <h2 className="final__summary__title">Export</h2>
          <div className="final__summary__apps">
            <div className="final__summary__apps__app">
              <h4>From</h4>
              <SocialAppBtn
                logoPath={getAppLogoPath(exportFrom)}
                text={exportFrom || "Unselected"}
                onClick={handleExportFromAppBtnClick}
                buttonClass={exportFrom ? "" : "unselected"}
              />
            </div>
            <div className="final__summary__apps__app">
              <h4>To</h4>
              <SocialAppBtn
                logoPath={getAppLogoPath(exportTo)}
                text={exportTo || "Unselected"}
                onClick={handleExportToAppBtnClick}
                isDisabled={!areTokensSet[0]}
                buttonClass={exportTo ? "" : "unselected"}
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

      <Modal
        isOpen={isSocialAppsModalOpen}
        onClose={() => setIsSocialAppsModalOpen(false)}
        heading={exportFrom ? "Select Export To" : "Select Export From"}
      >
        <SocialApps
          onAppClick={() => setIsSocialAppsModalOpen(false)}
          isDisabled={!isSocialAppsModalOpen}
        />
      </Modal>
      <TwitterConfirmModal />
    </>
  );
};

export default MainStep;
