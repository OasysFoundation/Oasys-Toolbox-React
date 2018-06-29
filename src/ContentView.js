import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import NavBar from "./NavBar"
import Preview from "./Preview"
import QuizPreview from "./QuizPreview";
import Rating from "./Rating"
import globals from "./globals"




class ContentView extends Component {
    constructor() {
        super();
        this.state = {
            slideIdx: 0,
            content: null
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
                //WHY IS IT ARRAY IF THERE's ONLY ONE ENTRY?
                console.log("content here: ", myJson[0]);
                that.setState({content: myJson[0]})
            });
    }

    slideCount(increment = 0) {
        const newIdx = this.state.slideIdx + increment;
        if (newIdx < 0 || newIdx > this.state.content.length) {
            return
        }
        this.setState({slideIdx: newIdx})
    }

    whatRenderer(obj) {

        console.log(obj.type, globals,  "TYPPPEP")
        switch(obj.type) {
            case globals.QUILL:
                return <Preview content={obj.content}/>
            case globals.QUIZ:
                return <QuizPreview content={obj.content}/>
            default:
                return <div>not a quill content</div>
        }
    }
    render() {
        const content = this.state.content;
        if (!content) {
            return <div>No Content Found</div>
        }
        if (this.state.slideIdx >= content.data.length) {
            return (<Rating />)
        }

        const obj = content.data[this.state.slideIdx];


        //TODO >>>>> This is ugly. Make case switch statement that returns the right render component


        const contentDisplayType = this.whatRenderer(obj)

        //<QuizPreview content={obj.content}/>


        //TODO <<<<<

        return (
            <div>
                {contentDisplayType}
                <Button variant="fab" size="small" color="primary"
                        onClick={() => this.slideCount(-1)}>
                    {"<<<"}
                </Button>
                {/*Progress Text*/}
                {`${this.state.slideIdx + 1} / ${content.data.length}`}

                <Button variant="fab" size="small" color="primary"
                        onClick={() => this.slideCount(+1)}>
                    {">>>"}
                </Button>
            </div>
        );
    }
}

export default ContentView;
