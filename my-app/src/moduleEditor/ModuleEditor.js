import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import ReactMaterialSelect from 'react-material-select'
import 'react-material-select/lib/css/reactMaterialSelect.css'

const IF_START = 0; // immediately after if command
const IF_COND  = 1; // inside if condition (but not immediately after if command)
const IF_BODY  = 2; // inside if body (also, prior to next if command)
const BOOL_DISABLED = 0; 
const BOOL_ENABLED = 1;

const contentList = [
  { value: 1, primaryText: 'Sing-A-Song' },
]


let domStyles = {
  pseudoCode: {
    paddingTop: '20px',
  }
}

class Linebreak extends Component {
  render(){
    return (<br/>)
  }
}

class Atom extends Component {
  render(){
    return (<Button disabled={true}
                    style={{marginLeft:this.props.indent*50}}
                    variant={'outlined'}
                    size={'small'}> 
                {this.props.value} 
            </Button>)
  }
}

function createOasysEvent(name, content) {
  return {name: 'event', duration: null}
}

function createOasysHandler(type, content)  {
  return {type: 'handler', handlerType: type, content: content, duration: null}
}

class ModuleEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: [],
      ifstate: IF_BODY,
      boolstate: BOOL_DISABLED,
      contentId: 0
    }
    this.onSelect.bind(this);
    this.onChooseContent.bind(this);
    this.onChange = this.props.onChange.bind(this);
  }

  onChooseContent(value){
    this.setState({contentId: value.value});
  }

  // report change to SlideEditor component
  submitChange() {
    const obj = {
      "code": this.state.code.slice(),
      "contentId": this.state.contentId,
    };
    this.onChange(obj);
  }

  onSelect(value){
    let code = this.state.code.slice();
    let ifstate = this.state.ifstate;
    let boolstate = this.state.boolstate;
    if (value==='event') { // need to change this later
      code.push(createOasysEvent('my event', null))
    } else if (value==='message') { // need to change this later
      code.push(createOasysHandler('message', 'content of message', null))
    } else {
      code.push(value);
    }

    if (value==="if") {
      ifstate = IF_START;
    } else if (value==="event") {
      boolstate = BOOL_ENABLED;
      ifstate = IF_COND;
    } else if (value==="message") {
      ifstate = IF_BODY;
    } else if (["and","or"].indexOf(value) > -1) {
      boolstate = BOOL_DISABLED;
    } else if (value==="not") {
      // do nothing
    }
    this.setState({code: code, ifstate: ifstate, boolstate: boolstate});
    this.submitChange();
  }

  renderPseudocode() {
    let ifstate = IF_START; // 0: just started if, 1: inside condition, 2: inside body
    let output = [];
    for (let i=0; i<this.state.code.length; i++) {
      if (ifstate < 2 && typeof(this.state.code[i])!=="string"
                      && this.state.code[i].type === "handler") { 
        // we just entered the if body
        ifstate = IF_BODY;
        output.push(<Atom indent={0} value={" ) "} />);
        output.push(<Linebreak />);
      }
      if (this.state.code[i] === "if") { // open new if
        ifstate = IF_START;
        output.push(<Atom indent={0} value={this.state.code[i]} />);
        output.push(<Atom indent={0} value={" ( "} />);
      } else if (ifstate === IF_BODY) { // deal with stuff in if body
        // the next atom must be a handler
        output.push(<Atom indent={1} value={this.state.code[i].handlerType} />);
        output.push(<Linebreak />);
      } else {
        if (typeof(this.state.code[i])==="string") { // boolean operator
          output.push(<Atom indent={0} value={this.state.code[i]} />);
        } else { // event
          output.push(<Atom indent={0} value={this.state.code[i].name} />);
        }
        if (this.state.code.length>0 && this.state.code[-1]==="if") {
          ifstate = IF_COND;
        }
      }
    }
    return output;
  }

  render() {
      let gameEditor
      if (this.state.contentId>0) {
        gameEditor = (
          <div>
          <Button variant="raised" 
                  disabled={this.state.ifstate===IF_START || this.state.ifstate===IF_COND} 
                  onClick={() => this.onSelect("if")}>
            if </Button>
          <Button variant="raised" 
                  disabled={this.state.ifstate===IF_BODY || (this.state.ifstate===IF_COND && this.state.boolstate===BOOL_ENABLED)} 
                  onClick={() => this.onSelect("not")}>
            not </Button>
          <Button variant="raised" 
                  disabled={this.state.ifstate!==IF_COND || this.state.boolstate!==BOOL_ENABLED} 
                  onClick={() => this.onSelect("and")}>
            and </Button>
          <Button variant="raised" 
                  disabled={this.state.ifstate!==IF_COND || this.state.boolstate!==BOOL_ENABLED} 
                  onClick={() => this.onSelect("or")}>
            or </Button>
          <Button variant="raised" 
                  disabled={this.state.ifstate<IF_COND || this.state.boolstate!==BOOL_ENABLED} 
                  onClick={() => this.onSelect("message")}>
            message </Button>
          <Button variant="raised" 
                  disabled={this.state.ifstate===IF_BODY || (this.state.ifstate===IF_COND && this.state.boolstate===BOOL_ENABLED)} 
                  onClick={() => this.onSelect("event")}>
            event </Button>
          <div style={domStyles.pseudoCode}>
            {this.renderPseudocode()}
          </div>
          </div>
        )
      } else {
        gameEditor = <div></div>
      }
      return (
        <div>
          <ReactMaterialSelect label="Choose a content" onChange={this.onChooseContent.bind(this)}>
              {contentList.map(item =>
                <option dataValue={item.value}> {item.primaryText} </option>
              )}
          </ReactMaterialSelect>
          {gameEditor}
        </div>
      ) 
  }
}

export default ModuleEditor;
