import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor';

import FadeableCard from './FadeableCard'
import globals from "../globals";
import QuillEdit from './QuillEdit'
import ImageEdit from './ImageEdit'
import FormulaEdit from './FormulaEdit'
import QuizzEdit from './QuizzEdit'
import VideoEdit from './VideoEdit'
import EmbedEdit from './EmbedEdit'

import {getContentFromSessionStorage} from "../utils/trickBox";
import {
    Card,
    CardBody
} from 'reactstrap';

import 'react-quill/dist/quill.snow.css';
import actions from "../store/actions";
import {connect} from "redux-zero/react";
import {isElementEmpty, initContent} from "../tools";


//TODO
//put Fade from CoreUI --> Wrap it in component to manage IN/Out state!

class Element extends Component {

    constructor(props) {
        super(props);
        this.changeVisibility = this.changeVisibility.bind(this);

        this.fromChapter = this.props.data.parentChapterID;

        this.state = {
            isHovered: false,
            tempContent: this.props.data.content || getContentFromSessionStorage(this.props.data.id),
            timestamp: Date.now()
        };
    }

    //glue function between LessonMaker and Quill to add ID
    handleChange = (value, shouldInstantUpdate = false) => {
        // const equal = JSON.stringify(value) === JSON.stringify(this.props.data.content)
        // console.log(value === this.props.data.content, equal, "EQUAL")
        //
        // saveToSessionStorage(this.props.data.id, value)
        // const storeTimestamp =  this.props.data.timestamp;
        // const sessionTimestamp = getContentFromSessionStorage(this.props.data.id).timestamp;
        //
        // console.log("Handle change fired @",this.props.data.id, this.props.data.timestamp, value, getContentFromSessionStorage(this.props.data.id) )
        //
        // console.log(storeTimestamp, sessionTimestamp, "TIMESTAMPS")
        //DO NOT CALL setState before session storage!! will override itself
        this.setState(
            () => ({tempContent: value, timestamp: Date.now()}), () => {
                if (shouldInstantUpdate) {
                    console.log("TEMP CONTENT ON ELEMENT AT", this.state.tempContent)
                    this.props.onChangeContent(
                        this.props.data.id,
                        this.state.tempContent,
                        this.fromChapter);
                    this.props.updateChapterLinks()
                }
            }); //for Quill
    };

    typeToComponent(type) {
        const {id} = this.props.data;
        const {isHovered} = this.state;

        const params = {
            key: id,
            id: id,
            data: this.state.tempContent,
            isHovered,
            isEditMode: this.props.isEditMode,
            onChange: this.handleChange.bind(this),
            onLearnerInteraction: this.props.onLearnerInteraction
        }

        let render = <div>NO ELEMENT TYPE YET HERE</div>;

        switch (type) {
            case globals.EDIT_QUILL:
                render = <QuillEdit {...params} data={this.state.tempContent}/>
                break;
            case globals.EDIT_IMAGE:
                render = <ImageEdit {...params} />
                break;
            case globals.EDIT_FORMULA:
                render = <FormulaEdit {...params} />
                break;
            case globals.EDIT_QUIZ:
                render = <QuizzEdit {...params}
                                    chapters={this.props.chapters.map(c => ({title: c.title, id: c.id}))}
                                    onAddChapter={this.props.onAddChapter}
                />
                break;
            case globals.EDIT_VIDEO:
                render = <VideoEdit {...params}/>
                break;
            case globals.EDIT_EMBED:
                render = <EmbedEdit {...params}/>
                break;
            default:
                return (<div key={"1223"}>not yet implemented</div>)
        }
        return render;
    }

    componentDidMount() {
        console.log('empty elements?', isElementEmpty(this.props.data))
    }

    componentWillUnmount() {
        // console.log('unmounting ', this.state.tempContent)
        this.props.onChangeContent(
            this.props.data.id,
            this.state.tempContent,
            this.fromChapter
        )
    }

    componentWillReceiveProps(nextprops) {
        // console.log(nextprops, 'nextprops!!')
        // const contentUpdated = nextprops.data.timestamp > this.state.timestamp
        // this.setState({tempContent: contentUpdated, timestamp: Date.now()})
    }

    changeVisibility(isVisible) {
        let visStr = 'invisible';
        if (isVisible) {visStr = 'visible'}
        console.log('Element type ' + this.props.data.type + ' (' + this.props.data.id + ') is now ' + visStr);
    }

    //onClick={() => this.setState({isHovered: true})}
    render() {
        const {id, type} = this.props.data;
        return (
            <center>
                <div className='main-width'>
                    <section onMouseEnter={() => this.setState({isHovered: true})}
                             onMouseLeave={() => this.setState({isHovered: false})}
                    >
                        {this.props.isEditMode ?
                            <FadeableCard
                                id={id}
                                type={type}
                                isEditMode={this.props.isEditMode}
                            >
                                {this.typeToComponent(type)}
                            </FadeableCard>
                            :
                            <Card className="card-fancy has-shadow">
                                <CardBody>
                                    <VisibilitySensor onChange={this.changeVisibility}/>
                                    {this.typeToComponent(type)}
                                </CardBody>
                                {/*<hr/>*/}
                            </Card>
                        }


                    </section>
                </div>
            </center>
        );
    }
}


Element.propTypes = {
    data: PropTypes.object.isRequired,
};

const mapStoreToProps = ({chapters, isEditMode, activeChapterIndex}) => ({chapters, activeChapterIndex, isEditMode});

// Element.defaultPropTypes = {
//     data: function (props, propName) {
//         // console.log(props, propName, props.data.type, 'proptype check', typeof props.data.content,  typeof initContent(props['type']));
//         if (isEmpty(props.data.content) || typeof props.data.content !== typeof initContent(props.data.type)) {
//             return new Error('' + props.data.id + " , " + props.data.type + " " + "Content does not fit Content Type @ Element")
//         }
//     }
// };

//don't need anything!
const neededActions = (store) => {
    const {onChangeContent, updateChapterLinks} = actions();
    return {onChangeContent, updateChapterLinks}
};

//IMPORTANT!! the project data is in the project obj, the rest of the store (action functions) is just flat there
export default connect(mapStoreToProps, neededActions)(Element);