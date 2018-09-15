import {Component} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
//import registerServiceWorker from './utils/registerServiceWorker';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'redux-zero/react';

import store from "./store/store";

import {withRouter} from 'react-router'
import LessonMaker from './LessonMaker/LessonMaker'
import DataViewCreator from './DataView/DataViewCreator'
import AccountPage from './AccountPage'
import PublicAccountPage from './PublicAccountPage'
import PrivacyPolicyPage from './PrivacyPolicyPage'
import Snackbar from './Snackbar'
import "simple-line-icons/css/simple-line-icons.css"
import "./assets/fontAwesome/css/all.min.css"
import "./styles/coreui/coreui.css"
import "@coreui/icons/css/coreui-icons.css"
import './styles/index.css';

import Navbar from './Navbar';
import Footer from "./Footer";
import About from "./About"
import LandingPageController from "./ExploreContent/LandingPageController"

import ConcludingContentPage from './ConcludingContentPage'

import ContentView from "./LessonMaker/ContentView";
import ContentOverview from './ContentOverview';

import Bitmoji from './utils/Bitmoji'
import Authentication from "./Authentication/Authentication";

import ScrollToTop from './ScrollToTop';
import InjectFromStore from './InjectFromStore';
// import {Redirect} from 'react-router'

//logs unnecessary rerenders in the console
// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update');
//     whyDidYouUpdate(React);
// }

import history from './history'
import {auth} from "./Authentication/firebase";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
        }
    }

    handleChangeSearchBar(newVal) {
        this.setState({category: newVal})
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

    render() {
        return (
            <div className="oasys app">
                <Provider store={store}>
                    <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
                        <div>

                            <Navbar onChange={this.handleChangeSearchBar.bind(this)}/>

                            <InjectFromStore select={(state)=>({message:state.snackbarMessage})}>
                                { (props) => <Snackbar message={props.message}/> }
                            </InjectFromStore>

                            <Switch>
                            <ScrollToTop>

                                <Route exact path="/auth" render={(routerProps) => 
                                    <Authentication {...routerProps} />}/>

                                <Route exact path="/" render={(routerProps) => 
                                    <LandingPageController {...routerProps} category={this.state.category}/>}/>
                                <Route exact path="/explore" render={(routerProps) => 
                                    <LandingPageController {...routerProps} category={this.state.category}/>}/>
                                <Route exact path="/learn" render={(routerProps) => 
                                    <LandingPageController {...routerProps} />}/>

                                <Route exact path="/data" render={(routerProps) => 
                                    <DataViewCreator {...routerProps} />}/>
                                <Route exact path="/about" render={(routerProps) => 
                                    <About {...routerProps} />}/>
                                <Route exact path="/privacy" render={(routerProps) => 
                                    <PrivacyPolicyPage {...routerProps} />}/>

                                <Route exact path="/account" render={(routerProps) => 
                                    <AccountPage {...routerProps} />}/>
                                <Route path="/user/:username/:uid" render={(routerProps) => 
                                    <PublicAccountPage {...routerProps} />}/>
                                <Route exact path="/bitmoji" render={(routerProps) => 
                                    <Bitmoji  {...routerProps} />}/>

                                <Route exact path="/create/:username?/:title?/:uid?/:contentId?" render={(routerProps) => 
                                    <LessonMaker {...routerProps} />}/>
                                <Route exact path="/view/:username/:title/:uid/:contentId/" render={(routerProps) => 
                                    <ContentOverview {...routerProps} />}/>
                                <Route path="/view/:username/:title/:uid/:contentId/:chapterIndex" render={(routerProps) => 
                                    <ContentView {...routerProps} chapters={store.getState().chapters}/>}/>
                                <Route exact path="/conclusion" render={(routerProps) => 
                                    <ConcludingContentPage  {...routerProps} />}/>

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

ReactDOM.render(<Index/>, document.getElementById('root'));
//registerServiceWorker();

export default withRouter(Index);