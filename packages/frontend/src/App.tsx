import { useAppSelector, useAppDispatch } from "./app/hooks";
import Reddit from "./features/reddit/Reddit";
import WindowOpener from "./components/WindowOpener";
import { opened, closed } from "./features/windowOpener";
import { setToken } from "./app/smsSlice";

function App(): JSX.Element {
  const { target, isOpened } = useAppSelector((state) => state.windowOpener);
  const dispatch = useAppDispatch();

  const onOpen = (): void => {
    dispatch(opened(target));
  };

  const onClose = (): void => {
    dispatch(closed());
  };

  const onMessage = (e: MessageEvent): void => {
    const message = e.data;
    if (message.source !== "save-my-social") return;

    if (message.type === "accessToken") {
      console.log("RETURNED MESSAGE:", message);
      dispatch(setToken(message.accessToken));
    } else if (message.type === "closeOrder") {
      console.log("close order");
      onClose();
    } else if (message.type === "error") {
      // TODO handle error
    }
  };

  return (
    <div className="App">
      <h1>APP</h1>
      <Reddit />
      <WindowOpener
        target={target}
        onOpen={onOpen}
        onClose={onClose}
        onMessage={onMessage}
        shouldBeOpened={isOpened}
      />
    </div>
  );
}

export default App;
