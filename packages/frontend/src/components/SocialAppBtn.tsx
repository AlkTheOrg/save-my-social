import { KeyboardEvent, memo } from "react";

export type Props = {
  onClick: () => void,
  text: string,
  logoPath: string,
  buttonClass?: string,
  isDisabled?: boolean,
  disabledText?: string,
}

const SocialAppBtn: (props: Props) => JSX.Element = ({
  onClick,
  text,
  logoPath,
  buttonClass = "",
  isDisabled = false,
  disabledText = "",
}) => {
  const handleKeyUp = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === "Enter") onClick();
  };

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      onKeyUp={handleKeyUp}
      disabled={isDisabled}
      aria-label={`${text} button`}
    >
      <img src={logoPath} aria-hidden alt={`${text} logo`} />
      <h3>{text === "Unselected" ? "Select" : text}</h3>
      { isDisabled && disabledText && <p className="disabled-info">{disabledText}</p>}
    </button>
  );
};

export default memo(SocialAppBtn);
