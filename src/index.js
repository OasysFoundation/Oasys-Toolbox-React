import {Component} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
//import registerServiceWorker from './utils/registerServiceWorker';
import {Router, Route, Switch} from 'react-router-dom';

import {withRouter} from 'react-router'
import LessonMaker from './LessonMaker/LessonMaker'
import DataViewCreator from './DataView/DataViewCreator'
import AccountPage from './AccountPage'
import PublicAccountPage from './PublicAccountPage'

import PrivacyPolicyPage from './PrivacyPolicyPage'

import "simple-line-icons/css/simple-line-icons.css"
import "./assets/fontAwesome/css/all.min.css"
import "./styles/coreui/coreui.css"
import "@coreui/icons/css/coreui-icons.css"
import './styles/index.css';

import Navbar from './Navbar';
import Footer from "./Footer";
import About from "./About"
import LandingPageController from "./ExploreContent/LandingPageController"

import {Provider} from "redux-zero/react";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import ConcludingContentPage from './ConcludingContentPage'


import store from "./store/store";
import ContentView from "./LessonMaker/ContentView";
import ContentOverview from './ContentOverview';

import Bitmoji from './utils/Bitmoji'
import Authentication from "./Authentication/Authentication";

import ScrollToTop from './ScrollToTop';
// import {Redirect} from 'react-router'

//logs unnecessary rerenders in the console
// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update');
//     whyDidYouUpdate(React);
// }

import history from './history'
import {auth} from "./Authentication/firebase";

// check if there are components that are rendered unnecessarily
// const {whyDidYouUpdate} = require('why-did-you-update');
// whyDidYouUpdate(React);


class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            snackBarMessage: null,
        }
        this.onCloseSnackBar = this.onCloseSnackBar.bind(this);
        this.handleSnackBarMessage = this.handleSnackBarMessage.bind(this);
    }

    componentDidMount() {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                //console.log('user here: ', user);
                const {displayName, uid} = user;
                const idToken =  auth.currentUser.getIdToken(true).then(function(idToken) {
                    store.setState({
                        user:
                            {
                                displayName,
                                uid,
                                idToken,
                            }
                    })
                });
                
                // User is signed in.
            }
            else {
                store.setState({
                    user:
                        {
                            displayName: null,
                            uid: null,
                            idToken: null,
                        }
                })
            }
        });
    }

    handleChangeSearchBar(newVal) {
        this.setState({category: newVal})
    }

    onCloseSnackBar() {
        this.setState({
            snackBarMessage: null
        });
    }

    handleSnackBarMessage() {
        this.setState({
            snackBarMessage: null
        });
    }

    render() {
        const props = {
            sendSnackBarMessage: this.handleSnackBarMessage,
        }

        return (
            <div className="oasys app">
                <Provider store={store}>
                    <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
                        <div>

                            {<Navbar onChange={this.handleChangeSearchBar.bind(this)}/>}

                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                open={Boolean(this.state.snackBarMessage)}
                                autoHideDuration={6000}
                                onClose={this.onCloseSnackBar}
                            >
                                <SnackbarContent
                                    aria-describedby="client-snackbar"
                                    message={
                                        <span id="client-snackbar">
                                      {this.state.snackBarMessage}
                                    </span>
                                    }
                                />
                            </Snackbar>

                            <Switch>
                            <ScrollToTop>
                                <Route exact path="/auth" render={(routerProps) => 
                                    <Authentication {...routerProps} {...props} />}/>

                                <Route exact path="/" render={(routerProps) => 
                                    <LandingPageController {...routerProps} {...props} category={this.state.category}/>}/>
                                <Route exact path="/explore" render={(routerProps) => 
                                    <LandingPageController {...routerProps} {...props} category={this.state.category}/>}/>
                                <Route exact path="/learn" render={(routerProps) => 
                                    <LandingPageController {...routerProps} {...props} />}/>

                                <Route exact path="/data" render={(routerProps) => 
                                    <DataViewCreator {...routerProps} {...props} />}/>
                                <Route exact path="/about" render={(routerProps) => 
                                    <About {...routerProps} {...props} />}/>
                                <Route exact path="/privacy" render={(routerProps) => 
                                    <PrivacyPolicyPage {...routerProps} {...props} />}/>

                                <Route exact path="/account" render={(routerProps) => 
                                    <AccountPage {...routerProps} {...props} />}/>
                                <Route path="/user/:username/:uid" render={(routerProps) => 
                                    <PublicAccountPage {...routerProps} {...props} />}/>
                                <Route exact path="/bitmoji" render={(routerProps) => 
                                    <Bitmoji  {...routerProps} {...props} />}/>

                                <Route exact path="/create/:username?/:title?/:uid?/:contentId?" render={(routerProps) => 
                                    <LessonMaker {...routerProps} {...props} />}/>
                                <Route exact path="/view/:username/:title/:uid/:contentId/" render={(routerProps) => 
                                    <ContentOverview {...routerProps} {...props} />}/>
                                <Route path="/view/:username/:title/:uid/:contentId/:chapterIndex" render={(routerProps) => 
                                    <ContentView {...routerProps} {...props} chapters={store.getState().chapters}/>}/>
                                <Route exact path="/conclusion" render={(routerProps) => 
                                    <ConcludingContentPage  {...routerProps} {...props} />}/>
                            </ScrollToTop>
                            </Switch>
                            <Route path={"/*"} component={Footer}/>
                        </div>
                    </Router>
                </Provider>
            </div>
        )
    }
}


export default withRouter(Index);


ReactDOM.render(<Index/>, document.getElementById('root'));
//registerServiceWorker();