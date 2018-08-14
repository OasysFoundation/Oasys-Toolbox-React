import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FadeableCard from './FadeableCard'
import globals from "../globals";
import QuillEdit from './QuillEdit'
import ImageEdit from './ImageEdit'
import FormulaEdit from './FormulaEdit'
import QuizzEdit from './QuizzEdit'
import VideoEdit from './VideoEdit'

import {saveToSessionStorage} from "../utils/trickBox";

import 'react-quill/dist/quill.snow.css';
import actions from "../store/actions";
import mapStoreToProps from "../store/mapStoreToProps";
import { connect } from "redux-zero/react";


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

class Element extends Component {
    
    state = {
        mode: styles.normal,
        isHovered: false,
        isClicked: false,
        tempContent: this.props.data.content
    };

    //glue function between LessonMaker and Quill to add ID
    handleChange = (value) => {
        this.setState({tempContent: value}); //for Quill
        saveToSessionStorage(this.props.data.id, value) //for s{this.typeToComponent(type)}witching chapters
    }


    typeToComponent(type) {
        const {content, id} = this.props.data
        let render = <div>NO ELEMENT TYPE YET HERE</div>;

        const isEditMode = this.state.isHovered || this.state.isClicked;
        // Q: Why is QuillEdit receiving the key prop, but ImageEdit and FormulaEdit not?
        switch (type) {
            case globals.EDIT_QUILL:
                render = <QuillEdit key={id} id={id} isPreview={this.props.isPreview} isEditMode={isEditMode} onChange={this.handleChange} data={this.state.tempContent}/>
                break;
            case globals.EDIT_IMAGE:
                render = <ImageEdit key={id} id={id} data={content} isPreview={this.props.isPreview} isEditMode={isEditMode} onChange={this.handleChange} />
                break;
            case globals.EDIT_FORMULA:
                render = <FormulaEdit key={id} id={id} data={content} isPreview={this.props.isPreview} isEditMode={isEditMode}
                                      onChange={this.handleChange} />
                break;
            case globals.EDIT_QUIZ:
                render = <QuizzEdit key={id} id={id} data={content} chapters={this.props.chaptersLight} isEditMode={isEditMode} isPreview={this.props.isPreview} onChange={this.handleChange} onAddChapter={this.props.onAddChapter} />
                break;
            case globals.EDIT_VIDEO:
                render = <VideoEdit key={id} id={id}  data={content} isPreview={this.props.isPreview} isEditMode={isEditMode} onChange={this.handleChange}/>
                break;

            default:
                return (<div key={"1223"}>not yet implemented</div>)
        }
        return render;
    }



    //onClick={() => this.setState({isHovered: true})}
    render() {
        const {id, type} = this.props.data;
        return (
            <center>
                <div className='mainWidth'>
                    <section style={this.state.mode}
                             onMouseEnter={() => this.setState({isHovered: true})}
                             onMouseLeave={() => this.setState({isHovered: false})}
                             onClick={() => this.setState({isClicked: true})}
                    >
                        <FadeableCard
                            id={id}
                            type={type}
                            // onDelete={() => this.props.onDeleteElement(id)}
                            // onMoveUp={() => this.props.onMoveElement(id, -1)}
                            // onMoveDown={() => this.props.onMoveElement(id, +1)}
                            isEditMode={!this.props.isPreview && this.state.isHovered}
                        >
                            {this.typeToComponent(type)}
                        </FadeableCard>
                    </section>
                </div>
            </center>
        );
    }
}


Element.propTypes = {
    id: PropTypes.string,
    //data: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onMove: PropTypes.func
};

//IMPORTANT!! the project data is in the project obj, the rest of the store (action functions) is just flat there

// export default connect(mapToProps, actions)( ({projects}) => React.createElement(LessonMaker, {project: projects[0]}) );
// export default connect(mapStoreToProps, actions)(Element);
export default connect(mapStoreToProps, actions)((propsFromStore) => {
    console.log(propsFromStore);
        const {projects} = propsFromStore;
        return React.createElement(Element, propsFromStore);
        // return (<LessonMaker people={people} setFirstName={setFirstName}/>)
    });

