import React, {Component} from 'react';
import PropTypes from 'prop-types';


import {
    Card,
    CardBody,
    CardHeader,
    Collapse,
    Fade
} from 'reactstrap';

class FadeableCard extends Component {
    state= {
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
                    <CardHeader>
                        Card actions
                        <div className="card-header-actions">
                            <a href="#" className="card-header-action btn btn-setting"><i className="icon-settings"></i></a>
                            <a
                                className="card-header-action btn btn-minimize"
                                data-target="#collapseExample"
                                onClick={() =>this.toggle('isOpen')}>
                                <i className="icon-arrow-up"></i>
                            </a>
                            <a
                                className="card-header-action btn btn-close"
                                onClick={() => this.toggle('shouldFade')}>
                                <i className="icon-close"></i>
                            </a>
                        </div>
                    </CardHeader>
                    <Collapse isOpen={this.state.isOpen} id="collapseExample">
                        <CardBody>
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
