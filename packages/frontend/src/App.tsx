import { useAppSelector, useAppDispatch } from "./app/hooks";
import WindowOpener from "./components/WindowOpener";
import { opened, closed } from "./features/windowOpener";
import { setToken } from "./app/smsSlice";
import SocialApps from "./components/SocialApps";
import "./styles/reset.css";
import Header from "./components/Header";

function App(): JSX.Element {
  const { target, isOpened } = useAppSelector((state) => state.windowOpener);
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

  return (
    <div className="App">
      <Header />
      <SocialApps />
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
