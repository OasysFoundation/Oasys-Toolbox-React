import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "redux-zero/react";
import 'react-quill/dist/quill.snow.css';

import {
    Card,
    CardBody,
    Button
} from 'reactstrap';

import {getContentFromSessionStorage} from '../../utils/trickBox';
import globals from '../../utils/globals';

import actions from "../../store/actions";
import colors from '../../utils/colors';

import ViewCard from './ViewCard';
import EditCard from './EditCard';

import ElementLogic from './ElementLogic';

import Text from './Text/Text';
import Image from './Image/Image';
import Formula from './Formula/Formula';
import Quiz from './Quiz/Quiz';
import Video from './Video/Video';
import Embed from './Embed/Embed';
import Iframe from './Iframe/Iframe';
import Continue from '../Continue';

// Define which element types to use here. we need the awkward mapping in elementTypes because
// React.CreateElement does not accept components as strings... improvement suggestions??
let elementTypes = {};
elementTypes['Text'] = Text;
elementTypes['Image'] = Image;
elementTypes['Formula'] = Formula;
elementTypes['Quiz'] = Quiz;
elementTypes['Video'] = Video;
elementTypes['Embed'] = Embed
elementTypes['Iframe'] = Iframe
elementTypes['Continue'] = Continue

// Save at most every SAVE_INTERVAL ms. 
const SAVE_INTERVAL = 0;

class Element extends Component {

    constructor(props) {
        super(props);

        this.handleChangeVisibility = this.handleChangeVisibility.bind(this);
        this.handleElementFinished = this.handleElementFinished.bind(this);
        this.handleFoldInView = this.handleFoldInView.bind(this);

        this.timeLastSaved = Date.now();

        this.state = {
            isHovered: false,
            tempContent: this.props.data.content || getContentFromSessionStorage(this.props.data.id),
            timestamp: Date.now(),
            shouldFoldInView: false,
            isLoading: false
        };
    }

    // glue function between LessonMaker and Quill to add ID
    handleChange = (value) => {
        let shouldUpdateChapterLinks = false;
        let shouldInstantUpdate = false;
        const now = Date.now();
        if (now - this.timeLastSaved > SAVE_INTERVAL) {
            this.timeLastSaved = now;
            shouldInstantUpdate = true;
        }
        this.setState(
            () => ({tempContent: value, timestamp: now}),
            () => {
                if (shouldInstantUpdate) {
                    this.handleChangeContent();
                }
                if (shouldUpdateChapterLinks) {
                    this.props.updateChapterLinks();
                }
            });
    };

    handleChangeContent() {
        this.props.onChangeContent(
            this.props.data.id,
            this.state.tempContent,
            this.props.data.parentChapterID
        );
    }

    componentWillUnmount() {
        this.handleChangeContent();
    }

    handleElementFinished() {
        this.setState({shouldFoldInView: true})
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.shouldInstantUpdate) {
            this.handleChangeContent();
            this.props.instantUpdateElements(false);
        }
    }

    handleChangeVisibility(isVisible) {
        let elemAnalytics = {
            id: this.props.data.id, 
            type: this.props.data.type, 
            visible: isVisible,
            time: new Date(),
        }
        this.props.onChangeVisibility(elemAnalytics);
    }

    handleFoldInView(value) {
        this.setState({shouldFoldInView: value});
    }

    onCompletedLoading() {
        this.setState({
            isLoading: false
        });
    }

    onStartLoading() {
        this.setState({
            isLoading: true
        });   
    }


    typeToComponent(elemType) {
        const props = {
            key: this.props.data.id,
            id: this.props.data.id,
            data: this.state.tempContent,
            isHovered: this.state.isHovered,
            isEditMode: this.props.isEditMode,
            onChange: this.handleChange.bind(this),
            onLearnerInteraction: this.props.onLearnerInteraction,
            onCompletedLoading: this.onCompletedLoading.bind(this),
            onStartLoading: this.onStartLoading.bind(this),
            chapters: this.props.chapters.map(c => ({title: c.title, id: c.id})),
            onAddChapter: this.props.onAddChapter,
            activeChapterIndex: this.props.activeChapterIndex,
            onQuizAnswer: this.props.onQuizAnswer,
            onFinishedVideo: this.handleElementFinished,
        }

        // need this map for now (for backwards compatibility)
        // to get rid of the map, we need to store the map's values in the db instead of the keys
        const elemMap = {};
        elemMap[globals.EDIT_QUILL] = 'Text';
        elemMap[globals.EDIT_IMAGE] = 'Image';
        elemMap[globals.EDIT_FORMULA] = 'Formula';
        elemMap[globals.EDIT_QUIZ] = 'Quiz';
        elemMap[globals.EDIT_VIDEO] = 'Video';
        elemMap[globals.EDIT_EMBED] = 'Embed';
        elemMap[globals.EDIT_IFRAME] = 'Iframe';
        elemMap[globals.EDIT_CONTINUE_ELEMENT] = 'Continue';

        let elemRender = <div key={"1234567890"}> Could not render element {elemType} (unknown)</div>;
        if (elemType in elemMap) {
            elemRender = React.createElement(elementTypes[elemMap[elemType]], props, null);
        } 
        return elemRender;
    }

    render() {
        const props = {
            data: this.props.data,
            isEditMode: this.props.isEditMode,
            isLoading: this.state.isLoading,
            shouldFoldInView: this.state.shouldFoldInView,
            handleFoldInView: this.handleFoldInView,
        }
        return (
            <center>
                <div className='main-width'>
                    <section onMouseEnter={() => this.setState({isHovered: true})}
                             onMouseLeave={() => this.setState({isHovered: false})}
                    >
                        {/* does not work!?
                        <ElementLogic {...props} render={(data, isEditMode, isLoading, shouldFoldInView, handleFoldInView) => (
                            isEditMode 
                            ? <EditCard {...props}> {this.typeToComponent(this.props.data.type)} </EditCard>
                            : <ViewCard {...props}> {this.typeToComponent(this.props.data.type)} </ViewCard>
                        )}/> */}
                        {this.props.isEditMode 
                        ? <EditCard {...props}> {this.typeToComponent(this.props.data.type)} </EditCard>
                        : <ViewCard {...props}> {this.typeToComponent(this.props.data.type)} </ViewCard>
                        }
                    </section>
                </div>
            </center>
        );
    }
}

Element.defaultProps = {
    isPreview: false
}

Element.propTypes = {
    data: PropTypes.object.isRequired,
};

const mapStoreToProps = ({chapters, shouldInstantUpdate, isEditMode, activeChapterIndex}) => ({chapters, shouldInstantUpdate, isEditMode, activeChapterIndex});

const neededActions = (store) => {
    const {onChangeContent, updateChapterLinks, instantUpdateElements, onAddChapter} = actions();
    return {onChangeContent, updateChapterLinks, instantUpdateElements, onAddChapter}
};

//IMPORTANT!! the project data is in the project obj, the rest of the store (action functions) is just flat there
export default connect(mapStoreToProps, neededActions)(Element);