import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

const STR_QUIZ_QUESTIONFIELD_EN = 'Formulate a question';
const STR_QUIZ_ANSWERFIELD_EN = 'Formulate an answer';
const STR_QUIZ_HEADER_EN = 'Quiz editor';
const STR_QUIZ_INTRO_EN = 'This is a short description of the quiz editor';
const STR_QUIZ_ANSWERCORRECT_EN = 'correct';
const STR_QUIZ_ANSWERWRONG_EN = 'wrong';
const STR_EDIT_EN = 'edit';
const STR_PREVIEW_EN = 'preview';

const paperElevation = 4;

const compStyles = theme => ({
  button: {
  },
  buttonPreview: {
  },
  dragHandle: {
  },
});

let domStyles = {
    answerField: {
      paddingTop: 3,
      paddingBottom: 3,
      resize: 'none',
      width: 500,
      height: 30,
      margin: 5,
    },
    answerList: {
      marginTop: 10,
    },
    questionField: {
      resize: 'none',
      width: 500,
      height: 50,
      margin: 5,
    },
    answerWrap: {
      display: 'flex',
      flexDirection: 'row', 
      alignItems: 'center',
    },
    wrapper: {
    },
    questionPreview: {
      fontWeight: 'strong',
    },
    answerListPreview: {
      listStyleType: 'none',
    },
    answerPreview: {
    },
}

class Question extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <textarea style={domStyles.questionField} 
                value={this.props.value} 
                onChange={this.handleChange} />
    )
  }

  handleChange(event) {
    this.props.funHandleChangeQuestion(event.target.value);
  }
}

const DragHandle = SortableHandle(() => <DragHandleIcon className={compStyles.dragHandle} />);

class Answer extends Component {

  constructor(props) {
    super(props);
    this.handleSelfDestruct = this.handleSelfDestruct.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCorrect = this.handleChangeCorrect.bind(this);
  }

  render() {
    return (
      <div style={domStyles.answerField}>
        <Paper elevation={paperElevation}> 
          <div style={domStyles.answerWrap}>
            <DragHandle />
            <textarea style={domStyles.answerField} 
                      onChange={this.handleChange} 
                      value={this.props.value.option} />
            <select onChange={this.handleChangeCorrect} value={this.props.value.correct ? "1" : "0"}>
              <option value="1">{STR_QUIZ_ANSWERCORRECT_EN}</option>
              <option value="0">{STR_QUIZ_ANSWERWRONG_EN}</option>
            </select>
            <DeleteIcon onClick={this.handleSelfDestruct}  />
          </div>
        </Paper>
      </div>
      )
  }

  handleSelfDestruct(){
    // call Quiz.handleRemoveAnswer
    this.props.funHandleDestroyAnswer(this.props.index);
  }

  handleChange(event) {
    // call Quiz.handleChangeAnswer
    this.props.funHandleChangeAnswer(this.props.index, event.target.value);
  }

  handleChangeCorrect(event) {
    // call Quiz.handleChangeAnswerCorrect
    this.props.funHandleChangeAnswerCorrect(this.props.index, event.target.value);
  }

}

// this wraps Answer with SortableElement. As a result, 
// SortableAnswer is a sortable Answer component.
// the prop index gets silently consumed by sortableelement; easiest workaround
// is probably to define another prop called indexCopy
const SortableAnswer = SortableElement(
  (props => <Answer index={props.indexCopy} 
                   value={props.value} 
                   funHandleDestroyAnswer={props.funHandleDestroyAnswer} 
                   funHandleChangeAnswer={props.funHandleChangeAnswer}
                   funHandleChangeAnswerCorrect={props.funHandleChangeAnswerCorrect} />)
);

