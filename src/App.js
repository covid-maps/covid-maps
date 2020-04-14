import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { Router, Switch, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Homepage from "./Homepage";
import SubmitPage from "./SubmitPage";
import AboutPage from "./AboutPage";
import LocationSelectionPage from "./LocationSelectionPage";
import { ScrollToTop } from "./utils";
import Navbar from "react-bootstrap/Navbar";
import PWAInstallButton from "./PWAButton";
import LanguageSelector from "./LanguageSelector";
import ReactGA from "react-ga";
import logo from "./Logo.svg";
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  STORAGE_KEYS,
} from "./constants";
import translations from "./translations";
import { withLocalStorage } from "./withStorage";

const history = createBrowserHistory();
if (process.env.NODE_ENV !== "development") {
  ReactGA.initialize("UA-162047555-1");
  ReactGA.pageview(window.location.pathname);
  history.listen(location => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });
}

const AppNavbar = () => {
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
        <PWAInstallButton />
      </Navbar>
    </>
  );
};

const AppContext = createContext();

class App extends Component {
  static propTypes = {
    getItemFromStorage: PropTypes.func.isRequired,
    setItemToStorage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      language: this.getDefaultLanguage(),
      currentLocation: { latLng: undefined, accuracy: 'low' },
    };
  }

  setLanguage = language => {
    this.persistLastSelectedLanguage(language);
    this.setState({ language });
  };

  persistLastSelectedLanguage = language => {
    this.props.setItemToStorage(STORAGE_KEYS.LANGUAGE, language);
  };

  getBrowserLanguageOrNull = () => {
    const browserLanguage = navigator.language.slice(0, 2).toUpperCase();
    const isBrowserLangSupported = AVAILABLE_LANGUAGES[browserLanguage];

    return isBrowserLangSupported ? browserLanguage : null;
  };

  getDefaultLanguage = () => {
    const preSelectedLanguage = this.props.getItemFromStorage(
      STORAGE_KEYS.LANGUAGE.LANGUAGE
    );

    return (
      preSelectedLanguage ||
      this.getBrowserLanguageOrNull() ||
      FALLBACK_LANGUAGE
    );
  };

  getTranslations = () => {
    return {
      ...translations[FALLBACK_LANGUAGE],
      ...translations[this.state.language],
    };
  };

  setCurrentLocation = (latLng, accuracy) => {
    this.setState({
      currentLocation: { latLng, accuracy }
    })
  }

  render() {
    const translations = this.getTranslations();
    return (
      <Router history={history}>
        <AppContext.Provider
          value={{
            translations,
            currentLanguage: this.state.language,
            setLanguage: this.setLanguage,
            currentLocation: this.state.currentLocation,
            setCurrentLocation: this.setCurrentLocation,
          }}
        >
          <div className="App">
            <ScrollToTop />
            <AppNavbar />
            <div className="page">
              <Switch>
                <Route path="/update" component={SubmitPage} />
                <Route path="/location" component={LocationSelectionPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/store/:storeId" component={Homepage} />
                <Route path="/" component={Homepage} />
              </Switch>
            </div>
            <footer className="m-0 p-0">
              <div className="container py-4 text-center text-uppercase">
                <Link to="/">{translations.home}</Link> ·{" "}
                <Link to="/location">{translations.add_store}</Link> ·{" "}
                <Link to="/about">{translations.about}</Link>
                <LanguageSelector />
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

export default withLocalStorage(App);
