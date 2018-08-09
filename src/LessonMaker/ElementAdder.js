import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {typeToIcon} from "../utils/trickBox";
import globals from '../globals'

const styling = {
    all: {
        display: 'flex',
        flexGrow: 0,
        flexDirection: "row",
        justifyContent: "center",
    },
    image: {
        height: 2.5 + "rem",
        objectFit: "cover",
        cursor: 'pointer'
    }
};

const {EDIT_QUILL, EDIT_QUIZ, EDIT_SYSTEM, EDIT_GAME} = globals;

const types = [
    EDIT_QUILL,
    EDIT_QUIZ,
    EDIT_GAME,
    EDIT_SYSTEM
]


class ElementAdder extends Component {

    state = {
        isHovered: false
    }

    render() {
        const that = this;
        return (
            <section style={styling.all} className={'card-header'}
                     onMouseEnter={() => this.setState({isHovered: true})}
                     onMouseLeave={() => this.setState({isHovered: false})}
            >
                {types.map(type =>
                    <img style={styling.image}
                         key={Math.random()}
                         src={typeToIcon(type)}
                         onClick={() => that.props.onAddElement(type, that.props.idx)}
                    />)}

            </section>

        );
    }
}

ElementAdder.propTypes = {
    onAddElement: PropTypes.func.isRequired
};

export default ElementAdder;
