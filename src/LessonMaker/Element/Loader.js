import React from 'react';
import { PacmanLoader } from 'react-spinners';

import colors from '../../utils/colors';

class Loader extends React.Component {
	render(){
		return(
			<div style={this.props.isReady?{display:'none'}:{display:'inline'}} > 
				<PacmanLoader color={colors.BLUESTEEL} />
			</div>
		)
	}
}

export default Loader;