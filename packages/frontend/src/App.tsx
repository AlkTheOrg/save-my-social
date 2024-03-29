import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { setError, setToken } from "./app/smsSlice";
import { stepsByOrder } from "./app/steps";
import MainStep from "./components/MainStep";
import Finished from "./components/Finished";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import WindowOpener from "./components/WindowOpener";
import { closed, opened } from "./features/windowOpener";
import "./styles/App.scss";
import "./styles/reset.css";
import "react-toastify/dist/ReactToastify.css";

function App(): JSX.Element {
  const { target, isOpened } = useAppSelector((state) => state.windowOpener);
  const curStep = useAppSelector((state) => state.sms.curStep);
  const curStepName = stepsByOrder[curStep];

  const dispatch = useAppDispatch();

  const onWindowOpen = (): void => {
    dispatch(opened(target));
  };

  const onWindowClose = (): void => {
    dispatch(closed());
  };

  const onWindowMessage = (e: MessageEvent): void => {
    const message = e.data;
    if (message.source !== "save-my-social") return;

    if (message.type === "accessToken") {
      dispatch(setToken(message.accessTokenIsSet));
    } else if (message.type === "closeOrder") {
      onWindowClose();
    } else if (message.type === "error") {
      dispatch(setError(message.error));
    }
  };

  const renderSwitch = () => {
    switch (curStepName) {
      case "Finished":
        return <Finished />;
      default:
        return <MainStep />;
    }
  };

  return (
    <div className="App">
      <Header />
      <Stepper
        steps={Object.values(stepsByOrder)}
        curStep={curStep}
      />
      {renderSwitch()}
      <WindowOpener
        target={target}
        onOpen={onWindowOpen}
        onClose={onWindowClose}
        onMessage={onWindowMessage}
        shouldBeOpened={isOpened}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
