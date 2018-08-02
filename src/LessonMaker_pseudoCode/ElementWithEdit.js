import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Element from './Element';

const styles = {}

class ElementWithEdit extends Component {
    state = {}

    onDelete(){

    }
    handleHover() {

    }
    handleClick() {
    }
    handleMove(direction) { //up / down

    }
    onSetCondition(){
        //save eventId linked with chapterId
    }

    render() {
        return (
            <section style={styles}>
                <Element onHover={} onClick={} isEditable={true}/>
            </section>
        );
    }
}

ElementWithEdit.propTypes = {};

export default ElementWithEdit;
