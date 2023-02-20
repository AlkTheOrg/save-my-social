import { KeyboardEvent } from "react";

export type Props = {
  onClick: () => void,
  name: string,
  logoPath: string,
  buttonClass?: string,
  isDisabled?: boolean,
}

const SocialAppBtn: (props: Props) => JSX.Element = ({
  onClick,
  name,
  logoPath,
  buttonClass = name === "Unselected" ? "unselected" : "",
  isDisabled = false,
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
      aria-label={`${name} button`}
    >
      <img src={logoPath} aria-hidden alt={`${name} logo`} />
      <h3>{name === "Unselected" ? "Select" : name}</h3>
    </button>
  );
};

export default SocialAppBtn;
