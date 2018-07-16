import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import GamesIcon from '@material-ui/icons/Games';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DeleteIcon from '@material-ui/icons/Delete';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import SlideThumb from './SlideThumb'
import Tooltip from '@material-ui/core/Tooltip';


import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import glb from "./globals";

let domStyles = {
    selected: {
      backgroundColor: '#ddeedd',
    },
    thumb: {
      marginLeft: '10px',
      marginRight: '10px',
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
    this.didSelectAddSystemSim = this.didSelectAddSystemSim.bind(this);
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

  didSelectAddSystemSim(){
    this.onClosePopup();
    this.props.onAddNewSystemSim();
  }

  didSelectAddNewQuiz() {
    this.onClosePopup();
    this.props.onAddNewQuiz();
  }

  didSelectAddNewGame() {
    this.onClosePopup();
    this.props.onAddNewGame();
  }

  didSelectAddHyperVideo() {
    this.onClosePopup();
    this.props.onAddNewHyperVideo();
  }

  didSelectAddSystemSim() {
      this.onClosePopup();
      this.props.onAddNewSystemSim();
  }

  onRemoveSlide(index) {
    this.props.onRemoveSlide(index);
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
            <ListItem button onClick={this.didSelectAddHyperVideo.bind(this)}>
              <Avatar>
                <VideoLibraryIcon />
              </Avatar>
              <ListItemText primary="New Hypervideo" />
            </ListItem>
            <ListItem button onClick={this.didSelectAddSystemSim.bind(this)}>
                <Avatar>
                    <VideoLibraryIcon />
                </Avatar>
                <ListItemText primary="New System Simulation" />
            </ListItem>
        </List>

      </Popover>

          <List component="nav">
          <Tooltip enterDelay={500} id="tooltip-bottom" title="Add a new slide to your project. This can be text, images, games, videos,…" placement="bottom">
            <ListItem button onClick={this.onAddNewSlide.bind(this)}>
              <AddIcon />
              <ListItemText primary="Add new Slide"/>
            </ListItem>
          </Tooltip>
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
