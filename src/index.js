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

import { firebase } from './firebase';


const history = createBrowserHistory();


class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
        };
    }
    componentDidMount() {
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
            ? this.setState(() => ({ authUser }))
            : this.setState(() => ({ authUser: null }));
        });
    }

    render() {
        return (
            <div>
                <BrowserRouter history={history}>
                    <div>
                        <NavBar authUser={this.state.authUser}/>
                        <Switch>
                            <Route exact path="/" render={()=><HomePage  authUser={this.state.authUser}/>} />
                            <Route path="/explore" component={ContentSelection}/>
                            <Route path="/create" component={Editor} />

                            <Route path="/login" component={LoginPage} />
                            <Route path="/signup" component={SignupPage} />

                            <Route path="/user/:username/:contentname" component={ContentView}/>
                            <Route path="/user/:username" component={UserPage}/>
                            <Route path="/user" component={MyAccountPage}/>


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


export default Index;


ReactDOM.render(<Index/>, document.getElementById('root'));
registerServiceWorker();