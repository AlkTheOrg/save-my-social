import { memo } from "react";
import "../styles/Header.scss";

const Header = (): JSX.Element => {
  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="logo">
          <img src="logos/sms-logo.png" alt="App Logo" />
        </a>
        <div className="links">
          <a
            href="https://github.com/AlkTheOrg/save-my-social#save-my-social----"
            target="_blank"
            rel="noreferrer"
          >
            About
          </a>
          <a href="https://twitter.com/alk_org" target="_blank" rel="noreferrer">
            <img id="twitter" src="logos/twitter.svg" alt="Twitter" />
          </a>
          <a href="https://github.com/AlkTheOrg" target="_blank" rel="noreferrer">
            <img id="github" src="logos/github.svg" alt="GitHub" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
