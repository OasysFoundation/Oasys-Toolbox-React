import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';


class OpenContentDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contents: [],
			didLoadContent: false
		}

		this.didSelectContent.bind(this);

	    const loadContent = 'https://api.joinoasys.org/GetUserContentsPreview';
        const that = this;

        fetch(loadContent, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            that.setState({
            	contents: myJson,
            	didLoadContent: true
            });

        });

	}

	handleClose() {
		this.props.onClose(null);
	};

	didSelectContent(selectedContent) {
		this.props.onClose(selectedContent);
	}

	render() {
		let renderList = (
			<ListItem>
		         <ListItemText primary="No Contents Found" />
		    </ListItem>
			)
		if (this.state.contents.length > 0) {
			 renderList = this.state.contents.map(content => (
	              <ListItem button onClick={() => {this.didSelectContent(content)}} key={content.contentId}>
	              	<Avatar alt="Remy Sharp" src={content.picture} />
	                <ListItemText primary={content.title} secondary={"Created by " + content.userId}/>
	              </ListItem>
		     ))
		}

		if (!this.state.didLoadContent) {
			renderList = <CircularProgress style={{ color: 'orange' }} thickness={7} />
		}

		return (
			<Dialog onClose={this.handleClose} open={this.props.open}>
		        <DialogTitle id="simple-dialog-title">Open Existing Content</DialogTitle>
		        <div>
		          <List>
		            {renderList}
		          </List>
		        </div>
		         <DialogActions>
		            <Button onClick={this.handleClose.bind(this)} color="primary">
		              Cancel
		            </Button>
		        </DialogActions>
		      </Dialog>
			)
	}
}

export default OpenContentDialog;