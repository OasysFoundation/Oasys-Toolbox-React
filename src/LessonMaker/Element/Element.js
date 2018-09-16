import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'redux-zero/react';
import VisibilitySensor from 'react-visibility-sensor';
import { Card, CardBody, Button } from 'reactstrap';
import Loadable from 'react-loadable';

import {getContentFromSessionStorage} from '../../utils/trickBox';
import globals from '../../utils/globals';
import actions from '../../store/actions';
import { capitalize } from '../../utils/tools';
import FadeableCard from '../FadeableCard';

import ViewLogic from './ViewLogic';
import EditLogic from './EditLogic';
import UnknownElement from './UnknownElement';
import EndOfChapterView from '../EndOfChapterView';
import EndOfChapterEdit from '../EndOfChapterEdit';

// need this map for now (for backwards compatibility)
// to get rid of the map, we need to store the map's values in the db instead of the map's keys
const elemMap = {};
elemMap[globals.EDIT_QUILL] = 'Text';
elemMap[globals.EDIT_IMAGE] = 'Image';
elemMap[globals.EDIT_FORMULA] = 'Formula';
elemMap[globals.EDIT_QUIZ] = 'Quiz';
elemMap[globals.EDIT_VIDEO] = 'Video';
elemMap[globals.EDIT_EMBED] = 'Embed';
elemMap[globals.EDIT_IFRAME] = 'Iframe';
elemMap[globals.EDIT_CONTINUE_ELEMENT] = 'EndOfChapter';

// Default elements that are always used
let elementTypes = {
    EndOfChapterView: EndOfChapterView,
    EndOfChapterEdit: EndOfChapterEdit,
};
// Define which custom element types to use here.
// This is the ONLY place where this needs to be defined now!
// (definitions in globals should not have to be used any more, but right now they are used for compatibility reasons) 
const elements = [
    'Text'
];

// dynamically import all necessary element files. Each element type needs to expose two components, one for
// viewing and one for editing. Their names must match the element's name. Example:
// The 'Text' element should live in the 'Text' subfolder, which must contain 'TextView.js' and 'TextEdit.js'.
elements.forEach(elem => {
    ['View', 'Edit'].forEach(variant => {
        elementTypes[elem+variant] = Loadable({
          loader: () => import(`./${elem}/${elem}${variant}`),
          loading() { return null },
        });
    });
});


class Element extends Component {

    constructor(props) {
        super(props);
        this.handleChangeVisibility = this.handleChangeVisibility.bind(this);
    }

    componentWillReceiveProps(nextprops) {
        // do we really need shouldInstantUpdate still?
        if (nextprops.shouldInstantUpdate) {
            this.props.instantUpdateElements(false);
        }
    }

    typeToComponent(elemType, logicProps, renderType) {
        /* renderType must be either 'view' or 'edit' */
        const props = Object.assign({
            key: this.props.data.id,
            type: elemType,
            id: this.props.data.id,
            chapters: this.props.chapters.map(c => ({title: c.title, id: c.id})),
            activeChapterIndex: this.props.activeChapterIndex,
            handleReady: this.props.handleReady,
            handleQuizAnswer: this.props.handleQuizAnswer,
        }, logicProps);

        if (elemType in elemMap) {
            const elemName = elemMap[elemType]+capitalize(renderType);
            return React.createElement(elementTypes[elemName], props, null);
        } else {
            return React.createElement(UnknownElement, props, null);
        }
    }

    handleChangeVisibility(isVisible) {
    // analytics. need to refactor into its own component
        let elemAnalytics = {
            id: this.props.data.id, 
            type: this.props.data.type, 
            visible: isVisible,
            time: new Date(),
        }
        console.log(elemAnalytics)
        this.props.onChangeVisibility(elemAnalytics);
    }

    render() {
        const props = {
            data: this.props.data,
            handleReady: this.props.handleReady,
            handleChapterChange: this.props.handleChapterChange,        }
        return (
            <center>
                <div className='main-width'>
                    {this.props.isEditMode 
                    ? <EditLogic {...props} render={(logicProps)=>(
                        <FadeableCard
                            id={this.props.data.id}
                            type={this.props.data.type}
                            isEditMode={this.props.isEditMode}
                        >
                            {this.typeToComponent(this.props.data.type, logicProps, 'edit')}
                        </FadeableCard>
                      )}/>
                    : <ViewLogic {...props} render={(logicProps)=>(
                        <Card className='card-fancy has-shadow card content-view'>
                            <CardBody>
                                {!this.props.isPreview && <VisibilitySensor ref={this.sensorRef} onChange={this.handleChangeVisibility}/>}
                                {this.typeToComponent(this.props.data.type, logicProps, 'view')}
                            </CardBody>
                        </Card>
                      )}/>
                    }
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
    const {updateChapterLinks, instantUpdateElements, handleAddChapter, sendSnackbarMessage} = actions();
    return {updateChapterLinks, instantUpdateElements, handleAddChapter, sendSnackbarMessage}
};

export default connect(mapStoreToProps, neededActions)(Element);