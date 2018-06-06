import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

function iconForSlideType(type) {
    if (type == "quiz") {
      return <QuestionAnswerIcon />
    } else {
      return <WallpaperIcon />
    }
}

class SlidesThumbnailView extends Component {

  constructor(props) {
    super(props);
    //Proptypes: data = react.array
    this.didSelectMenuItem = this.didSelectMenuItem.bind(this);
    this.didSelectAddNewSlide = this.didSelectAddNewSlide.bind(this);
    this.didSelectAddNewQuiz = this.didSelectAddNewQuiz.bind(this);
  }

  didSelectMenuItem(index) {
    this.props.onChangedSlide(index);
  }

  didSelectAddNewSlide() {
    this.props.onAddNewSlide();
  }

  didSelectAddNewQuiz() {
    this.props.onAddNewQuiz();
  }

  render() {
    
    return (
      <div onClick={this.props.onClick}> 
        <section> 
          <List component="nav">

          {this.props.slides.map((element, index) => 
            <ListItem button onClick={this.didSelectMenuItem.bind(this, index)}>
              {iconForSlideType(element.type)}
              <ListItemText primary={element.name} />
            </ListItem>
            )
          }
          <Divider />
          <ListItem button onClick={this.didSelectAddNewSlide.bind(this)}>
            <AddIcon />
            <ListItemText primary="New Slide"/>
          </ListItem>
          <ListItem button onClick={this.didSelectAddNewQuiz.bind(this)}>
            <AddIcon />
            <ListItemText primary="New Quiz" />
          </ListItem>
          {/* ListItem button>
            <CallSplitIcon />
            <ListItemText primary="New Split" />
          </ListItem> */}
          </List>
       </section>
      </div>
    );
  }
}


export default SlidesThumbnailView;
