import React, {Component} from 'react';
import 'react-quill/dist/quill.snow.css';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = {
    marginTop: {
        marginTop: '20px',
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
    }

    checkAnswers() {
        this.setState({hasSubmitted: true})
        if (this.props.onCompleted) {
            this.props.onCompleted();
        }
    }

    updateUserAnswers(inputEl, index) {
        console.log("inptel ", inputEl.checked, index)
        const answers = this.state.userAnswers.slice();
        answers[index] = inputEl.checked;
        this.setState({
            userAnswers: answers
        })
        // this.setState({
        // })
    }

    render() {
        const that = this;
        return (
            <div style={styles.marginTop}>
                <FormControl component="fieldset">
                <FormGroup>
                <p>{this.props.content.question 
                    ? (<FormLabel component="legend">{this.props.content.question}</FormLabel>) 
                    : ("This quiz does not yet have a question.")}</p>

                {this.props.content.answers.map(function (answer, i) {
                        if (answer.option) {
                            const isCorrect = (that.state.realAnswers[i] === that.state.userAnswers[i]);
                            return <div key={i + 1}>
                                <FormControlLabel
                                    control={
                                      <Checkbox key={i} onChange={function (ev) {that.updateUserAnswers(ev.target, i)}} />
                                    }
                                    label={answer.option} />
                                    <section key={i + 2}
                                         hidden={!that.state.hasSubmitted}
                                         style={{background: isCorrect ? "lightgreen" : "red"}}>
                                        {"This option was " + (that.state.realAnswers[i] ? " correct" : " wrong")}
                                    </section>
                                    </div>
                        }
                    }
                )}
                </FormGroup>
                <Button size="large"
                        color="primary"
                        onClick={() => this.checkAnswers()}
                        disabled={this.props.hyperVideoEditing}>
                    Submit
                </Button>
                </FormControl>
            </div>

        )
    }
}

export default QuizPreview;