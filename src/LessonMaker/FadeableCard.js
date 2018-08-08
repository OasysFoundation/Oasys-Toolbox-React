import React, {Component} from 'react';
import PropTypes from 'prop-types';
import globals from '../globals'

import {
    Card,
    CardBody,
    CardHeader,
    Collapse,
    Fade
} from 'reactstrap';


// console.log(globals.ICON_FONTSIZE_MIDDLE, 'fontsize')
const ICON = function(className, fontSize=globals.ICON_FONTSIZE_MIDDLE) {
    return <i style={{fontSize:fontSize}} className={className}> </i>;
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
        return (
            <Fade timeout={300} in={this.state.shouldFade}>
                <Card className="card-accent-warning">
                    <CardHeader style={{padding: '0.25rem 0.25rem'}}>
                        <div className="card-header-actions">

                            <a href="#" className="card-header-action btn btn-setting"
                               onClick={this.props.moveUp}
                            >
                                {ICON("icon-arrow-up-circle")}
                            </a>

                            <a href="#" className="card-header-action btn btn-setting"
                               onClick={this.props.moveDown}>
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
                                    this.props.deleteMe() //id is alrea
                                }}>
                                {ICON("icon-close")}
                            </a>
                        </div>
                    </CardHeader>
                    <Collapse isOpen={this.state.isOpen} id="collapseExample">
                        <CardBody>
                            {/*  !! This passes the Content in between here !! */}
                            {this.props.children}

                        </CardBody>
                    </Collapse>
                </Card>
            </Fade>

        );
    }
}

FadeableCard.propTypes = {};

export default FadeableCard;
