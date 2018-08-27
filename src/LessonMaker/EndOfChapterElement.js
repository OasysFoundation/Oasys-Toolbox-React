import SelectionDropdown from './SelectionDropdown'
import QuizzEdit from './QuizzEdit'
import NextChapterSelection from './NextChapterSelection'
import React, { Component } from 'react';





//DON't USE THIS ---- NOT A GOOD SOLUTION
class EndOfChapterElement extends Component {
    constructor(props) {
        super(props);

        console.log(props, "nextchoice props")

        const {data, ...someProps} = props;

        this.choices = [
            {
                el : <QuizzEdit {...someProps}/>,
                text: "Quiz"
            },
            {
                el : <NextChapterSelection {...someProps}/>,
                text: "Link To Chapter"
            },
            {
                el : <div> || Done ||</div>,
                text: "Finish Lesson"
            }
        ]

        this.state={
            childChoice:  this.choices[props.childChoice || 2],
        }

        this.onSelectAction = this.onSelectAction.bind(this);
    }

    onSelectAction(identifier, optionsIndex){
        console.log(this.choices);
        this.setState({childChoice: this.choices[optionsIndex]})
    }

    render() {
        return (
            <React.Fragment>
                {/*<Button color="primary" onClick={() => this.setState({choice: null})}> Select </Button>*/}
                <SelectionDropdown onSelect={this.onSelectAction} identifier={"action-correct"}
                                   default={this.state.childChoice.text}
                                   options={this.choices.map(choice => choice.text)}/>
                {this.state.childChoice.el}
            </React.Fragment>

        )
    }
}

export default EndOfChapterElement;
