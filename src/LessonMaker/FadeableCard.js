import React, {Component} from 'react';
import PropTypes from 'prop-types';
import globals from '../globals'

import {
    Card,
    CardBody,
//    CardHeader,
//    CardFooter,
    Collapse,
    Fade
} from 'reactstrap';

import ToolbarQuill from './ToolbarQuill'

// console.log(globals.ICON_FONTSIZE_MIDDLE, 'fontsize')
const ICON = function (className, fontSize = globals.ICON_FONTSIZE_MIDDLE) {
    return <i style={{fontSize: fontSize, color: '#626970'}} className={className}> </i>;
}


const styling = {
    toolbar: {
        display: `flex`,
        position: `relative`,
        height: 0.9 + `rem`,
        zIndex: 2,
        justifyContent: 'center'
    },
    card: {},
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0.2rem',
    }
}

function typeToString(type) {
    const dict = {};
    dict[globals.EDIT_QUILL] = 'Text';
    dict[globals.EDIT_QUIZ] = 'Quiz';
    dict[globals.EDIT_GAME] = 'Game';
    dict[globals.EDIT_VIDEO] = 'Video';
    dict[globals.EDIT_IMAGE] = 'Image';
    dict[globals.EDIT_FORMULA] = 'Formula';
    return dict[type];
}

class FadeableCard extends Component {
    state = {
        isOpen: true,
        shouldFade: true
    }

    toggle(prop) { //used for isEditmode...
        this.setState({[prop]: !this.state[prop]})
    }

    render() {
        let {type, id, isEditMode} = this.props;
        isEditMode = true; //for debugging
        return (
            <div>
                <section style={styling.toolbar}>
                    <section>
                        {/*Quill has to render but is hidden if not Quill, bc QUILL is hacky and searches for a toolbar ID*/}
                        {ToolbarQuill(id, type === globals.EDIT_QUILL && isEditMode)}
                    </section>
                </section>
                <Fade timeout={300} in={this.state.shouldFade}>
                    <Card className="card-fancy has-shadow">
                        {/*<CardHeader>*/}
                            <section style={styling.cardActions} >
                                <div className='card-hint'>
                                    {this.state.isOpen ? null : typeToString(type) }
                                </div>
                                <div hidden={!isEditMode} >
                                    <a className="card-header-action btn btn-setting"
                                       onClick={this.props.onMoveUp}
                                    >
                                        {ICON("icon-arrow-up-circle")}
                                    </a>

                                    <a className="card-header-action btn btn-setting"
                                       onClick={this.props.onMoveDown}>
                                        {ICON("icon-arrow-down-circle")}
                                    </a>
                                    <a
                                        className="card-header-action btn btn-setting"
                                        data-target="#collapseExample"
                                        onClick={() => this.toggle('isOpen')}>
                                        {/*minize*/}
                                        {ICON("icon-minus")}
                                    </a>
                                    <a
                                        className="card-header-action btn btn-setting"
                                        onClick={() => {
                                            this.toggle('shouldFade')
                                            this.props.onDelete() //id is alrea
                                        }}>
                                        {ICON("icon-close")}
                                    </a>
                                </div>
                            </section>

                        {/*</CardHeader>*/}
                        <Collapse isOpen={this.state.isOpen} id="collapseExample">
                            <CardBody>
                                {/*  !! This passes the Content in between here !! */}
                                {this.props.children}

                            </CardBody>
                        </Collapse>
                        {/*<CardFooter style={styling.cardFooter}>*/}
                        {/*<button>*/}
                        {/*+++*/}
                        {/*</button>*/}
                        {/*</CardFooter>*/}
                    </Card>

                </Fade>
            </div>

        );
    }
}

FadeableCard.propTypes = {
    type: PropTypes.number,
    id: PropTypes.string,
    isEditMode: PropTypes.bool,
    onDelete: PropTypes.func,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
};

export default FadeableCard;
