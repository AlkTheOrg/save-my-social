import "../styles/Header.scss";
import { useAppSelector } from "../app/hooks";

const Header = (): JSX.Element => {
  const curStep = useAppSelector((state) => state.sms.curStep);
  return (
    <header>
      Header. Cur step is: {curStep}
    </header>
  );
};

export default Header;
