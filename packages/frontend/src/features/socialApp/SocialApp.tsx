import { useAppDispatch } from "../../app/hooks";
import {
  setExportFrom,
  SmsApp,
  appsToExportFrom,
  ExportFrom,
  setExportTo,
} from "../../app/smsSlice";
import SocialAppBtn from "../../components/SocialAppBtn";
import {
  AppToAuthURLGetterMapping,
  appToAuthURLGetterMapping,
} from "../../util/thunkMappings";

type Props = {
  appName: SmsApp;
  btnText: string;
  onClick?: (...args: unknown[]) => void;
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
  const dispatch = useAppDispatch();

  const handleClick = (): void => {
    if (onClick) onClick();
    if (appToAuthURLGetterMapping[appName as keyof AppToAuthURLGetterMapping]) {
      dispatch(appToAuthURLGetterMapping[appName as keyof AppToAuthURLGetterMapping]());
    }

    if ((appsToExportFrom as string[]).includes(appName)) {
      dispatch(setExportFrom(appName as ExportFrom));
    } else {
      dispatch(setExportTo(appName));
    }
  };

  return (
    <SocialAppBtn
      buttonClass="social-app"
      onClick={handleClick}
      text={btnText}
      logoPath={`logos/${appName}.svg`}
      isDisabled={isDisabled}
      disabledText={disabledText}
    />
  );
};

export default SocialApp;
