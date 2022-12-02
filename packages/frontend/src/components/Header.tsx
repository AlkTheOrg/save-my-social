import "../styles/Header.scss";

const Header = (): JSX.Element => {
  return (
    <header>
      <div className="logo" />
      <div className="links">
        <a href="/">About</a>
        <a href="https://twitter.com/alk_org" target="_blank" rel="noreferrer">
          <img id="twitter" src="logos/twitter.svg" alt="Twitter" />
        </a>
        <a href="https://github.com/AlkTheOrg" target="_blank" rel="noreferrer">
          <img id="github" src="logos/github.svg" alt="GitHub" />
        </a>
      </div>
    </header>
  );
};

export default Header;
