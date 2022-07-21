import { useAppDispatch } from "./app/hooks";
import { getAuthURL } from "./features/reddit/redditSlice";
import Reddit from "./features/reddit/Reddit";

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  dispatch(getAuthURL());
  return (
    <div className="App">
      <Reddit />
      <h1>Hello</h1>
    </div>
  );
}

export default App;
