import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

import SlideThumb from './SlideThumb';
import Tooltip from '@material-ui/core/Tooltip';

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
    this.onRemoveSlide = this.onRemoveSlide.bind(this);
  }

  didSelectMenuItem(index) {
    this.props.onChangedSlide(index);
  }

  onAddNewSlide(event) {
    this.props.onAddNewSlide();
  }

  onClosePopup() {
    this.setState({
      anchorEl: null,
    });
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
          <List component="nav" style={{width:'250px'}}>
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
                              distance={1}
                              didSelectMenuItem={this.didSelectMenuItem.bind(this)} 
                              selectedSlideIndex={this.props.selectedSlideIndex}
                              onRemoveSlide={this.onRemoveSlide}/>
          </List>
       </section>
      </div>
    );
  }
}


export default SlidesThumbnailView;
