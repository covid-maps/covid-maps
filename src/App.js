import React, {useState} from "react";
import {Router, Switch, Route, Link} from "react-router-dom";
import {createBrowserHistory} from "history";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.scss";
import "./assets/styles/components/components.scss";

// Assets
import logo from "./assets/media/Logo.svg";

// Pages
import Homepage from "./Homepage";
import SubmitPage from "./SubmitPage";
import AboutPage from "./AboutPage";
import LocationSelectionPage from "./LocationSelectionPage";
import {ScrollToTop} from "./utils";
import {Navbar, Button} from "react-bootstrap";
import PWAPrompt from "react-ios-pwa-prompt"
import Nav from "react-bootstrap/Nav";
import ReactGA from "react-ga";

const history = createBrowserHistory();
if (process.env.NODE_ENV !== "development") {
    ReactGA.initialize("UA-162047555-1");
    ReactGA.pageview(window.location.pathname);
    history.listen(location => {
        ReactGA.set({page: location.pathname});
        ReactGA.pageview(location.pathname);
    });
}

function addToHomeScreen(pwaPromptChangeState) {
    if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform)) {
        pwaPromptChangeState(false)
        process.nextTick(() => {
            pwaPromptChangeState(true)
        })
    } else {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt()
        }
    }

}

function AppNavbar() {
    const [pwaPromptState, pwaPromptChangeState] = useState(false)
    const [a2hsButtonState, a2hsButtonChangeState] = useState(false)
    //Adds the `deferredPrompt` object to the window.
    window.addEventListener('beforeinstallprompt', function (event) {
        a2hsButtonChangeState(true)
        event.preventDefault();
        window.deferredPrompt = event
    });
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
                <Nav className="ml-auto">
                    <Link to="/about">About</Link>
                    <Link to="/update">Add store</Link> ·{" "}
                </Nav>

                {
                    a2hsButtonState &&
                    <Button
                        size="sm"
                        variant="outline-success"
                        className="ml-auto a2hs-button"
                        onClick={() => addToHomeScreen(pwaPromptChangeState)}
                    >
                        Add To Home Screen
                    </Button>
                }
            </Navbar>
            {
                pwaPromptState &&
                <PWAPrompt
                    debug={true}
                    promptOnVisit={50}
                    timesToShow={50}
                    delay={200}
                    copyClosePrompt="Close"
                    permanentlyHideOnDismiss={false}/>
            }
        </>
    );
}

function App() {
    return (
        <Router history={history}>
            <div className="App">
                <ScrollToTop/>
                <AppNavbar/>
                <div className="page">
                    <Switch>
                        <Route path="/update" component={SubmitPage}/>
                        <Route path="/location" component={LocationSelectionPage}/>
                        <Route path="/about" component={AboutPage}/>
                        <Route path="/" component={Homepage}/>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
