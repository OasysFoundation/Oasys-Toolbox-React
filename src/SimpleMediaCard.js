import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Rating from './Rating';
import ButtonBase from '@material-ui/core/ButtonBase';
import Remix from './Remix';

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
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    cardAction: {
        display: 'block',
        textAlign: 'initial'
    }
};

function SimpleMediaCard(props) {
    const { classes } = props;
    const {picture, title, description, userId, tags, rating, contentId} = props.contentData;
    var userUrl = '';
    if (userId) {
        userUrl = '/user/'+userId;
    }
    var contentUrl = '';
    if (contentId && userUrl) {
        contentUrl = userUrl+'/'+contentId;
    }
    return (
        <div>
            <Card className={classes.card}>
                  <ButtonBase
                      className={classes.cardAction}
                      onClick={function(event) {event.preventDefault(); window.location.href = contentUrl || "nope"; }}
                  >
                <CardMedia
                    className={classes.media}
                    image={picture}
                    title={title}
                />
                <CardContent>
                 <CardActions>
                    <Typography gutterBottom variant="headline" component="h2">
                        {title  || "Nothing here"}
                    </Typography>
                    <Remix url={contentUrl}/>
                   
                 </CardActions>
                    <Typography component="p">
                        {description || "Test"}
                    </Typography>
                </CardContent>
                {<Rating value={rating} preview={true}/>}
                </ButtonBase>
                <CardActions>
                    <Button
                        variant="contained"
                        size="small" color="primary"
                        onClick={function(event) {event.preventDefault(); window.location.href = {contentUrl} || "nope"; }}>
                        Explore
                    </Button>
                    <Button
                        variant="contained"
                        size="small" color="primary"
                        onClick={function(event) {event.preventDefault(); window.location.href = {userUrl} || "nope"; }}>
                        Made by {userId}
                    </Button>
                    {/*{tags ? tags.map((t,i) => <div key={i}> {t + " | "}</div>) : ""}*/}
                    { (<div> {Array.isArray(tags) ? tags.join() : tags}</div>)}
                </CardActions>
                
            </Card>
        </div>
    );
}

SimpleMediaCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleMediaCard);