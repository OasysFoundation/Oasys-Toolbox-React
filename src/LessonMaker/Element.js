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
import {connect} from "redux-zero/react";


//TODO
//put Fade from CoreUI --> Wrap it in component to manage IN/Out state!

class Element extends Component {

    state = {
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

        const isFocus = this.state.isHovered || this.state.isClicked;

        const params = {
            key: id,
            id: id,
            test: "XXX",
            data: content,
            isFocus,
            isEditMode: isFocus, //phase out editMode to not confuse
            // isPreview: this.props.isPreview,
            onChange: this.handleChange
        }
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
                render = <QuizzEdit {...params} chapters={this.props.chapters.map(c => ({title: c.title, id: c.id}))}
                                    onAddChapter={this.props.onAddChapter}/>
                break;
            case globals.EDIT_VIDEO:
                render = <VideoEdit {...params}/>
                break;

            default:
                return (<div key={"1223"}>not yet implemented</div>)
        }
        return render;
    }


    //onClick={() => this.setState({isHovered: true})}
    render() {
        const {id, type} = this.props.data;
        const that = this;
        return (
            <center>
                <section onMouseEnter={() => this.setState({isHovered: true})}
                         onMouseLeave={() => this.setState({isHovered: false})}
                         onClick={() => this.setState({isClicked: true})}
                >
                    {this.props.isEditMode
                        ? (<FadeableCard
                            id={id}
                            type={type}
                            isEditMode={!this.props.isEditMode && this.state.isHovered}
                            >
                            {this.typeToComponent(type)}
                        </FadeableCard>)
                        : (<React.Fragment>{this.typeToComponent(type)}</React.Fragment>)
                    }

                </section>
            </center>
        );
    }
}


Element.propTypes = {
    id: PropTypes.string,
    data: PropTypes.object.isRequired,
};

const mapStoreToProps = ({chapters, isEditMode}) => ({chapters, isEditMode});

//don't need anything!
const neededActions = (store) => ({});

//IMPORTANT!! the project data is in the project obj, the rest of the store (action functions) is just flat there
export default connect(mapStoreToProps, neededActions)(Element);