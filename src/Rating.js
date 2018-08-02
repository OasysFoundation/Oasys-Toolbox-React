import React, {Component} from 'react';
import {Rate} from 'antd';
import 'antd/dist/antd.css';
import Comment from './Comment'
import DoneIcon from '@material-ui/icons/CheckCircle';
import {CoolPinkButton} from "./stylings";
import NextIcon from '@material-ui/icons/ArrowForward';
import {Unwrap} from "./utils"
import api from './tools'

var decode = require('urldecode')

class Rating extends Component {
    constructor(props) {
        super(props);

        const loc = window.location.href;
        const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
        const userName = Unwrap(directory[0])
        const contentName = Unwrap(directory[1])

        this.state = {
            value: props.value || 0,
            preview: props.preview,
            username: userName,
            contentname: contentName,
            rated: false

        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (value) => {
        console.log("rated")
        this.setState({
            value: value,
            rated: true
        });

        const {username, contentname} = this.state;
        const authUserProps = this.props.user
        const userWhoRates = (this.props.user.displayName || "Anonymous");


        if(authUserProps && authUserProps.displayName){
            let that = this;
            authUserProps.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                api.postRating(username/*contentowner*/, contentname, value/*rating*/, userWhoRates, authUserProps.uid ,idToken)
            }).catch(function(error) {
              console.log(error);
            });
        }
        else{
            api.postRating(username/*contentowner*/, contentname, value/*rating*/, userWhoRates, "authUserProps.uid" ,"idToken")
        }
    }

    render() {
        return (
            <div>
                {this.state.preview ? (
                    <Rate allowHalf value={this.state.value} disabled/>
                ) : (
                    <div style={{marginTop: '20px', textAlign: 'left'}}>
                        <center style={{marginBottom: '40px'}}>
                            <DoneIcon color="secondary" style={{fontSize: '100px'}}/>
                            <h1>Great! You finished learning this lesson successfully.</h1>
                            <CoolPinkButton onClick={() => window.location.replace('/')}>EXPLORE MORE
                            <NextIcon />
                            </CoolPinkButton>
                        </center>
                        <div><p> Please take a moment to give <i>{this.state.username}</i> some feedback
                            for <i>"{this.state.contentname}"</i>.<br/><br/>Tell us more about what you learned, how much
                            you learned, and how you liked the content you interacted with.</p></div>
                        <center style={{marginBottom: '40px', marginTop: '30px'}}>
                            {this.state.rated ? (
                                <Rate allowHalf value={this.state.value} disabled/>
                            ) : (
                                <Rate allowHalf onChange={this.handleChange} value={this.state.value}/>
                            )}
                        </center>
                        {/*<Comment name={this.props.user} slideNumber="end"/>*/}
                    </div>
                )}
            </div>
        )
    }
}

export default Rating;