import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import HelpIcon from '@material-ui/icons/Help';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {CoolPinkButton} from "./stylings";
import QuizPreview from './QuizPreview'

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
const STR_QUIZ_INTRO_EN = 'Create a new quiz slide. Start with a question or statement and add potential answer options below. You can mark which answer options are correct (both multiple choice and single choice are possible that way). You can learn more in our documentation.';
const STR_QUIZ_ANSWERCORRECT_EN = 'correct';
const STR_QUIZ_ANSWERWRONG_EN = 'wrong';
const STR_EDIT_EN = 'edit';
const STR_PREVIEW_EN = 'preview';

// styles --------------------------------------------------------------------------
const paperElevation = 4;

const compStyles = theme => ({
  button: {
    width: 165
  },
  dragHandle: {},
});

let domStyles = {
    answerField: {
      paddingTop: '3px',
      paddingBottom: '3px',
      resize: 'none',
      width: 1000,
      height: 30,
    },
    answerList: {
      marginTop: 10,
    },
    questionWrap: {
      resize: 'none',
      display: 'flex',
      flexDirection: 'row', 
      alignItems: 'center',
    },
    questionField: {
      width: 1000
    },
    answerWrap: {
      display: 'flex',
      flexDirection: 'row', 
      alignItems: 'center',
    },
    wrapper: {
    },
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
    marginTop: {
      marginTop: '20px',
    },
    flexbox: {
      display: 'flex',
      flexDirection: 'row', 
    },
    smallIcon: {
      marginLeft: '5px',
      width: '20px',
      height: '20px',
      cursor: 'pointer',
    }
}

// Question component --------------------------------------------------------------
class Question extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <TextField
              id="name"
              placeholder="Question or Statement"
              style={domStyles.questionField} 
              value={this.props.value} 
              onChange={this.onChange}
              margin="normal"
            />
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
      <div style={{marginTop:'10px'}}>
        <Paper elevation={paperElevation}> 
          <div style={domStyles.answerWrap}>
            <IconButton>
              <DragHandle />
            </IconButton>
            <TextField
              id="name"
              placeholder="Quiz Answer"
              value={this.props.value.option}
              onChange={this.onChange}
              style={domStyles.answerField} 
              margin="normal"
              InputProps={{
                 disableUnderline: true
              }}
            />
            <select onChange={this.onChangeCorrect} value={this.props.value.correct ? "1" : "0"} style={{cursor:'pointer'}} >
              <option value="1">{STR_QUIZ_ANSWERCORRECT_EN}</option>
              <option value="0">{STR_QUIZ_ANSWERWRONG_EN}</option>
            </select>
            <IconButton onClick={this.onSelfDestruct} style={{cursor:'pointer'}}>
              <DeleteIcon  />
            </IconButton>
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
      preview: false,
      showsHelpDialog: false
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
      "answers":  answers,
      "time": this.props.value.time
    };
    this.props.onChange(obj);
  }

  showHelp() {
    this.setState({ showsHelpDialog: true });
  }

  closeHelp() {
    this.setState({ showsHelpDialog: false });
  }

  learnMore() {
    var win = window.open('/help', '_blank');
    win.focus();
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
          {this.props.shouldHideTabbar ? (<div />): (
            <Paper>
            <Tabs value={+ this.state.preview} onChange={this.changeTab} inkBarStyle={{background: 'orange'}}>
              <Tab label="Quiz Editor" />
              <Tab label="Preview" />
            </Tabs>
          </Paper>
            )}
          
          {this.state.preview ? (<QuizPreview content={this.props.value}/>)
          : (
            <div>
              
              <Typography component="p">
                  
              </Typography>
              <div  id="quizPreview">
              <Card>
                <CardContent>
                <Typography style={{marginBottom: 16, fontSize: 14}} color="textSecondary">
                  Quiz Question {this.props.value.time ? ("at " + Math.round(this.props.value.time) + " seconds") : null}
                </Typography>
                  <div style={domStyles.questionWrap}>
                  <Question value={this.props.value.question} 
                          onChangeQuestion={this.onChangeQuestion}/>

                  <IconButton aria-label="Help" onClick={this.showHelp.bind(this)}>
                    <HelpIcon />
                  </IconButton>
                  </div>
                </CardContent>
              
              <Dialog
                open={this.state.showsHelpDialog}
                onClose={this.closeHelp.bind(this)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Oasys Quiz Editor"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {STR_QUIZ_INTRO_EN}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.learnMore.bind(this)} color="primary">
                    Learn more…
                  </Button>
                  <Button onClick={this.closeHelp.bind(this)} color="primary" autoFocus>
                    Continue editing…
                  </Button>
                </DialogActions>
              </Dialog>

              
              
              <div style={domStyles.answerList}>
                <CardContent>
                <div style={domStyles.flexbox}>
                  <Typography style={{marginBottom: 16, fontSize: 14}} color="textSecondary">
                    Quiz Answers
                  </Typography>
                  <AddCircleIcon color="secondary"
                      onClick={this.onAddAnswer.bind(this)}
                      style={domStyles.smallIcon}/>
                </div>
                <SortableAnswerList items={this.props.value.answers} 
                              onSortEnd={this.onSortEnd} 
                              useDragHandle={true} 
                              handlers={answerHandlers} />
                </CardContent>

              </div>
              </Card>
              </div>
              
            </div> // ternary end
          ) } 
      </div>
      ) // end return
  } // end render
} // end Quiz component

export default Quiz
