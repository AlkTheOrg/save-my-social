import { KeyboardEvent } from "react";

export type Props = {
  onClick: () => void,
  name: string,
  logoPath: string,
  buttonClass?: string,
}

const SocialAppBtn: (props: Props) => JSX.Element = ({
  onClick,
  name,
  logoPath,
  buttonClass = "",
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
      aria-label={`${name} button`}
    >
      <img src={logoPath} aria-hidden alt={`${name} logo`} />
      <h3>{name}</h3>
    </button>
  );
};

export default SocialAppBtn;
