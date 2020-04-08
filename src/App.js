import React, { Component, createContext } from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Homepage from "./Homepage";
import SubmitPage from "./SubmitPage";
import AboutPage from "./AboutPage";
import LocationSelectionPage from "./LocationSelectionPage";
import { ScrollToTop } from "./utils";
import Navbar from "react-bootstrap/Navbar";
import PWAInstallButton from "./PWAButton";
import ReactGA from "react-ga";
import logo from "./Logo.svg";
import { AVAILABLE_LANGUAGES } from "./constants";
import translations from "./translations";

const history = createBrowserHistory();
if (process.env.NODE_ENV !== "development") {
  ReactGA.initialize("UA-162047555-1");
  ReactGA.pageview(window.location.pathname);
  history.listen(location => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });
}

const IconToggle = React.forwardRef(({ onClick }, ref) => (
  <i
    ref={ref}
    onClick={onClick}
    tabIndex={0}
    className="far fa-language language_icon"
  />
));

const AppNavbar = ({ setLanguage, currentLanguage }) => {
  return (
    <>
      <Navbar bg="light" variant="light" fixed="top">
        <Navbar.Brand className="navbar-brand">
          <Link to="/">
            <img
              alt="Covid Maps"
              src={logo}
              height="24"
              className="d-inline-block align-top"
            />{" "}
          </Link>
        </Navbar.Brand>
        <Dropdown className="dropdown--translation">
          <Dropdown.Toggle as={IconToggle} />
          <Dropdown.Menu>
            {Object.keys(AVAILABLE_LANGUAGES).map(key => {
              const langValue = AVAILABLE_LANGUAGES[key];
              return (
                <Dropdown.Item
                  key={langValue}
                  active={currentLanguage === langValue}
                  onClick={() => setLanguage(langValue)}
                >
                  {langValue}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        {/* <PWAInstallButton /> */}
      </Navbar>
    </>
  );
};

const AppContext = createContext();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: this.getDefaultLanguage()
    };
  }

  setLanguage = language => {
    this.persistLastSelectedLanguage(language);
    this.setState({ language });
  };

  persistLastSelectedLanguage = language => {
    if (window.localStorage) {
      localStorage.setItem("lastSelectedLanguage", language);
    }
  };

  getDefaultLanguage = () => {
    if (window.localStorage) {
      const language = localStorage.getItem("lastSelectedLanguage");
      return language || AVAILABLE_LANGUAGES.ENGLISH;
    }
  };

  getTranslations = () => {
    return {
      ...translations[AVAILABLE_LANGUAGES.ENGLISH],
      ...translations[this.state.language]
    };
  };

  render() {
    return (
      <Router history={history}>
        <AppContext.Provider
          value={{
            translations: this.getTranslations()
          }}
        >
          <div className="App">
            <ScrollToTop />
            <AppNavbar
              currentLanguage={this.state.language}
              setLanguage={this.setLanguage}
            />
            <div className="page">
              <Switch>
                <Route path="/update" component={SubmitPage} />
                <Route path="/location" component={LocationSelectionPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/" component={Homepage} />
              </Switch>
            </div>
            <footer className="m-0 p-0">
              <div className="container py-4 text-center text-uppercase">
                <Link to="/">Home</Link> ·{" "}
                <Link to="/location">Add a store</Link> ·{" "}
                <Link to="/about">About</Link>
              </div>
            </footer>
          </div>
        </AppContext.Provider>
      </Router>
    );
  }
}

export function withGlobalContext(Component) {
  return function WrapperComponent(props) {
    return (
      <AppContext.Consumer>
        {context => <Component {...props} {...context} />}
      </AppContext.Consumer>
    );
  };
}

export default App;
