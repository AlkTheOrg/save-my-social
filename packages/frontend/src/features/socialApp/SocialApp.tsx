import { SmsApp } from "../../app/smsSlice";
import SocialAppBtn from "../../components/SocialAppBtn";

type Props = {
  appName: SmsApp;
  btnText: string;
  onClick: (...args: unknown[]) => void;
  isDisabled?: boolean;
  disabledText?: string
};

const SocialApp: (props: Props) => JSX.Element = ({
  appName,
  btnText,
  onClick,
  isDisabled,
  disabledText,
}) => {
  return (
    <SocialAppBtn
      buttonClass="social-app"
      onClick={onClick}
      text={btnText}
      logoPath={`logos/${appName}.svg`}
      isDisabled={isDisabled}
      disabledText={disabledText}
    />
  );
};

export default SocialApp;
