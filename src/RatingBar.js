import React, {Component} from 'react';
import { Button } from 'reactstrap';

class RatingBar extends Component {

	ratings = [
		"🤮",
		"🙁",
		"😐",
		"👍",
		"😍"
	]

    render() {
        const that = this;
        return (
            <div>
            	{this.ratings.map(function(ratingComponent,index) {
            		return <Button 
                            style={{borderRadius: '50%', width:'50px', height:'50px', fontSize:'26px', margin:'5px'}}
                            onClick={function() {that.props.onSelectRating(ratingComponent,index+1)} }
                            ><center>{ ratingComponent }</center></Button>	
            	})}
            </div>
        );
    }
}


export default RatingBar;
