import React from 'react';
import { PacmanLoader } from 'react-spinners';
import { Card } from 'reactstrap';

import colors from '../utils/colors';

/*
This component shows a loading icon until at least one of its children executes the handleReady prop.
*/

class ShowChildrenWhenReady extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
		}
		this.handleReady = this.handleReady.bind(this);
	}

    handleReady(isReady) {
        this.setState({ isReady });
    }

	render(){
		return(
			<React.Fragment>
				<div style={this.state.isReady?{display:'none'}:{display: 'inline'}} >
            		<Card className='card-fancy has-shadow card content-view' style={{opacity: '0.6'}}>
						<div style={{width: '100%', height: '80px'}}><center>
							<PacmanLoader color={colors.BLUESTEEL} />
						</center></div>
					</Card>
				</div>
				<div style={this.state.isReady?{display:'inline'}:{display: 'none'}} >
					{React.cloneElement(this.props.children, { handleReady: this.handleReady })}
				</div>
			</React.Fragment>
		)
	}
}

export default ShowChildrenWhenReady;