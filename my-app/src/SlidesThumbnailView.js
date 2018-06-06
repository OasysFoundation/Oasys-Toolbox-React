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
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  selected: {
    backgroundColor: 'red',
  }
});

let domStyles = {
    selected: {
      backgroundColor: '#ddeedd',
    }
}

function iconForSlideType(type) {
    if (type == "quiz") {
      return <QuestionAnswerIcon />
    } else {
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
        {iconForSlideType(this.props.value.type)}
        <ListItemText primary={this.props.value.name} />
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
    this.onRemoveSlide = this.onRemoveSlide.bind(this);
  }

  didSelectMenuItem(index) {
    console.log("selecting slide");
    this.props.onChangedSlide(index);
  }

  didSelectAddNewSlide() {
    this.props.onAddNewSlide();
  }

  didSelectAddNewQuiz() {
    this.props.onAddNewQuiz();
  }

  onRemoveSlide(index) {
    console.log("removing slide");
    let slides = this.props.slides;
    slides.splice(index, 1);
    this.props.onSlideOrderChange(slides);
  }

  // rearrange slides
  onSortEnd = (props) => {
    const slides = arrayMove(this.props.slides, props.oldIndex, props.newIndex);
    // report change to Editor component
    this.props.onSlideOrderChange(slides);
  };

  render() {
    return (
      <div onClick={this.props.onClick}> 
        <section> 
          <List component="nav">
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
            <Divider />
            <SortableSlideList items={this.props.slides} 
                              onSortEnd={this.onSortEnd} 
                              useDragHandle={true} 
                              didSelectMenuItem={this.didSelectMenuItem} 
                              selectedSlideIndex={this.props.selectedSlideIndex}
                              onRemoveSlide={this.onRemoveSlide}/>
            {/*           
            {this.props.slides.map((element, index) => 
              <ListItem button onClick={this.didSelectMenuItem.bind(this, index)}
                               style={(index===this.props.selectedSlideIndex) ? domStyles.selected : null}>

                {iconForSlideType(element.type)}
                <ListItemText primary={element.name} />
              </ListItem>
              )
            }
            */}
          </List>
       </section>
      </div>
    );
  }
}


export default SlidesThumbnailView;
