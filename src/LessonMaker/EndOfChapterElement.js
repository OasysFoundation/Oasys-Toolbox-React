import SelectionDropdown from './SelectionDropdown'
import QuizzEdit from './QuizzEdit'
import NextChapterSelection from './NextChapterSelection'
import React, { Component } from 'react';


class EndOfChapterElement extends Component {
    constructor(props) {
        super(props);
        this.choices = [
            {
                el : <QuizzEdit {...props}/>,
                text: "Quiz"
            },
            {
                el : <NextChapterSelection {...props}/>,
                text: "Link To Chapter"
            },
            {
                el : <div> || Done ||</div>,
                text: "Finish Lesson"
            }
        ]

        this.state={
            choice:  this.choices[2]
        }

        this.onSelectAction = this.onSelectAction.bind(this);
    }

    onSelectAction(identifier, optionsIndex){
        console.log(this.choices);
        this.setState({choice: this.choices[optionsIndex]})
    }

    render() {
        return (
            <React.Fragment>
                {/*<Button color="primary" onClick={() => this.setState({choice: null})}> Select </Button>*/}
                <SelectionDropdown onSelect={this.onSelectAction} identifier={"action-correct"}
                                   default={this.state.choice.text}
                                   options={this.choices.map(choice => choice.text)}/>
                {this.state.choice.el}
            </React.Fragment>

        )
    }
}

export default EndOfChapterElement;
