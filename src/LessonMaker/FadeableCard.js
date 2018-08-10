import React, {Component} from 'react';
import PropTypes from 'prop-types';
import globals from '../globals'

import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Collapse,
    Fade
} from 'reactstrap';

import ToolbarQuill from './ToolbarQuill'

// console.log(globals.ICON_FONTSIZE_MIDDLE, 'fontsize')
const ICON = function (className, fontSize = globals.ICON_FONTSIZE_MIDDLE) {
    return <i style={{fontSize: fontSize}} className={className}> </i>;
}


const styling = {
    cardHeader: {
        display: 'flex',
        flexGrow: 0,
        // flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardFooter: {
        margin: 'auto',
    },
    toolbars: {
        margin: 'auto',
    },
    cardActions: {
        flex:1,
        alignSelf: 'center'
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
        const {type, id, isEditMode} = this.props;
        // isEditMode = true; //for debugging
        return (
            <Fade timeout={300} in={this.state.shouldFade}>
                <Card /*className="card-accent-warning"*/>
                    <CardHeader>
                        <section style={styling.cardHeader}>
                            <section style={styling.toolbars}>
                                {/*Quill has to render but is hidden if not Quill, bc QUILL is hacky and searches for a toolbar ID*/}
                                {ToolbarQuill(id, type === globals.EDIT_QUILL && isEditMode)}
                            </section>

                            <section style={styling.cardActions}>
                                <div hidden={!isEditMode} className="card-header-actions">
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
                        </section>

                    </CardHeader>
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
