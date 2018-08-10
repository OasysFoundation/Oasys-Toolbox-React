import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FadeableCard from './FadeableCard'
import globals from "../globals";
import QuillEdit from './QuillEdit'
import ImageEdit from './ImageEdit'
import FormulaEdit from './FormulaEdit'
import QuizzEdit from './QuizzEdit'
import VideoEdit from './VideoEdit'

import 'react-quill/dist/quill.snow.css';


const styles = {
    normal: {
        cursor: 'pointer',
        // border: `1px solid blue`
    },
    highlight: {
        cursor: 'pointer',
        background: 'lightyellow',
        // border: `1px solid green`

    },
    edit: {}

};


//TODO
//put Fade from CoreUI --> Wrap it in component to manage IN/Out state!

const sessionStorageKey = `__OASYS_ID__`;

class Element extends Component {
    constructor(props) {
        super(props);
        this.saveToSessionStorage = this.saveToSessionStorage.bind(this);
    }

    state = {
        mode: styles.normal,
        isHovered: false,
        isClicked: false,
        tempContent: this.props.data.content
    };

    onSetCondition() {
        //save eventId linked with chapterId
    }

    // componentDidMount() {
    //     this.setState({tempContent: })
    // }
    onInteractionEvent() {

    }

    //glue function between LessonMaker and Quill to add ID
    handleChange = (value) => {
        this.setState({tempContent: value}); //for Quill
        this.saveToSessionStorage(value) //for switching chapters
    }


    typeToComponent(type) {
        const {content, id} = this.props.data
        let render = <div>NO ELEMENT TYPE YET HERE</div>;

        // Q: Why is QuillEdit receiving the key prop, but ImageEdit and FormulaEdit not?
        switch (type) {
            case globals.EDIT_QUILL:
                render = <QuillEdit key={id} id={id} isEditMode={this.state.isHovered || this.state.isClicked} onChange={this.handleChange}
                                    data={this.state.tempContent}/>
                break;
            case globals.EDIT_IMAGE:
                render = <ImageEdit key={id} data={content}/>
                break;
            case globals.EDIT_FORMULA:
                render = <FormulaEdit key={id} data={content}/>
                break;
            case globals.EDIT_QUIZ:
                render = <QuizzEdit key={id} data={content} chapters={this.props.chaptersLight} />
                break;
            case globals.EDIT_VIDEO:
                render = <VideoEdit data={content}/>
                break;

            default:
                return (<div key={"1223"}>not yet implemented</div>)
        }
        return render;
    }

    saveToSessionStorage(value) {
        //webStorage API only saves strings
        sessionStorage.setItem(
            sessionStorageKey + this.props.data.id,
            JSON.stringify({content: value, timestamp: Date.now()})
        )
    }

    //onClick={() => this.setState({isHovered: true})}
    render() {
        const {id, type} = this.props.data;
        return (
            <div>

                <section style={this.state.mode}
                         onMouseEnter={() => this.setState({isHovered: true})}
                         onMouseLeave={() => this.setState({isHovered: false})}
                         onClick={() => this.setState({isClicked: true})}
                >
                    <FadeableCard
                        id={id}
                        type={type}
                        onDelete={() => this.props.onDelete(id)}
                        onMoveUp={() => this.props.onMove(id, -1)}
                        onMoveDown={() => this.props.onMove(id, +1)}
                        isEditMode={!this.props.isPreview && this.state.isHovered}
                    >
                        {this.typeToComponent(type)}
                    </FadeableCard>
                </section>
            </div>
        );
    }
}


Element.propTypes = {
    id: PropTypes.string,
    //data: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onMove: PropTypes.func
};

export default Element;
