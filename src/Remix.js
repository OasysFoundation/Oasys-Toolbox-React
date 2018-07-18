import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import {withRouter} from 'react-router-dom';


class Remix extends Component {
    
    onSubmit = (url) => {
    	const {
	      history,
	    } = this.props;

	    console.log(url);

		history.push({
		  pathname: '/create',
		  state: { url }
		})


    }

    render(){
    	console.log(this.props.url);
      return(
       <Button
	        variant="contained"
	        size="small" color="primary"
	        onClick={this.onSubmit.bind(this,this.props.url)}>
	        Remix
	    </Button>
        )
    }
}

export default withRouter(Remix);
