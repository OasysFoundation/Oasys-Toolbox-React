import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import NavBar from "./NavBar"
import Preview from "./Preview"
import QuizPreview from "./QuizPreview";
import Rating from "./Rating"




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

    render() {
        const content = this.state.content;
        if (!content) {
            return <div>No Content Found</div>
        }
        if (this.state.slideIdx >= content.data.length) {
            return (<Rating />)
        }

        const obj = content.data[this.state.slideIdx];
        const slideView = (obj.name === "Slide") ? <Preview content={obj.content}/> :
            <QuizPreview content={obj.content}/>

        return (
            <div>
                {slideView}
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
