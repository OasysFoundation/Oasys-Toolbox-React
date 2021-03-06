import React, {Component} from 'react';
import PropTypes from 'prop-types';
import globals from '../utils/globals'

import {
    Card,
    CardBody,
    Collapse,
    Fade
} from 'reactstrap';

import ToolbarQuill from './Element/Text/ToolbarQuill'
import actions from "../store/actions";
import { connect } from "redux-zero/react";

import {ICON} from '../utils/trickBox'
import {typeToString} from "../utils/tools";

// console.log(globals.ICON_FONTSIZE_MIDDLE, 'fontsize')


const styling = {
    toolbar: {
        display: `flex`,
        position: `relative`,
        height: 0.9 + `rem`,
        zIndex: 2,
        justifyContent: 'center',
        cursor: 'default',
    },
    card: {},
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0.2rem',
    }
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
        const extraClass = (type===globals.EDIT_CONTINUE_ELEMENT) ? 'continue' : '';
        //for debugging
        return (
            <div>
                <Fade timeout={300} in={this.state.shouldFade}>
                    <Card className={this.state.isOpen ? "card-fancy has-shadow "+extraClass : "card-fancy has-shadow minimized"}>
                        {type===globals.EDIT_CONTINUE_ELEMENT
                            ? null
                            : <section style={styling.cardActions} > 
                                {/*Quill has to render but is hidden if not Quill, bc QUILL is hacky and searches for a toolbar ID*/}
                                {ToolbarQuill(id, type === globals.EDIT_QUILL && isEditMode)}
                                <div className='card-hint'>
                                    {this.state.isOpen ? null : typeToString(type) }
                                </div>
                                <div hidden={!isEditMode} >
                                    <a className="card-header-action btn btn-setting"
                                       onClick={() => this.props.onMoveElement(id, -1)}
                                    >
                                        {ICON("icon-arrow-up-circle")}
                                    </a>

                                    <a className="card-header-action btn btn-setting"
                                       onClick={() => this.props.onMoveElement(id, +1)}>
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
                                            this.props.onDeleteElement(id) //id is alrea
                                        }}>
                                        {ICON("icon-close")}
                                    </a>
                                </div>
                            </section>
                        }
                        {/*</CardHeader>*/}
                        <Collapse isOpen={this.state.isOpen} id="collapseExample">
                            <CardBody>
                                {/*  !! This passes the Children (in render) of Fadeable card from <Element/>  in between here !! */}
                                {this.props.children}

                            </CardBody>
                        </Collapse>
                    </Card>

                </Fade>
            </div>

        );
    }
}

FadeableCard.propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    onDeleteElement: PropTypes.func.isRequired
};

//actions is a function that returns on object of functions!
const mapStoreToProps = (store) => ({});

//don't need anything!
const neededActions = (store) => {
    const {onDeleteElement, onMoveElement} = actions();
    return {onDeleteElement, onMoveElement}
};
export default connect(mapStoreToProps, neededActions)(FadeableCard);
