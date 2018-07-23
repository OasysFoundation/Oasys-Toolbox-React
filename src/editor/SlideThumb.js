import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

let domStyles = {
    selected: {
      backgroundColor: '#ddeedd',
    },
    thumb: {
      marginLeft: '10px',
      marginRight: '10px',
      'max-width': '80px',
      'max-height': '60px'
    }
}

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

        {/*<ListItemText primary={this.props.value.name} />*/}
        <div>
        <img src={this.props.value.thumb} style={domStyles.thumb} alt=""/>
        </div>
        <IconButton onClick={this.onSelfDestruct}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    )
  }
}

export default SlideThumb;