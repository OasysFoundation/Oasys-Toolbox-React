import React, {Component} from 'react';

import {
    Card,
    CardBody,
    Button
} from 'reactstrap';

import FadeableCard from '../FadeableCard'
import globals from '../../utils/globals';

class EditCard extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.isEditMode);
        console.log(this.props.isLoading)
    }

    render(){
        return(
           <FadeableCard
                id={this.props.data.id}
                type={this.props.data.type}
                isEditMode={this.props.isEditMode}
            >
                {this.props.children}
            </FadeableCard>
        )
    }
}


export default EditCard;