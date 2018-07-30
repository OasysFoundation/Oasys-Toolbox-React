import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RemixIcon from '@material-ui/icons/MergeType';
import CommentIcon from '@material-ui/icons/ModeComment';
import Chip from '@material-ui/core/Chip';
import Media from "react-media";
import {Wrap} from './utils'
import api from './tools'

const styles = {
    card: {
        maxWidth: 300,
        minWidth:300,
        marginTop: 1 + "rem",
        marginBottom: 1 + "rem",
        marginLeft: 0.5 + "rem",
        marginRight: 0.5 + "rem",
    },
    media: {
        maxWidth: 300,
        minWidth:300,
        width: 20 + "vw",
        paddingTop: '56.25%', // 16:9
    },
    cardAction: {
        display: 'block',
        textAlign: 'initial'
    }
};

const defaultPicture = "https://vignette.wikia.nocookie.net/the-demonic-paradise/images/a/aa/Illuminati_Symbol.jpg/revision/latest?cb=20150317032410"


class SimpleMediaCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      userProfileURL: null,
      disabledMessage: "Remix",
      isDisabled: false,
    }

    api.getProfileInfo(this.props.contentData.userId).then(res => res.json())
    .catch(error => {
      console.error('Error:', error);
    })
    .then(response => {
      response && response.length>0
        ? this.setState({userProfileURL: response[0].PIC})
        : null
    });
  }

  showCardOptions(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  closeCardOptions() {
    this.setState({
      anchorEl: null
    });
  }

  render() {

    var disabledMessage = this.state.disabledMessage;
    var isDisabled = this.state.isDisabled;


    if(this.props.onMobile)
      disabledMessage = "Remix requires Desktop or ipad" 

    if(this.props.onMobile)
      isDisabled = true; 

    const { classes } = this.props;
    var {picture, title, description, tags, rating, contentId, numRatings} = this.props.contentData;
    let {userId} = this.props.contentData;

    if (!numRatings) {
      numRatings = "No ";
    }

    userId= Wrap(userId)
    contentId=Wrap(contentId);
    title=Wrap(title)


    let pic = (picture) ? picture : defaultPicture;

    userId = userId === "undefined" ? "Anonymous" : userId;

    var userUrl = '';
    if (userId) {
        userUrl = '/user/'+userId;
    }
    var contentUrl = '';
    if (contentId && userUrl) {
        contentUrl = userUrl+'/'+contentId;
    }

    var hashtags = tags;
    if(!Array.isArray(tags)) {
        hashtags = tags.split(' ');
        hashtags = hashtags.map(function(element) {
          element = element.replace('#','');
          element = element.replace(',','');
          return element;
        });
    }
    
    var ratingString = ""
    while (ratingString.length < rating) {
        ratingString += "★";
    }

    while (ratingString.length < 5) {
        ratingString += "☆";
    }    

    const userURL = '/user/' + userId;
    const userLink = <div> Made by <a href={userURL}> {(userId.length < 13 ? userId : (userId.substring(0,13) + '…'))} </a> </div>;

    return (
        <div>
            <Card className={classes.card}>
                  <Popover 
                      anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    onClose={this.closeCardOptions.bind(this)}
                  >

                  <Media query="(max-width: 768px)">
                    {matches =>
                      matches ? (
                        
                        <List component="nav">
                        <ListItem disabled={true} button onClick={function(event) {window.location.replace(`/create/${userId}/${contentId}`)}}>
                          <ListItemIcon>
                            <RemixIcon />
                          </ListItemIcon>
                          <ListItemText inset primary="Remix requires Desktop or ipad" />
                        </ListItem>
                        <ListItem button onClick={function(event) {event.preventDefault(); window.location.href = ('/comments/'+userId+'/'+title) }}>
                          <ListItemIcon>
                            <CommentIcon />
                          </ListItemIcon>                    
                          <ListItemText inset primary="View Comments" />
                        </ListItem>
                      </List>

                      ) : (

                      <List component="nav">
                        <ListItem disabled={false} button onClick={function(event) {window.location.replace(`/create/${userId}/${contentId}`)}}>
                          <ListItemIcon>
                            <RemixIcon />
                          </ListItemIcon>
                          <ListItemText inset primary="Remix" />
                        </ListItem>
                        <ListItem button onClick={function(event) {event.preventDefault(); window.location.href = ('/comments/'+userId+'/'+title) }}>
                          <ListItemIcon>
                            <CommentIcon />
                          </ListItemIcon>                    
                          <ListItemText inset primary="View Comments" />
                        </ListItem>
                      </List>

                      )
                    }
                  </Media>

                  </Popover>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="Recipe" className={classes.avatar}>
                        {this.state.userProfileURL? (
                          <img src={this.state.userProfileURL} style={{width:'auto', height:'auto', 'max-height':'100%', 'max-width':'100%'}} alt=""/>  
                          )
                        :
                        (
                         userId.substring(0,2).toUpperCase()
                          )}
                      </Avatar>
                    }
                    action={
                      <IconButton onClick={this.showCardOptions.bind(this)}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={title}
                    subheader= {userLink}
                    style={{textAlign:'left'}}
                  />
                  <ButtonBase
                      className={classes.cardAction}
                      onClick={function(event) {event.preventDefault(); window.location.href = contentUrl || "nope"; }}
                  >
                  <center>
                  <div style={{marginLeft:'20px', marginBottom:'20px', textAlign:'left'}}>
                  {ratingString} 
                  {" " + numRatings} {numRatings==1? "Review" : "Reviews"}
                  </div>
                  </center>
                
                <CardMedia
                    className={classes.media}
                    image={pic}
                    title={title}
                />
                <CardContent>
                    <Typography component="p" style={{marginBottom:'15px'}}>
                        {description || "Test"}
                    </Typography>
                
                    <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                    {hashtags.map(function(element, idx){
                      return <Chip key={idx} label={element} style={{margin:'3px'}}/> 
                    })}
                    </div>
               </CardContent>
   
                </ButtonBase>
                
            </Card>
        </div>
    );
  }
}




SimpleMediaCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleMediaCard);