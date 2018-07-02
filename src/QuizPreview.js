import React, {Component} from 'react';
import 'react-quill/dist/quill.snow.css';
import Button from '@material-ui/core/Button';


const JSON =    {
    "name": "Slide 3", "identifier": "0.3e6wwp8j4zl",
    "content": {
        "question": "Quiz question on slide 3",
        "answers": [
            {"option": "Answer 1", "correct": false},
            {"option": "Answer 2", "correct": false},
            {"option": "Answer 3", "correct": true}]
    }, "type": "quiz"
};

//next / previous Buttons

const test = "<h1> YOOY </h1>"

class QuizPreview extends Component {
    constructor(props) {
        super();
        this.state= {
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
            <div><p>{this.props.content.question? (this.props.content.question) : ("This quiz does not yet have a question.")}</p>
                {this.props.content.answers.map(function(answer, i) {
                    if (answer.option) {
                        const isCorrect = (that.state.realAnswers[i] === that.state.userAnswers[i]);
                        return <div key={i+1}><input key={i} onChange={function(ev){that.updateUserAnswers(ev.target, i)}} type="checkbox" /> {answer.option} <br/>
                            <section key={i+2}
                                     hidden={!that.state.hasSubmitted}
                                     style={{background: isCorrect ? "lightgreen" : "red"}}>
                                {"This option was " + (that.state.realAnswers[i] ? " correct" : " wrong")}
                            </section>
                        </div>
                    }
                }
                )}
                <Button variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => this.checkAnswers()}>
                Submit
                </Button>
                </div>

        )
    }
}

export default QuizPreview;