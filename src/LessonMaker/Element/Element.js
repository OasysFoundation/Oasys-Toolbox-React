import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'redux-zero/react';
import { Card, CardBody, Button } from 'reactstrap';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { PacmanLoader } from 'react-spinners';

import {getContentFromSessionStorage} from '../../utils/trickBox';
import colors from '../../utils/colors';
import globals from '../../utils/globals';
import actions from '../../store/actions';
import { capitalize } from '../../utils/tools';

import ViewCard from './ViewCard';
import EditCard from './EditCard';
import ElementLogic from './ElementLogic';

// import element types to use
import EndOfChapterView from '../EndOfChapterView';
import EndOfChapterEdit from '../EndOfChapterEdit';
import TextView from './Text/TextView';
import TextEdit from './Text/TextEdit';
/*<
import Image from './Image/Image';
import Formula from './Formula/Formula';
import Quiz from './Quiz/Quiz';
import Video from './Video/Video';
import Embed from './Embed/Embed';
import Iframe from './Iframe/Iframe';
*/

// Define which element types to use here (definitions in globals should not have to be used any more). 
// For now, we have to manually import ElementView and ElementEdit for each of the elements.
// We also need to make a somewhat awkward mapping in elementTypes because React.CreateElement does not 
// accept components as strings in its first argument (see typeToComponent)... not clear if there is a better way to do this?!
let elementTypes = {};
elementTypes['TextView'] = TextView;
elementTypes['TextEdit'] = TextEdit;
elementTypes['EndOfChapterView'] = EndOfChapterView;
elementTypes['EndOfChapterEdit'] = EndOfChapterEdit;
/* elementTypes['Image'] = Image;
elementTypes['Formula'] = Formula;
elementTypes['Quiz'] = Quiz;
elementTypes['Video'] = Video;
elementTypes['Embed'] = Embed;
elementTypes['Iframe'] = Iframe;
*/

// Save at most every SAVE_INTERVAL ms. 
const SAVE_INTERVAL = 0;

class Element extends Component {

    constructor(props) {
        super(props);

        // define event handlers that elements can use as hooks
        this.handlers = [
            'handleReady',
            'handleAction',
            'handleAddChapter',
        ];
        this.handlers.forEach(h => this[h] = this[h].bind(this));
        this.handleChangeVisibility = this.handleChangeVisibility.bind(this);
        this.handleFoldInView = this.handleFoldInView.bind(this);

        this.timeLastSaved = Date.now();

        // actionDict defines the set of possible actions that each individual edit/view component has access to.
        // an action can be executed by calling this.props.handleAction(action) from the edit/view component.
        // action must be an object which has properties type and value, where type is any of the properties of actionDict.
        this.actionDict = {
            notify: (value) => {
                this.props.sendSnackBarMessage(value)
            },
            save: (value) => {
                const now = Date.now();
                this.setState(
                    () => ({tempContent: value, timestamp: now}),
                    () => {
                        if (now - this.timeLastSaved > SAVE_INTERVAL) {
                            this.timeLastSaved = now;
                            this.handleChangeContent();
                        }
                });
            },
            changeChapter: (value) => {
                this.props.handleChapterChange(value, undefined);
            },
        }

        this.state = {
            isHovered: false,
            tempContent: this.props.data.content || getContentFromSessionStorage(this.props.data.id),
            timestamp: Date.now(),
            shouldFoldInView: false,
            isReady: false
        };
    }

    handleAction(action) {
        /*
            handleAction gets called by all element handlers. 
            it expects an action that is an object that contains properties "type" and "value".
        */
        if (action===undefined || !('type' in action) || !('value' in action)) {
            console.log('Could not execute element action. A valid action is an object with properties "type" and "value".');
            console.log(action);
            return;
        }
        if (typeof(action.type)!=='string') {
            console.log('Could not execute element action. Its "type" must be a string.');
            console.log(action);
            return;
        }
        this.actionDict[action.type](action.value);
    }

    handleReady() {
        this.setState({ isReady: true });
    }

    // other handlers - still need to refactor below
    handleAddChapter(action) {
        this.handleAction(action);
    }

    handleChangeContent() {
        this.props.onChangeContent(
            this.props.data.id,
            this.state.tempContent,
            this.props.data.parentChapterID
        );
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

    componentWillUnmount() {
        this.handleChangeContent();
        this.setState({shouldFoldInView: true});
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.shouldInstantUpdate) {
            this.handleChangeContent();
            this.props.instantUpdateElements(false);
        }
    }

    typeToComponent(elemType, renderType) {
        /*
        renderType must be either 'view' or 'edit'
        */
        const props = {
            key: this.props.data.id,
            id: this.props.data.id,
            data: this.state.tempContent,
            isHovered: this.state.isHovered,
            isEditMode: this.props.isEditMode,
            chapters: this.props.chapters.map(c => ({title: c.title, id: c.id})),
            activeChapterIndex: this.props.activeChapterIndex,
            handleReady: this.handleReady,

        }
        // add event handlers that elements can use as hooks
        props['handleQuizAnswer'] = this.props.handleQuizAnswer;
        this.handlers.forEach(h =>
            props[h] = this[h]
        );

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

        let elemRender = <div key={"1234567890"}> Could not render element {elemType} (unknown) </div>;
        if (elemType in elemMap) {
            const elemName = elemMap[elemType]+capitalize(renderType);
            elemRender = React.createElement(elementTypes[elemName], props, null);
        } 
        return elemRender;
    }

    render() {
        const props = {
            data: this.props.data,
            isEditMode: this.props.isEditMode,
            shouldFoldInView: this.state.shouldFoldInView,
            handleFoldInView: this.handleFoldInView,
            handleReady: this.handleReady,
        }
        return (
            <center>
                <div className='main-width'>
                    <section onMouseEnter={() => this.setState({isHovered: true})}
                             onMouseLeave={() => this.setState({isHovered: false})}
                    >
                     
                     <ElementLogic 
                        style={this.state.isReady?{display:'inline'}:{display:'none'}} {...props} 
                        render={(logicProps) => (
                            this.props.isEditMode 
                            ? <EditCard {...logicProps}> {this.typeToComponent(this.props.data.type, 'edit')} </EditCard>
                            : <ViewCard {...logicProps}> {this.typeToComponent(this.props.data.type, 'view')} </ViewCard>
                    )}/>

                     <div style={this.state.isReady?{display:'none'}:{display:'inline'}} {...props} > 
                        <PacmanLoader color={colors.BLUESTEEL} />
                      </div>
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
    const {onChangeContent, updateChapterLinks, instantUpdateElements, handleAddChapter} = actions();
    return {onChangeContent, updateChapterLinks, instantUpdateElements, handleAddChapter}
};

//IMPORTANT!! the project data is in the project obj, the rest of the store (action functions) is just flat there
export default connect(mapStoreToProps, neededActions)(Element);