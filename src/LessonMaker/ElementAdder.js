import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {typeToIcon} from "../utils/trickBox";
import globals from '../globals'
import {connect} from "redux-zero/react";
import actions from "../store/actions";

import AddNewElementModal from './AddNewElementModal'

const styling = {
    all: {
        display: 'flex',
        flexGrow: 0,
        flexDirection: "row",
        justifyContent: "center",
        height: 3 + 'rem',
    },
    image: {
        height: 2.5 + "rem",
        objectFit: "cover",
        cursor: 'pointer',
        borderRadius: 8+ "px",
        margin: 0.5 + 'rem',
        opacity: 0.85
    }
};

const {EDIT_QUILL, EDIT_QUIZ, EDIT_SYSTEM, EDIT_EMBED} = globals;

const types = [
    EDIT_QUILL,
    EDIT_QUIZ,
    EDIT_EMBED,
    EDIT_SYSTEM
]



class ElementAdder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showsNewElementModal: false
        }

        this.onCloseElementModal = this.onCloseElementModal.bind(this);
        this.onAddNewElement = this.onAddNewElement.bind(this);
        this.onSelectElement = this.onSelectElement.bind(this);
    }


    onAddNewElement() {
        this.setState({
            showsNewElementModal: true
        });
    }

    onCloseElementModal() {
        this.setState({
            showsNewElementModal: false
        });
    }

    onSelectElement(elementType) {
        this.props.onAddElement(elementType, this.props.idx);
        this.setState({
            showsNewElementModal: false
        });
    }

    render() {
        const that = this;
        return (

            <section style={styling.all} className={'card-header'}
                     onMouseEnter={() => this.setState({isHovered: true})}
                     onMouseLeave={() => this.setState({isHovered: false})}
            >
                <section style={{alignSelf:'center', display: 'flex', 'justifyContent': 'center', alignItems: 'center', marginTop:'15px'}}>
                    <i style={{color: '#A2ABB8', fontSize:'30px'}} className='icon-plus' onClick={this.onAddNewElement}> </i>
                    {this.props.nElems<=1 

                    ?
                      <span className='help-text' style={{color: '#626970', marginLeft: '15px'}}>You can add more content by clicking or tapping the plus icon.</span>
                    : null
                    }
                    
                <AddNewElementModal isOpen={this.state.showsNewElementModal} onClose={this.onCloseElementModal} onSelectElement={this.onSelectElement}/>
                </section>
            </section>
        );
    }
}


ElementAdder.propTypes = {
    onAddElement: PropTypes.func.isRequired,
    nElems: PropTypes.number.isRequired
};

//check lessonmaker if you don't get the syntax here
const mapStoreToProps = ({chapters, activeChapterIndex}) => ({nElems: chapters[activeChapterIndex].elements.length})
//neededActions === function
const neededActions = (store) => {
    const {onAddElement} = actions();
    return {onAddElement}
};

export default connect(mapStoreToProps, neededActions)(ElementAdder);
