import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Rating from './Rating';

import {
    Link,
    withRouter,
} from 'react-router-dom';


class Remix extends Component {
    constructor(props) {
        super(props);

    }

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
