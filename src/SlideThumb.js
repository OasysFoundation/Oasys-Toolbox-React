import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {
  SortableHandle,
} from 'react-sortable-hoc';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

let domStyles = {
    selected: {
      backgroundColor: '#ddeedd',
    },
    thumb: {
      marginLeft: '10px',
      marginRight: '10px',
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
        <img src={this.props.value.thumb} width={80} height={60} style={domStyles.thumb} alt=""/>

        <IconButton onClick={this.onSelfDestruct} right>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    )
  }
}

export default SlideThumb;