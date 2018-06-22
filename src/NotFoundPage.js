import React from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components"
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';



function NotFoundPage() {
    return (
		<center>
	      <Paper style={{margin: 36, padding: 16, maxWidth: '400px', textAlign:'left'}} elevation={4}>
	        <Typography variant="headline" component="h3">
	          The page you’re looking for can’t be found.
	        </Typography>
	        <Typography component="p">
	          Please contact us at info@joinoasys.org if you think that this webpage should exist.
	        </Typography>
	      </Paper>
	    </center>
    )
}

export default NotFoundPage;