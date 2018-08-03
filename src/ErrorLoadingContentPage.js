import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';



function ErrorLoadingContentPage() {
    return (
		<center>
	      <Paper style={{margin: 36, padding: 16, maxWidth: '400px', textAlign:'left'}} elevation={4}>
	        <Typography variant="headline" component="h3">
	          Oops! Something went wrong! 
	        </Typography>
	        <Typography component="p">
	          If this continues, please email us at info@joinoasys.org
	        </Typography>
	      </Paper>
	    </center>
    )
}

export default ErrorLoadingContentPage;