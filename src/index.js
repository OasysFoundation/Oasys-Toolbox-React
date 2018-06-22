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
const history = createBrowserHistory();


class Index extends Component {
    render() {
        return (
            <div>
                <BrowserRouter history={history}>
                    <div>
                        <NavBar/>
                        <Switch>
                            <Route exact path="/" component={ContentSelection}/>
                            <Route path="/learn" component={ContentSelection}/>
                            <Route path="/create" component={Editor} />

                            <Route path="user/:username/:contentname" component={ContentViewTest}/>
                            <Route path="user/:username" component={UserPage}/>
                            <Route path="user/" component={UserPage}/>


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
        <h3>ContentName: {match.params.contentname}</h3>
    </div>
);


export default Index;


ReactDOM.render(<Index/>, document.getElementById('root'));
registerServiceWorker();