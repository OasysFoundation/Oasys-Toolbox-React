import {Component} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import registerServiceWorker from './registerServiceWorker';
import {Router, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import { withRouter } from 'react-router'
import LessonMaker from './LessonMaker/LessonMaker'

import 'bootstrap/dist/css/bootstrap.css';
import "./styles/scss_coreui/style.css"
import "simple-line-icons/css/simple-line-icons.css"


const history = createBrowserHistory();

class Index extends Component {
    render() {
        return (
            <div>
                <Router history={history}>
                    <div>
                        {/*<NavBar authUser={this.state.authUser}/>*/}
                        <Switch>
                            {/*<Route exact path="/" render={()=><ContentSelection/>} />*/}
                            <Route exact path="/" render={(props) => <LessonMaker {...props} />} />
                            {/*<Route path="/data" render={(props)=>( this.state.authUser ? <DataViewCreator authUser={this.state.authUser} /> : null)} />*/}
                            {/*<Route path="/data/preview" render={(props)=>( this.state.authUser ? <DataViewCreator authUser={this.state.authUser} /> : null)} />*/}
                            {/*<Route path="/explore" render={(props)=>( this.state.authUser ? <ContentSelection authUser={this.state.authUser} /> : null)} />*/}
                            {/*<Route path="/create/:userId/:contentId" render={(props)=>(<Editor authUser={this.state.authUser} {...props}/>)} />*/}
                            {/*<Route path="/create" render={(props)=>(<Editor authUser={this.state.authUser}/>)} />*/}

                            {/*<Route path="/games/:name" component={GameEmbedder} />*/}
                            {/*<Route path="/games" component={ContentViewTest} />*/}
                            {/*<Route path="/login" component={LoginPage} />*/}
                            {/*<Route path="/signup" component={SignupPage} />*/}

                            {/*<Route path="/user/:username/:contentname" render={(props)=>(<ContentView authUser={this.state.authUser}/>)} />*/}
                            {/*<Route path="/user/:username" component={UserPage}/>*/}
                            {/*<Route path="/user" render={(props)=>(<MyAccountPage authUser={this.state.authUser}/>)} />*/}
                            {/*<Route path="/forgotPassword" component={PasswordForget}/>*/}
                            {/*<Route path="/resetPassword" component={PasswordReset}/>*/}

                            {/*<Route path="/wallet" component={Wallet}/>*/}

                            {/*<Route path="/help" component={Help}/>*/}

                            {/*<Route path="/comments/:userId/:contentId" render={(props)=>(<Comment name={this.state.authUser}/>)} />*/}


                            {/*<Route component={NotFoundPage}/>*/}
                        </Switch>
                        

                    </div>
                </Router>
            </div>
        )
    }
}

export default withRouter(Index);


ReactDOM.render(<Index/>, document.getElementById('root'));
registerServiceWorker();