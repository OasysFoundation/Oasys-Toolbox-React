import React, {Component} from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import NavBar from "./NavBar"
import Preview from "./Preview"
import QuizPreview from "./QuizPreview";
import ContentList from "./ContentList"


const mockContent = [{"name": "Slide 1", "identifier": "1", "content": "<p>Content Slide 1</p>", "type": "quill"},
    {"name": "Slide 2", "identifier": "0.w91nrv58u7", "content": "<p>Content Slide 2</p>", "type": "quill"},
    {
        "name": "Slide 3", "identifier": "0.3e6wwp8j4zl",
        "content": {
            "question": "Quiz question on slide 3",
            "answers": [{"option": "Answer 1", "correct": false}, {
                "option": "Answer 2",
                "correct": false
            }, {"option": "Answer 3", "correct": true}]
        }, "type": "quiz"
    },
    {"name": "Slide 4", "identifier": "0.60xotjf2sbu", "content": "<p>Content Slide 4</p>", "type": "quill"}]


class ContentView extends Component {
    constructor() {
        super();
        console.log("App ran....")
        this.state = {
            slideIdx: 0,
        }
        //TODO getLocationRef and then render content
    }

    slideCount(increment = 0) {
        const newIdx = this.state.slideIdx + increment;
        if (newIdx < 0 || newIdx > mockContent.length) {
            return
        }
        this.setState({slideIdx: newIdx})
    }

    render() {
        if (this.state.slideIdx >= mockContent.length) {
            return (<h1>Completed! Thank you for playing</h1>)
        }

        const obj = mockContent[this.state.slideIdx];
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
                {`${this.state.slideIdx + 1} / ${mockContent.length}`}

                <Button variant="fab" size="small" color="primary"
                        onClick={() => this.slideCount(+1)}>
                    {">>>"}
                </Button>
            </div>
        );
    }
}

export default ContentView;
