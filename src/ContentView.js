import React, {Component} from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import NavBar from "./NavBar"
import Preview from "./Preview"
import QuizPreview from "./QuizPreview";
import ContentList from "./ContentList"
import Rating from "./Rating"


const content = []


class ContentView extends Component {
    constructor() {
        super();
        this.state = {
            slideIdx: 0,
        }
        //TODO getLocationRef and then render content
    }

    slideCount(increment = 0) {
        const newIdx = this.state.slideIdx + increment;
        if (newIdx < 0 || newIdx > content.length) {
            return
        }
        this.setState({slideIdx: newIdx})
    }

    render() {
        if (this.state.slideIdx >= content.length) {
            return (<Rating />)
        }

        const obj = content[this.state.slideIdx];
        const slideView = (obj.type === "quill") ? <Preview content={obj.content}/> :
            <QuizPreview content={obj.content}/>

        return (
            <div>
                {slideView}
                <Button variant="fab" size="small" color="primary"
                        onClick={() => this.slideCount(-1)}>
                    {"<<<"}
                </Button>
                {/*Progress Text*/}
                {`${this.state.slideIdx + 1} / ${content.length}`}

                <Button variant="fab" size="small" color="primary"
                        onClick={() => this.slideCount(+1)}>
                    {">>>"}
                </Button>
            </div>
        );
    }
}

export default ContentView;
