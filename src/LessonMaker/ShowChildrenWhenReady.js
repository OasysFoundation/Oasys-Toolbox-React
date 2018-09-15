import React from 'react';
import { PacmanLoader } from 'react-spinners';

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
        this.setState({ isReady: isReady });
    }

	render(){
		return(
			<React.Fragment>
				<div style={this.state.isReady?{display:'none'}:{display:'inline'}} > 
					<PacmanLoader color={colors.BLUESTEEL} />
				</div>
				<div style={this.state.isReady?{display:'inline'}:{display:'none'}} >
					{React.cloneElement(this.props.children, { handleReady: this.handleReady })}
				</div>
			</React.Fragment>
		)
	}
}

export default ShowChildrenWhenReady;