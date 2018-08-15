import {Component} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


//import EventPicker from './EventPicker'
import ContentSelection from "./ContentSelection";
import LandingPageController from "./landingPage/LandingPageController"
import NavBar from "./NavBar"
import NotFoundPage from "./NotFoundPage"
import Editor from "./editor/Editor"
import DataViewCreator from "./analytics/DataViewCreator";

import {Router, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import MyAccountPage from './MyAccountPage'
import SignupPage from './SignupPage'
import LoginPage from './LoginPage'
import PasswordForget from './PasswordForget'
import PasswordReset from './PasswordReset'


import { firebase } from './firebase';
import ContentView from './ContentView'

import { withRouter } from 'react-router'
import GameEmbedder from "./GameEmbedder";

//import UserProjects from './UserProjects';
import UserPublicProjects from './UserPublicProjects'


import Wallet from './Wallet'
import Comment from './Comment'

import Help from './Help'
import Foxy from './Foxy'

import UserPage from './UserPage';
import LessonMaker from './LessonMaker/LessonMaker'

import 'bootstrap/dist/css/bootstrap.css';
import "./scss_coreui/style.css"
import "simple-line-icons/css/simple-line-icons.css"
// import "@coreui/icons/"

//fontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import {faFlag} from '@fortawesome/free-solid-svg-icons'
import {faComment} from '@fortawesome/free-solid-svg-icons'
import {faObjectGroup} from '@fortawesome/free-solid-svg-icons'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import {faLayerGroup} from '@fortawesome/free-solid-svg-icons'


library.add(faEllipsisV)
library.add(faPencilAlt)
library.add(faFlag)
library.add(faComment)
library.add(faObjectGroup)
library.add(faUser)
library.add(faLayerGroup)


const history = createBrowserHistory();



class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
            category: "",
        };
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
            ? this.setState(() => ({ authUser }))
            : this.setState(() => ({ authUser: "loggedOut" }));
        });
    }
    componentDidMount() {
        
    }

    handleChangeSearchBar(newVal){
        this.setState({category:newVal})
    }

    render() {
        console.log("Index has run");
        return (
            <div>
                <Router history={history}>
                    <div>
                        <NavBar authUser={this.state.authUser} onChange={this.handleChangeSearchBar.bind(this)}/>
                        <Switch>
                            <Route exact path="/" render={(props)=><LandingPageController category={this.state.category}/>} />
                            <Route path="/maker" render={(props) => <LessonMaker {...props} />} />
                            <Route path="/data" render={(props)=>( this.state.authUser ? <DataViewCreator authUser={this.state.authUser} /> : null)} />
                            <Route path="/data/preview" render={(props)=>( this.state.authUser ? <DataViewCreator authUser={this.state.authUser} /> : null)} />
                            <Route path="/explore" render={(props)=>( this.state.authUser ? <LandingPageController authUser={this.state.authUser}/> : null)} />
                            <Route path="/create/:userId/:contentId" render={(props)=>(<Editor authUser={this.state.authUser} {...props}/>)} />
                            <Route path="/create" render={(props)=>(<Editor authUser={this.state.authUser}/>)} />

                            <Route path="/games/:name" component={GameEmbedder} />
                            <Route path="/games" component={ContentViewTest} />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/signup" component={SignupPage} />

                            <Route path="/user/:username/:contentname" render={(props)=>(<ContentView authUser={this.state.authUser}/>)} />
                            <Route path="/user/:username" component={UserPage}/>
                            <Route path="/user" render={(props)=>(<MyAccountPage authUser={this.state.authUser}/>)} />
                            <Route path="/forgotPassword" component={PasswordForget}/>
                            <Route path="/resetPassword" component={PasswordReset}/>

                            <Route path="/wallet" component={Wallet}/>

                            <Route path="/help" component={Help}/>

                            <Route path="/comments/:userId/:contentId" render={(props)=>(<Comment name={this.state.authUser}/>)} />


                            <Route component={NotFoundPage}/>
                        </Switch>
                        

                    </div>
                </Router>
            </div>
        )
    }
}

const ContentViewTest = ({ match }) => (
    <div>
        <h3>ContentName: {match.params.contentname} of user: {match.params.username}</h3>
    </div>
);


export default withRouter(Index);


ReactDOM.render(<Index/>, document.getElementById('root'));
registerServiceWorker();