const SortableAnswerList = SortableContainer(props =>
  <div>
    {props.items.map((value, index) => 
      <SortableAnswer key={`item-${index}`} 
                      index={index} 
                      indexCopy={index} 
                      value={value} 
                      funHandleDestroyAnswer={props.funHandleDestroyAnswer}
                      funHandleChangeAnswer={props.funHandleChangeAnswer}
                      funHandleChangeAnswerCorrect={props.funHandleChangeAnswerCorrect} />
    )}
  </div>  
);

class Quiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
    }
    this.handleRemoveAnswer = this.handleRemoveAnswer.bind(this);
    this.handleChangeAnswer = this.handleChangeAnswer.bind(this);
    this.handleChangeAnswerCorrect = this.handleChangeAnswerCorrect.bind(this);
    this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
  }

  handleChangeQuestion(option) {
    this.props.value.question = option;
    this.submitQuizChange();
  }

  handleAddAnswer() {
    let a = this.props.value.answers.slice();
    a = a.concat({'option': STR_QUIZ_ANSWERFIELD_EN, 'correct': true})
    this.props.value.answers = a;
    this.submitQuizChange();
  }

  handleChangeAnswer(index, option) {
    let a = this.props.value.answers.slice();
    a[index].option = option;
    this.props.value.answers = a;
    this.submitQuizChange();
  }

  handleChangeAnswerCorrect(index, correct) {
    let a = this.props.value.answers.slice();
    if (correct === "1") {
      a[index].correct = true;
    } else {
      a[index].correct = false;
    }
    this.props.value.answers = a;
    this.submitQuizChange();
  }

  handleRemoveAnswer(index) {
    let a = this.props.value.answers.slice();
    a.splice(index, 1);
    this.props.value.answers = a;
    this.submitQuizChange();
  }

  handlePreview() {
    this.setState({
      preview: !this.state.preview,
    });
  }

  submitQuizChange() {
    const answers = this.props.value.answers.map(x => {
        let y = {};
        y["option"] = x.option;
        y["correct"] = x.correct;
        return y;
    });
    const json = {
      "question": this.props.value.question,
      "answers":  answers
    };
    this.props.onQuizChange(json);
  }

  onSortEnd = (props) => {
    this.props.value.answers = arrayMove(this.props.value.answers, props.oldIndex, props.newIndex);
    this.submitQuizChange();
  };

  render() {
      return (
        <div style={domStyles.wrapper}>
          <div style={{textAlign: 'right'}}>
            <Button variant="raised" color="secondary" 
                  className={compStyles.buttonPreview} 
                  onClick={this.handlePreview.bind(this)}>
               {this.state.preview ? STR_EDIT_EN : STR_PREVIEW_EN}
            </Button>
          </div>
          {this.state.preview ? ( // ternary beginning
            <div>
              <p style={domStyles.questionPreview}>{this.props.value.question}</p>
              <ul style={domStyles.answerListPreview}>
                {this.props.value.answers.map((a) => <li style={domStyles.answerPreview}> {a.option} </li>)}
              </ul>
            </div>
          ) : ( // ternary middle
            <div>
              <Typography variant="headline" component="h3">
                  {STR_QUIZ_HEADER_EN}
              </Typography>
              <Typography component="p">
                  {STR_QUIZ_INTRO_EN}
              </Typography>

              <Question value={this.props.value.question} 
                        funHandleChangeQuestion={this.handleChangeQuestion}/>

              <div style={domStyles.answerList}>
                <Button variant="raised" color="primary" aria-label="add" 
                      className={compStyles.button} 
                      onClick={this.handleAddAnswer.bind(this)}>
                   Add answer
                  <AddIcon />
                </Button>
                <SortableAnswerList items={this.props.value.answers} 
                              onSortEnd={this.onSortEnd} 
                              useDragHandle={true} 
                              funHandleDestroyAnswer={this.handleRemoveAnswer}
                              funHandleChangeAnswer={this.handleChangeAnswer}
                              funHandleChangeAnswerCorrect={this.handleChangeAnswerCorrect}
                />
              </div>
            </div> // ternary end
          ) } 
      </div>

        
      )
  }
}

export default Quiz
