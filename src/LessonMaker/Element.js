import React, {Component} from 'react';
import PropTypes from 'prop-types';

const styling = {
    maxWidth: 700 + 'px',
    marginTop: 1 + 'rem',
    minWidth: 500 + 'px',
    marginBottom: 1 + 'rem',
    wordBreak: 'break-all' //dafuq was this not a default in HTML
}

class Element extends Component {

    constructor(props) {
        super(props);
        this.state = {data: null}
    }

    typeToComponent(type) {
        //case (type) etc
        return <section>A component</section>
    }

    onInteractionEvent() {

    }

    //TODO pass down a save function and call this.props.saveToState function
    render() {
        return (
            <textarea
                value={this.state.data || this.props.data}
                onChange={(ev) => {
                    console.log(ev.target.value)
                    this.setState({data: ev.target.value})
                    this.props.onProgress(ev.target.value)
                }}
                style={styling}>
            </textarea>
        );
    }
}

Element.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    data: PropTypes.object.isRequired
};

export default Element;
