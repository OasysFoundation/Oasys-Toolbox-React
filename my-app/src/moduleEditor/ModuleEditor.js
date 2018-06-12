import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import ReactMaterialSelect from 'react-material-select'
import 'react-material-select/lib/css/reactMaterialSelect.css'
import glb from "../globals";

const defaultContentList = [
  { value: 1, primaryText: 'Sing-A-Song' },
]

const defaultEventList = [
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

function createOasysEvent(name, desc) {
  return {name: 'event', desc: desc, duration: null}
}

function createOasysHandler(type, content)  {
  return {type: 'handler', handlerType: type, content: content, duration: null}
}

class ModuleEditor extends Component {

  constructor(props) {
    super(props);
    this.onSelect.bind(this);
    this.onChooseContent.bind(this);
    //this.onChange = this.props.onChange.bind(this);
  }

  onChooseContent(value){
    this.props.value.contentId = value.value;
    this.submitChange();
  }

  // report change to SlideEditor component
  submitChange() {
    const obj = {
      "code": this.props.value.code.slice(),
      "contentId": this.props.value.contentId,
      "boolstate": this.props.value.boolstate,
      "ifstate": this.props.value.ifstate
    };
    this.props.onChange(obj);
  }

  onSelect(value){
    let code = this.props.value.code.slice();
    let ifstate = this.props.value.ifstate;
    let boolstate = this.props.value.boolstate;
    if (value==='event') { // need to change this later
      code.push(createOasysEvent('my event', null, null))
    } else if (value==='message') { // need to change this later
      code.push(createOasysHandler('message', 'content of message', null))
    } else {
      code.push(value);
    }

    if (value==="if") {
      ifstate = glb.IF_START;
    } else if (value==="event") {
      boolstate = glb.BOOL_ENABLED;
      ifstate = glb.IF_COND;
    } else if (value==="message") {
      ifstate = glb.IF_BODY;
    } else if (["and","or"].indexOf(value) > -1) {
      boolstate = glb.BOOL_DISABLED;
    } else if (value==="not") {
      // do nothing
    }
    this.props.value.code = code;
    this.props.value.ifstate = ifstate;
    this.props.value.boolstate = boolstate;
    this.submitChange();
  }

  renderPseudocode() {
    let ifstate = glb.IF_START; // 0: just started if, 1: inside condition, 2: inside body
    let output = [];
    for (let i=0; i<this.props.value.code.length; i++) {
      if (ifstate < 2 && typeof(this.props.value.code[i])!=="string"
                      && this.props.value.code[i].type === "handler") { 
        // we just entered the if body
        ifstate = glb.IF_BODY;
        output.push(<Atom indent={0} value={" ) "} />);
        output.push(<Linebreak />);
      }
      if (this.props.value.code[i] === "if") { // open new if
        ifstate = glb.IF_START;
        output.push(<Atom indent={0} value={this.props.value.code[i]} />);
        output.push(<Atom indent={0} value={" ( "} />);
      } else if (ifstate === glb.IF_BODY) { // deal with stuff in if body
        // the next atom must be a handler
        output.push(<Atom indent={1} value={this.props.value.code[i].handlerType} />);
        output.push(<Linebreak />);
      } else {
        if (typeof(this.props.value.code[i])==="string") { // boolean operator
          output.push(<Atom indent={0} value={this.props.value.code[i]} />);
        } else { // event
          output.push(<Atom indent={0} value={this.props.value.code[i].name} />);
        }
        if (this.props.value.code.length>0 && this.props.value.code[-1]==="if") {
          ifstate = glb.IF_COND;
        }
      }
    }
    return output;
  }

  render() {
      let gameEditor
      const is = this.props.value.ifstate;
      const bs = this.props.value.boolstate;
      if (this.props.value.contentId>0) {
        gameEditor = (
          <div>
          <Button variant="raised" 
                  disabled={is===glb.IF_START || is===glb.IF_COND} 
                  onClick={() => this.onSelect("if")}>
            if </Button>
          <Button variant="raised" 
                  disabled={is===glb.IF_BODY || (is===glb.IF_COND && bs===glb.BOOL_ENABLED)} 
                  onClick={() => this.onSelect("not")}>
            not </Button>
          <Button variant="raised" 
                  disabled={is!==glb.IF_COND || bs!==glb.BOOL_ENABLED} 
                  onClick={() => this.onSelect("and")}>
            and </Button>
          <Button variant="raised" 
                  disabled={is!==glb.IF_COND || bs!==glb.BOOL_ENABLED} 
                  onClick={() => this.onSelect("or")}>
            or </Button>
          <Button variant="raised" 
                  disabled={is<glb.IF_COND || bs!==glb.BOOL_ENABLED} 
                  onClick={() => this.onSelect("message")}>
            message </Button>
          <Button variant="raised" 
                  disabled={is===glb.IF_BODY || (is===glb.IF_COND && bs===glb.BOOL_ENABLED)} 
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
              {defaultContentList.map(item =>
                <option dataValue={item.value}> {item.primaryText} </option>
              )}
          </ReactMaterialSelect>
          {gameEditor}
        </div>
      ) 
  }
}

export default ModuleEditor;
