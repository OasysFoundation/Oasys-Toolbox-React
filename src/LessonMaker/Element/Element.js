import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import VisibilitySensor from 'react-visibility-sensor';
import { connect } from 'redux-zero/react';
import { Card } from 'reactstrap';

import ViewApi from './ViewApi';
import EditApi from './EditApi';
import UnknownElement from './UnknownElement';

import EndOfChapterView from '../EndOfChapterView';
import EndOfChapterEdit from '../EndOfChapterEdit';
import FadeableCard from '../FadeableCard';

import globals from '../../utils/globals';
import actions from '../../store/actions';
import { capitalize } from '../../utils/tools';


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

// Define default elements that are always used
let elementTypes = {
    EndOfChapterView: EndOfChapterView,
    EndOfChapterEdit: EndOfChapterEdit,
};

// Define which custom element types to use here. Any <ElemType> will be dynamically imported 
// from the two components ./<ElemType>/<ElemType>View and ./<ElemType>/<ElemType>Edit, so any custom
// element type must at the very least contain the two corresponding files.
// NOTE: This is the ONLY place where custom element types needs to be defined now, so definitions in 
// globals should not have to be used any more (but right now they are used for compatibility reasons).
const customElementTypes = [
    'Text'
];

// Dynamically import all necessary element type files. Each element type needs to expose two components,
// one for viewing and one for editing. Their names must match the element's name. Example:
// The 'Text' element must live in the 'Text' subfolder, which must contain 'TextView.js' and 'TextEdit.js'.
customElementTypes.forEach(elem => {
    ['View', 'Edit'].forEach(variant => {
        elementTypes[elem+variant] = Loadable({
          loader: () => import(`./${elem}/${elem}${variant}`),
          loading() { return null },
        });
    });
});


class Element extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangeVisibility = this.handleChangeVisibility.bind(this); // analytics. need to refactor.
    }

    componentWillReceiveProps(nextprops) {
        // do we really this still?
        if (nextprops.shouldInstantUpdate) {
            this.props.instantUpdateElements(false);
        }
    }

    typeToComponent(elemType, logicProps, renderType) {
        /* renderType must be either 'view' or 'edit' */
        // TODO: refactor these props, especially handleQuizAnswer
        const props = Object.assign({
            key: this.props.data.id,
            id: this.props.data.id,
            type: elemType,
            chapters: this.props.chapters.map(c => ({title: c.title, id: c.id})),
            activeChapterIndex: this.props.activeChapterIndex,
            handleReady: this.props.handleReady,
            handleQuizAnswer: this.props.handleQuizAnswer,
        }, logicProps);

        if (elemType in elemMap) {
            const elemName = elemMap[elemType]+capitalize(renderType);
            return React.createElement(elementTypes[elemName], props, null);
        }
        return React.createElement(UnknownElement, props, null);
    }

    handleChangeVisibility(isVisible) { // analytics. need to refactor into its own component
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
        const {id, type} = this.props.data;
        return (
            <center>
                <div className='main-width'>
                    {this.props.isEditMode 
                    ? <EditApi data={this.props.data} render={(logicProps)=>(
                        <FadeableCard id={id} type={type} isEditMode={this.props.isEditMode}>
                            {this.typeToComponent(this.props.data.type, logicProps, 'edit')}
                        </FadeableCard>
                      )}/>
                    : <ViewApi data={this.props.data} handleReady={this.props.handleReady} render={(logicProps)=>(
                        <Card className='card-fancy has-shadow card content-view'>
                            {!this.props.isPreview && 
                                <VisibilitySensor ref={this.sensorRef} onChange={this.handleChangeVisibility}/>}
                            {this.typeToComponent(this.props.data.type, logicProps, 'view')}
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


const mapStoreToProps = (store) => ({
    chapters: store.chapters, 
    shouldInstantUpdate: store.shouldInstantUpdate, 
    isEditMode: store.isEditMode,
    activeChapterIndex: store.activeChapterIndex
});

const neededActions = (store) => {
    const {instantUpdateElements} = actions();
    return {instantUpdateElements}
};

export default connect(mapStoreToProps, neededActions)(Element);