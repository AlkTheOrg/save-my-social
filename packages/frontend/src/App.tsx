import { useAppDispatch, useAppSelector } from "./app/hooks";
import { setToken } from "./app/smsSlice";
import { stepsByOrder } from "./app/steps";
import FinalStep from "./components/FinalStep";
import Finished from "./components/Finished";
import Header from "./components/Header";
import SocialApps from "./components/SocialApps";
import Stepper from "./components/Stepper";
import WindowOpener from "./components/WindowOpener";
import { closed, opened } from "./features/windowOpener";
import "./styles/App.scss";
import "./styles/reset.css";

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
      console.log("RETURNED MESSAGE:", message);
      dispatch(setToken(message.accessToken));
    } else if (message.type === "closeOrder") {
      console.log("close order");
      onWindowClose();
    } else if (message.type === "error") {
      // TODO handle error
    }
  };

  const renderSwitch = () => {
    switch (curStepName) {
      case "final":
        return <FinalStep />;
      case "finished":
        return <Finished />;
      default:
        return <SocialApps />;
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
    </div>
  );
}

export default App;
