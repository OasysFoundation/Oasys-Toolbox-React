import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


// internationalization ------------------------------------------------------------
const STR_QUIZ_HEADER_EN = 'Quiz editor';
const STR_QUIZ_INTRO_EN = 'Create a new quiz slide. Start with a question or statement and add potential answer options below. You can mark which answer options are correct (both multiple choice and single choice are possible that way).';
const STR_QUIZ_ANSWERCORRECT_EN = 'correct';
const STR_QUIZ_ANSWERWRONG_EN = 'wrong';
const STR_EDIT_EN = 'edit';
const STR_PREVIEW_EN = 'preview';

// styles --------------------------------------------------------------------------
const paperElevation = 4;

const compStyles = theme => ({
  button: {},
  buttonPreview: {},
  dragHandle: {},
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
    wrapper: {},
    questionPreview: {
      fontWeight: 'bold',
      fontsize: '150%',
    },
    answerListPreview: {
      listStyleType: 'none',
    },
    answerPreview: {
      marginTop: '10px',
    },
}

// Question component --------------------------------------------------------------
class Question extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <textarea style={domStyles.questionField} 
                value={this.props.value} 
                onChange={this.onChange} />
    )
  }

  // report change to Quiz component
  onChange(event) { this.props.onChangeQuestion(event.target.value); }
}


// Answer component --------------------------------------------------------------
// DragHandle is the component used to drag answers to new places
const DragHandle = SortableHandle(() => <DragHandleIcon className={compStyles.dragHandle} style={{cursor:'pointer'}} />);

class Answer extends Component {

  constructor(props) {
    super(props);
    this.onSelfDestruct = this.onSelfDestruct.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCorrect = this.onChangeCorrect.bind(this);
  }

  render() {
    return (
      <div style={domStyles.answerField}>
        <Paper elevation={paperElevation}> 
          <div style={domStyles.answerWrap}>
            <DragHandle />
            <TextField
              id="name"
              placeholder="Quiz Answer"
              value={this.props.value.option}
              onChange={this.onChange}
              style={domStyles.answerField} 
              margin="normal"
            />
            <select onChange={this.onChangeCorrect} value={this.props.value.correct ? "1" : "0"} style={{cursor:'pointer'}} >
              <option value="1">{STR_QUIZ_ANSWERCORRECT_EN}</option>
              <option value="0">{STR_QUIZ_ANSWERWRONG_EN}</option>
            </select>
            <DeleteIcon onClick={this.onSelfDestruct} style={{cursor:'pointer'}} />
          </div>
        </Paper>
      </div>
      )
  }

  // report changes to Quiz component
  onSelfDestruct(){ this.props.handlers.onRemoveAnswer(this.props.index); }
  onChange(event) { this.props.handlers.onChangeAnswer(this.props.index, event.target.value); }
  onChangeCorrect(event) { this.props.handlers.onChangeAnswerCorrect(this.props.index, event.target.value); }

}

// this wraps Answer with SortableElement.
// the prop index gets silently consumed by SortableElement, but we need it in Answer to report changes
// to the Quiz component. A workaround is to pass index value twice (as index and as indexCopy).
const SortableAnswer = SortableElement(
  (props => <Answer index={props.indexCopy} value={props.value}  handlers={props.handlers} />)
);

const SortableAnswerList = SortableContainer(props =>
  <div> {props.items.map((value, index) => 
      <SortableAnswer key={`item-${index}`} value={value} handlers={props.handlers}
                      index={index} indexCopy={index} />
  )} </div>  
);


// Quiz component --------------------------------------------------------------
class Quiz extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      preview: false
     };
    const handlers = ['onRemoveAnswer', 'onChangeAnswer', 'onChangeAnswerCorrect', 'onChangeQuestion'];
    for (let i in handlers) { this[handlers[i]] = this[handlers[i]].bind(this) };

  }

  onChangeQuestion(option) {
    this.props.value.question = option;
    this.submitQuizChange();
  }

  onAddAnswer() {
    this.props.value.answers = this.props.value.answers.concat({'option': '', 'correct': true})
    this.submitQuizChange();
  }

  onChangeAnswer(index, option) {
    this.props.value.answers[index].option = option;
    this.submitQuizChange();
  }

  onChangeAnswerCorrect(index, correct) {
    if (correct === "1") {
      this.props.value.answers[index].correct = true;
    } else {
      this.props.value.answers[index].correct = false;
    }
    this.submitQuizChange();
  }

  onRemoveAnswer(index) {
    this.props.value.answers.splice(index, 1);
    this.submitQuizChange();
  }

  onPreview() {
    this.setState({
      preview: !this.state.preview,
    });
  }

  // report change to SlideEditor component
  submitQuizChange() {
    const answers = this.props.value.answers.map(x => ({"option": x.option, "correct": x.correct}));
    const obj = {
      "question": this.props.value.question,
      "answers":  answers
    };
    this.props.onChange(obj);
  }

  changeTab = (event, value) => {
    this.setState({ 
      preview: Boolean(value)
    });
  };

  // rearrange answers
  onSortEnd = (props) => {
    this.props.value.answers = arrayMove(this.props.value.answers, props.oldIndex, props.newIndex);
    this.submitQuizChange();
  };

  render() {
    const answerHandlers = {
      onRemoveAnswer: this.onRemoveAnswer,
      onChangeAnswer: this.onChangeAnswer,
      onChangeAnswerCorrect: this.onChangeAnswerCorrect
    };
      return (
        <div style={domStyles.wrapper}>
          <Paper>
            <Tabs value={+ this.state.preview} onChange={this.changeTab}>
              <Tab label="Quiz Editor" />
              <Tab label="Preview" />
            </Tabs>
          </Paper>
          <br />
          {this.state.preview ? ( // ternary beginning
            <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">{this.props.value.question}</FormLabel>
              <FormGroup>
              { this.props.value.answers.map((a) => 
                  <FormControlLabel
                    control={
                      <Checkbox />
                    }
                    label={a.option}
                  />
              )}
              </FormGroup>
            </FormControl>
            </div>
          ) : ( // ternary middle
            <div>
              
              <Typography component="p">
                  {STR_QUIZ_INTRO_EN}
              </Typography>

              <Question value={this.props.value.question} 
                        onChangeQuestion={this.onChangeQuestion}/>

              <div style={domStyles.answerList}>
                <Button variant="raised" color="primary" aria-label="add" 
                      className={compStyles.button} 
                      onClick={this.onAddAnswer.bind(this)}>
                   Add answer
                  <AddIcon />
                </Button>
                <SortableAnswerList items={this.props.value.answers} 
                              onSortEnd={this.onSortEnd} 
                              useDragHandle={true} 
                              handlers={answerHandlers} />
              </div>
            </div> // ternary end
          ) } 
      </div>
      ) // end return
  } // end render
} // end Quiz component

export default Quiz
