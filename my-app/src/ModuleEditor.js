import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import ReactMaterialSelect from 'react-material-select'
import 'react-material-select/lib/css/reactMaterialSelect.css'
import glb from "./globals";
import EventPicker from "./EventPicker";

const defaultModuleList = [
  { value: 1, primaryText: 'Sing-A-Song' },
]

const defaultEventList = [
]


let domStyles = {
  pseudoCode: {
    paddingTop: '20px',
  },
  eventPicker: {
    widht: '200px',
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

function createOasysHandler(type, module)  {
  return {type: 'handler', handlerType: type, module: module, duration: null}
}

class ModuleEditor extends Component {

  constructor(props) {
    super(props);
    this.onSelect.bind(this);
    this.onChooseModule.bind(this);
    //this.onChange = this.props.onChange.bind(this);
  }

  onChooseModule(value){
    this.props.value.moduleId = value.value;
    this.submitChange();
  }

  // report change to SlideEditor component
  submitChange() {
    const obj = {
      "code": this.props.value.code.slice(),
      "moduleId": this.props.value.moduleId,
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

  // checks if an element is part of the programs logic (if,and,or,not)
  checkIsLogic(elem){
    return (typeof(elem)==="string");
  }
  checkIsHandler(elem){
    return (!this.checkIsLogic(elem) && elem.type === "handler");
  }

  renderPseudocode() {
    let ifstate = glb.IF_START; // 0: just started if, 1: inside condition, 2: inside body
    let output = [];
    for (let i=0; i<this.props.value.code.length; i++) {
      // did we just enter the if body?
      if (ifstate < glb.IF_BODY && this.checkIsHandler(this.props.value.code[i])) { 
        ifstate = glb.IF_BODY;
        output.push(<Atom indent={0} value={" ) "} />);
        output.push(<Linebreak />);
      }
      // did we just open another if clause?
      if (this.props.value.code[i] === "if") { 
        ifstate = glb.IF_START;
        output.push(<Atom indent={0} value={this.props.value.code[i]} />);
        output.push(<Atom indent={0} value={" ( "} />);
      } else if (ifstate === glb.IF_BODY) { // deal with stuff in if body
        // the next atom must be a handler
        output.push(<Atom indent={1} value={this.props.value.code[i].handlerType} />);
        output.push(<Linebreak />);
      } else {
        if (this.checkIsLogic(this.props.value.code[i])) { // boolean operator
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
      const disabled_if = (is===glb.IF_START || is===glb.IF_COND);
      const disabled_event = (is===glb.IF_BODY || (is===glb.IF_COND && bs===glb.BOOL_ENABLED));
      const diabled_bool = (is!==glb.IF_COND || bs!==glb.BOOL_ENABLED);
      const disabled_react = (is<glb.IF_COND || bs!==glb.BOOL_ENABLED);
      if (this.props.value.moduleId>0) {
        gameEditor = (
          <div style={{display:"flex", flexDirection:"row"}}>
            <Button variant="raised" disabled={disabled_if} onClick={() => this.onSelect("if")}> if </Button>
            <Button variant="raised" disabled={disabled_event} onClick={() => this.onSelect("not")}> not </Button>
            <Button variant="raised" disabled={diabled_bool} onClick={() => this.onSelect("and")}> and </Button>
            <Button variant="raised" disabled={diabled_bool} onClick={() => this.onSelect("or")}> or </Button>
            <Button variant="raised" disabled={disabled_react} onClick={() => this.onSelect("message")}> message </Button>
            <Button variant="raised" disabled={disabled_event} onClick={() => this.onSelect("event")}> event </Button>
            <div style={domStyles.eventPicker}>
              <EventPicker/>
            </div>
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
          <ReactMaterialSelect label="Choose a module" onChange={this.onChooseModule.bind(this)}>
              {defaultModuleList.map(item =>
                <option dataValue={item.value}> {item.primaryText} </option>
              )}
          </ReactMaterialSelect>
          {gameEditor}
        </div>
      ) 
  }
}

export default ModuleEditor;
