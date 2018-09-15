import React, {Component} from 'react';

import FadeableCard from '../FadeableCard';

class EditCard extends Component {

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