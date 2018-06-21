import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
//import CallSplitIcon from '@material-ui/icons/CallSplit';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import GamesIcon from '@material-ui/icons/Games';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DeleteIcon from '@material-ui/icons/Delete';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import glb from "./globals";

/*const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  selected: {
    backgroundColor: 'red',
  }
});*/

let domStyles = {
    selected: {
      backgroundColor: '#ddeedd',
    },
    thumb: {
      marginLeft: '10px',
      marginRight: '10px',
    }
}

function iconForSlideType(type) {
    if (type === glb.QUIZ) {
      return <QuestionAnswerIcon />
    } else if (type === glb.GAME) {
      return <GamesIcon />
    } else if (type === glb.QUILL) {
      return <WallpaperIcon />
    }
}

const DragHandle = SortableHandle(() => <DragHandleIcon />);

class SlideThumb extends Component {
  constructor(props) {
    super(props);
    this.onSelfDestruct = this.onSelfDestruct.bind(this);
  }

  onSelfDestruct(event){ 
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.props.onRemoveSlide(this.props.index); 
  }

  render(){
    return (
      <ListItem button onClick={this.props.didSelectMenuItem.bind(this, this.props.index)}
                       style={(this.props.index===this.props.selectedSlideIndex) ? domStyles.selected : null}>
        <DragHandle />

        {/*<ListItemText primary={this.props.value.name} />*/}
        <img src={this.props.value.thumb} width={80} height={60} style={domStyles.thumb}/>

        <DeleteIcon onClick={this.onSelfDestruct}  />
      </ListItem>
    )
  }
}

const SortableSlide = SortableElement(props => 
  <SlideThumb index={props.indexCopy} value={props.value}
              didSelectMenuItem={props.didSelectMenuItem.bind(this)} 
              onRemoveSlide={props.onRemoveSlide.bind(this)}
              selectedSlideIndex={props.selectedSlideIndex}/>
);

const SortableSlideList = SortableContainer(props =>
  <div> {props.items.map((value, index) => 
      <SortableSlide key={`item-${index}`} value={value} index={index} indexCopy={index} 
                     didSelectMenuItem={props.didSelectMenuItem.bind(this)}
                     onRemoveSlide={props.onRemoveSlide.bind(this)}
                     selectedSlideIndex={props.selectedSlideIndex}/>
  )} </div>  
);

class SlidesThumbnailView extends Component {

  constructor(props) {
    super(props);
    //Proptypes: data = react.array
    this.didSelectMenuItem = this.didSelectMenuItem.bind(this);
    this.didSelectAddNewSlide = this.didSelectAddNewSlide.bind(this);
    this.didSelectAddNewQuiz = this.didSelectAddNewQuiz.bind(this);
    this.didSelectAddNewGame = this.didSelectAddNewGame.bind(this);
    this.onRemoveSlide = this.onRemoveSlide.bind(this);

    this.state = {
            anchorEl: null,
    }
  }

  didSelectMenuItem(index) {
    this.props.onChangedSlide(index);
  }

  onAddNewSlide(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  onClosePopup() {
    this.setState({
      anchorEl: null,
    });
  }

  didSelectAddNewSlide() {
    this.onClosePopup();
    this.props.onAddNewSlide();
  }

  didSelectAddNewQuiz() {
    this.onClosePopup();
    this.props.onAddNewQuiz();
  }

  didSelectAddNewGame() {
    this.onClosePopup();
    this.props.onAddNewGame();
  }

  onRemoveSlide(index) {
    let slides = this.props.slides;
    slides.splice(index, 1);
    this.props.onSlideOrderChange(slides);
  }

  // rearrange slides
  onSortEnd = (props) => {
    const slides = arrayMove(this.props.slides, props.oldIndex, props.newIndex);
    // report change to Editor component
    this.props.onSlideOrderChange(slides, props.oldIndex, props.newIndex);
  };

  render() {
    return (
      <div onClick={this.props.onClick}> 
        <section> 
          <Popover
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.onClosePopup.bind(this)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          
        <List component="nav">
            <ListItem button onClick={this.didSelectAddNewSlide.bind(this)}>
              <Avatar>
                <WallpaperIcon />
              </Avatar>
              <ListItemText primary="New Slide"/>
            </ListItem>
            <ListItem button onClick={this.didSelectAddNewQuiz.bind(this)}>
              <Avatar>
                <QuestionAnswerIcon />
              </Avatar>
              <ListItemText primary="New Quiz" />
            </ListItem>
            <ListItem button onClick={this.didSelectAddNewGame.bind(this)}>
              <Avatar>
                <GamesIcon />
              </Avatar>
              <ListItemText primary="New Game" />
            </ListItem>
        </List>

      </Popover>

          <List component="nav">
            <ListItem button onClick={this.onAddNewSlide.bind(this)}>
              <AddIcon />
              <ListItemText primary="Add new Slide"/>
            </ListItem>
            {/* ListItem button>
              <CallSplitIcon />
              <ListItemText primary="New Split" />
            </ListItem> */}
            <Divider />
            <Divider />
            <SortableSlideList items={this.props.slides} 
                              onSortEnd={this.onSortEnd} 
                              useDragHandle={true} 
                              didSelectMenuItem={this.didSelectMenuItem} 
                              selectedSlideIndex={this.props.selectedSlideIndex}
                              onRemoveSlide={this.onRemoveSlide}/>
          </List>
       </section>
      </div>
    );
  }
}


export default SlidesThumbnailView;
