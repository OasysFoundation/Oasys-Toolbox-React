import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import NavBar from "./NavBar"
import Preview from "./Preview"
import QuizPreview from "./QuizPreview";
import Rating from "./Rating"


const content = []


class ContentView extends Component {
    constructor() {
        super();
        this.state = {
            slideIdx: 0,
            content: content
        };

        //extract OUT the /username/contentname in the routes
        const loc = window.location.href;
        const directory = loc.split('/').filter(e => e.length > 0).slice(-2);
        const userName = directory[0]
        const contentName = directory[1]

        const APICALL = `https://api.joinoasys.org/user/${userName}/${contentName}/`;

        console.log("call", APICALL, directory)

        const that = this;
        fetch(APICALL, {
            method: 'GET'
        }).then(function (response) {
            console.log(response);
            return response.json();
        })
            .then(function (myJson) {
                console.log("content here: ", myJson);
                that.setState({content: myJson})
            });
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
