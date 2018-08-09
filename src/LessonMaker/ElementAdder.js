import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ElementAdder extends Component {

    state = {
        isHovered: false
    }
    handleClick(selected) {
        this.props.onAddElement(selected);
    }

    render() {
        return (
            <section className={'card-header'} id={'elementAdd'}
                     onMouseEnter={() => this.setState({isHovered: true})}
                     onMouseLeave={() => this.setState({isHovered: false})}
            >
                <button>
                    +++
                </button>
                {this.state.isHovered ? <div>

                    <button onClick={() => this.handleClick('text')}>T</button>
                    <button onClick={() => this.handleClick('image')}>I</button>
                    <button onClick={() => this.handleClick('video')}>V</button>
                    <button onClick={() => this.handleClick('formula')}>F</button>

                </div> : null}
            </section>

        );
    }
}

ElementAdder.propTypes = {
    onSelect: PropTypes.func.isRequired
};

export default ElementAdder;
