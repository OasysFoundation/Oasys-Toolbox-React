import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

const IF_START = 0; // immediately after if command
const IF_COND  = 1; // inside if condition (but not immediately after if command)
const IF_BODY  = 2; // inside if body (also, prior to next if command)
const BOOL_DISABLED = 0; 
const BOOL_ENABLED = 1;

class Linebreak extends Component {
  render(){
    return (<br/>)
  }
}

class Span extends Component {
  render(){
    return (<span style={{marginLeft:this.props.indent*30}}> {this.props.value} </span>)
  }
}

class ModuleEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: [],
      ifstate: IF_BODY,
      boolstate: BOOL_DISABLED,
    }
    this.onSelect.bind(this);
  }

  onSelect(value){
    let code = this.state.code.slice();
    let ifstate = this.state.ifstate;
    let boolstate = this.state.boolstate;
    code.push(value);
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
  }

  renderPseudocode() {
    let ifstate = IF_START; // 0: just started if, 1: inside condition, 2: inside body
    let output = [];
    for (let i=0; i<this.state.code.length; i++) {
      if (ifstate < 2 && this.state.code[i] === "message") { // this means that we entered the if body
        ifstate = IF_BODY;
        output.push(<Span indent={0} value={" ) "} />);
        output.push(<Linebreak />);
      }
      if (this.state.code[i] === "if") { // open new if
        ifstate = IF_START;
        output.push(<Span indent={0} value={this.state.code[i]+ " ( "} />);
      } else if (ifstate === 2) { // deal with stuff in if body
        output.push(<Span indent={1} value={this.state.code[i]} />);
        output.push(<Linebreak />);
      } else {
        output.push(<Span indent={0} value={this.state.code[i]} />);
        if (this.state.code.length>0 && this.state.code[-1]==="if") {
          ifstate = IF_COND;
        }
      }
    }
    return output;
  }

  render() {
      return (
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
                  disabled={this.state.ifstate===IF_BODY || (this.state.ifstate===IF_COND && this.state.boolstate===BOOL_ENABLED)} 
                  onClick={() => this.onSelect("event")}>
            event </Button>
          <Button variant="raised" 
                  disabled={this.state.ifstate<IF_COND || this.state.boolstate!==BOOL_ENABLED} 
                  onClick={() => this.onSelect("message")}>
            message </Button>
          <div className="pseudoCode">
            {this.renderPseudocode()}
          </div>
        </div>
      ) 
  }
}

export default ModuleEditor;
