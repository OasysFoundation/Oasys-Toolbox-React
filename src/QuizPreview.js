import React, {Component} from 'react';
import 'react-quill/dist/quill.snow.css';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import {CoolPinkButton} from "./stylings";

const styles = {
    questionPreview: {
        marginTop: '20px',
        textAlign: 'left',
    },
    fontSize21: {
        fontSize: '21px',
    }
}

class QuizPreview extends Component {
    constructor(props) {
        super();
        this.state = {
            realAnswers: props.content.answers.map(a => a.correct),
            userAnswers: Array(props.content.answers.length).fill("not"),
            hasSubmitted: false
        };
        console.log(this.state);
        this.updateUserAnswers = this.updateUserAnswers.bind(this);
    }

    checkAnswers() {
        var isCorrect = true;
        for(var i = 0; i < this.state.realAnswers.length; i++)
        {
            if(isCorrect && this.state.realAnswers && this.state.userAnswers){
                isCorrect = ((this.state.realAnswers[i]=== true && this.state.userAnswers[i] === true) ||(this.state.realAnswers[i]=== false && this.state.userAnswers[i] === "not"));
            }
        }

        this.setState({hasSubmitted: true})
        if (this.props.onCompleted) {
            this.props.onCompleted();
        }
        if (this.props.sendAnalyticsToBackend) {
            this.props.sendAnalyticsToBackend(isCorrect);
        }
    }

    updateUserAnswers(e, index) {
        const answers = this.state.userAnswers.slice();
        if(e && e.target){
            answers[index] = e.target.checked;
            this.setState({
                userAnswers: answers
            })
        }
        // this.setState({
        // })
    }

    renderAnswer(answer, i){
        if (!answer.option) { 
            return; 
        }
        const isCorrect = ((this.state.realAnswers[i]=== true && this.state.userAnswers[i] === true) ||(this.state.realAnswers[i]=== false && this.state.userAnswers[i] === "not"));

        return (
            <div key={i + 1} style={{paddingLeft: '20px'}}>
                <div style={{display: 'flex'}}>
                    <Checkbox key={i}  onChange={(e) => {this.updateUserAnswers(e,i)}} />
                    <p style={styles.fontSize21}> {answer.option} </p>
                </div>
                <section key={i + 2}
                    hidden={!this.state.hasSubmitted}
                    style={{background: isCorrect ? "lightgreen" : "red", fontSize: '21px', marginLeft: '50px', paddingLeft: '5px'}}>
                    {isCorrect ? "You are right with this answer." : "Oops, this not correct."}
                </section>
            </div>
        )
    }

    render() {
        return (
            <div style={styles.questionPreview}>
                <FormControl component="fieldset">
                <FormGroup>
                <p style={styles.fontSize21}>{this.props.content.question 
                    ? (<FormLabel component="legend" style={styles.fontSize21}>
                        {this.props.content.question}
                        </FormLabel>) 
                    : ("This quiz does not yet have a question.")}</p>
                <div style={{paddingLeft: '20px'}}>
                    {this.props.content.answers.map((answer, i)=>this.renderAnswer(answer,i), this)}
                </div>
                </FormGroup>
                <div style={{display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '10px'}}>
                    <CoolPinkButton
                            onClick={() => this.checkAnswers()}>
                        Submit
                    </CoolPinkButton>
                </div>
                </FormControl>
            </div>

        )
    }
}

export default QuizPreview;