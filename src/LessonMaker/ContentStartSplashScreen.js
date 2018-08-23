import React, {Component} from 'react';
import api from '../utils/api'

class ContentStartSplashScreen extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.match.params.contentId, "contentId");
        // let project;
        // api.getContentById(this.props.match.params.contentId)
        //     .then(content => {
        //         this.setState(content)
        //     })
        //     .catch(err => console.log('error at getcontentbyid', err))
    }

    render(){

    }
}


