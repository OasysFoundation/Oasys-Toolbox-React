import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './ReactQuill.css';

class QuillEditor extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.props.onChange.bind(this);
  }

	render() {
		return (<div>
          <Card style={{height: '70vh', 'max-width': '600px'}}>
            <CardContent>
              <ReactQuill value={this.props.slideContent}
                        onChange={this.onChange}
                        style={{height: '60vh'}}
                          /> 
            </CardContent>
          </Card>
        </div>)
	}
}


export default QuillEditor;