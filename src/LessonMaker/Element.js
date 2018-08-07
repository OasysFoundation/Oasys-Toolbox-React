import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextView from '../CoreElements/TextView'
import globals from "../globals";

const styling = {
    maxWidth: 700 + 'px',
    marginTop: 1 + 'rem',
    minWidth: 500 + 'px',
    marginBottom: 1 + 'rem',
    wordBreak: 'break-all' //dafuq was this not a default in HTML
}

class Element extends Component {

    constructor(props) {
        super(props);
        // this.state = {content: null}
    }

    typeToComponent(type) {

        let render = <div>NO ELEMENT TYPE YET HERE</div>;

        console.log("TYPE", type)
        switch (type) {
            case globals.EDIT_QUILL:
                render = <TextView content={this.props.content}/>
                break;

            // case globals.EDIT_QUIZ:
            //     render = <QuizPreview content={slide.content} sendAnalyticsToBackend={this.handleQuizSumbit.bind(this)}/>
            //     break;
            // case globals.EDIT_GAME:
            //     render = <GameView url={slide.content.url}/>
            //     break;
            // case globals.EDIT_HYPERVIDEO:
            //     render = <HyperVideoEdit value={slide.content} preview={true}/>
            //     break;
            // case globals.EDIT_SYSTEM:
            //     render = <GameView value={slide.content} preview={true}/>
            //     break;
            default:
                return (<div key={"1223"}>not yet implemented ☹️</div>)
        }
        return render;
    }

    onInteractionEvent() {

    }

//TODO pass down a save function and call this.props.saveToState function
    render() {
        return (
            <section>
                {() => this.typeToComponent(this.props.type)}
            </section>
        );
    }
}

{/*<textarea*/
}
{/*value={this.state.data || this.props.data}*/
}
{/*onChange={(ev) => {*/
}
{/*console.log(ev.target.value)*/
}
{/*this.setState({data: ev.target.value})*/
}
{/*this.props.onProgress(ev.target.value)*/
}
{/*}}*/
}
{/*style={styling}>*/
}
{/*</textarea>*/
}

Element.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    data: PropTypes.object.isRequired
};

export default Element;
