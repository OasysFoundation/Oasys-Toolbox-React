import {Component} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


import EventPicker from './EventPicker'
import ContentSelection from "./ContentSelection";
import NavBar from "./NavBar"
import NotFoundPage from "./NotFoundPage"
import Editor from "./Editor"

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import MyAccountPage from './MyAccountPage'
import SignupPage from './SignupPage'
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import PasswordForget from './PasswordForget'
import PasswordReset from './PasswordReset'


import { firebase } from './firebase';
import ContentView from './ContentView'
import GameEdit from "./GameEdit";

import { withRouter } from 'react-router'
import GameEmbedder from "./GameEmbedder";



const history = createBrowserHistory();



class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
        };
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
            ? this.setState(() => ({ authUser }))
            : this.setState(() => ({ authUser: "loggedOut" }));
        });
    }
    componentDidMount() {
        
    }


    render() {
        return (
            <div>
                <BrowserRouter history={history}>
                    <div>
                        <NavBar authUser={this.state.authUser}/>
                        <Switch>
                            <Route exact path="/" render={()=><ContentSelection/>} />
                            <Route path="/explore" component={ContentSelection}/>
                            <Route path="/create/:userId/:contentId" render={(props)=>(<Editor authUser={this.state.authUser} {...props}/>)} />
                            <Route path="/create" render={(props)=>(<Editor authUser={this.state.authUser}/>)} />

                            <Route path="/games/:name" component={GameEmbedder} />
                            <Route path="/games" component={ContentViewTest} />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/signup" component={SignupPage} />

                            <Route path="/user/:username/:contentname" component={ContentView}/>
                            <Route path="/user/:username" component={UserPage}/>
                            <Route path="/user" render={(props)=>(<MyAccountPage authUser={this.state.authUser}/>)} />
                            <Route path="/forgotPassword" component={PasswordForget}/>
                            <Route path="/resetPassword" component={PasswordReset}/>



                            <Route component={NotFoundPage}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}


const UserPage = ({ match }) => (
    <div>
        <h3>Username: {match.params.username}</h3>
    </div>
);

const ContentViewTest = ({ match }) => (
    <div>
        <h3>ContentName: {match.params.contentname} of user: {match.params.username}</h3>
    </div>
);


export default withRouter(Index);


ReactDOM.render(<Index/>, document.getElementById('root'));
registerServiceWorker();