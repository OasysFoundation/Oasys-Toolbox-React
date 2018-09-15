import React, {Component} from 'react';

import {
    Card,
    CardBody,
    Button
} from 'reactstrap';

import VisibilitySensor from 'react-visibility-sensor';

class ViewCard extends Component {

    render(){
        return(
            <Card className='card-fancy has-shadow card content-view'>
                <CardBody>
                    {!this.props.isPreview && <VisibilitySensor ref={this.sensorRef} onChange={this.onChangeVisibility}/>}
                    
                    <div>
                    {this.props.shouldFoldInView
                        ? <Button color="primary"
                                  onClick={() => this.props.handleFoldInView(false)}>
                            Check again
                        </Button>

                        : this.props.children
                    }
                    </div>
                </CardBody>
            </Card>
        )
    }
}


export default ViewCard;