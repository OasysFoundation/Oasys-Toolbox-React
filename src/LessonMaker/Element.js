import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FadeableCard from './FadeableCard'
import globals from "../globals";
import QuillEdit from './QuillEdit'

import 'react-quill/dist/quill.snow.css';


const styles = {
    normal: {
        cursor: 'pointer',
        border: `1px solid blue`
    },
    highlight: {
        cursor: 'pointer',
        background: 'lightyellow',
        border: `1px solid green`

    },
    edit: {}

};


//TODO
//put Fade from CoreUI --> Wrap it in component to manage IN/Out state!

const sessionStorageKey = `__OASYS_ID__`;

class Element extends Component {
    constructor(props) {
        super(props);
        this.saveToSessionStorage = this.saveToSessionStorage.bind(this);
    }

    state = {
        mode: styles.normal,
        isFocus: false
    };

    onSetCondition() {
        //save eventId linked with chapterId
    }
    onInteractionEvent() {

    }

    typeToComponent(type) {
        const {content} = this.props.data
        let render = <div>NO ELEMENT TYPE YET HERE</div>;

        switch (type) {
            case globals.EDIT_QUILL:
                render = <QuillEdit data={content}/>
                break;

            default:
                return (<div key={"1223"}>not yet implemented ☹️</div>)
        }
        return render;
    }

    saveToSessionStorage(value) {
        //webStorage API only saves strings
        sessionStorage.setItem(
            sessionStorageKey + this.props.data.id,
            JSON.stringify({content: value, timestamp: Date.now()})
        )
    }

    render() {
        const {id, content, type} = this.props.data;
        return (
            <div>

                <section style={this.state.mode}
                         onMouseEnter={() => this.setState({mode: styles.highlight})}
                         onMouseLeave={() => this.setState({mode: styles.normal})}
                         onClick={() => this.setState({isFocus: true})}>
                    <FadeableCard deleteMe={() => this.props.onDelete(id)}
                                  moveUp={() => this.props.onMove(id, -1)}
                                  moveDown={() => this.props.onMove(id, +1)}>
                        {this.typeToComponent(type)}
                        <textarea value={this.state.content || content || "NO CONTENT"}
                                  onChange={(ev) => {
                                      this.setState({content: ev.target.value});
                                      this.saveToSessionStorage(ev.target.value)
                                  }}>
                        </textarea>
                    </FadeableCard>
                </section>
            </div>
        );
    }
}

Element.propTypes = {
    id: PropTypes.string,
    // content: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onMove: PropTypes.func
};

export default Element;
