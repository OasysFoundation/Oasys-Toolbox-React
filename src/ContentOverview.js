import React, {Component} from 'react';
//import PropTypes from 'prop-types';
import {Container} from 'reactstrap';
import {Button, Card, CardBody, CardTitle, CardSubtitle} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import api from './utils/api';
import colors from './utils/colors';

import {connect} from "redux-zero/react";
import actions from "./store/actions";

import history from './history'
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import SocialSharingButtons from './SocialSharingButtons'
import { isMobile } from './utils/tools'



const styles = {
    cardStyle: {
        width: '100%',
        backgroundColor: colors.SNOW2,
        borderColor: "#F6F1DE",
        color: "#F6F1DE",
        margin: ".3em 5px"
    },
    boxShadow: {
        boxShadow: "1px 1px 5px #888888",
    },
    homeCardBody: {
        color: colors.RUST,
        width: "100%",
        padding: "1.0rem",

    },
    cardTitle: {
        textDecoration: "none",
        fontSize: "1.3rem",
        fontWeight: 'bold',
        width: '100%',
    },
    cardTitleLink: {
        textDecoration: "none",
        color: "#C6361D",
        fontWeight: "bold",
        whiteSpace: "initial",
        cursor: 'pointer',
    },
    cardSubtitle: {
        fontSize: '0.9rem',
        width: '100%',
    },
    verticalEllipsesOuterDiv: {
        flex: "1",
        height: "100%",
        cursor: 'pointer',
    },
    ellipsisIcon: {
        flex: "1",
        float: "right",
        color: colors.RUST,
    },
    cardImageOuterLink: {
        textDecoration: "none",
    },
    cardImageSection: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    cardImageDiv: {
        minWidth: 0,
        marginBottom: "5px",
        textDecoration: "none",
        color: "#2a9699"
    },
    cardImage: {
        width: "auto%",
        maxWidth: "100%",
        maxHeight: "85px",
    },
    cardRatingsOuterDiv: {
        display: "flex",
        justifyContent: "center",
        marginTop: '3px',
    },
    rating: {
        color: colors.SUMMERSUN,
        textShadow: '0px 0px 1px ' + colors.RUST,
    },
    ratingCount: {
        color: colors.RUST,
        marginLeft: '0px',
        fontSize: '12px',
    },
};

class ContentOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lesson: null,
            showSnackbar:false,
            snackbarMessage:"",
        };

    }

    componentDidMount() {
        const {uid, contentId} = this.props.match.params;
        api.getContent(uid, contentId)
            .then(results => {
                const project = results[0];
                this.setState({lesson: project});
            })
            .catch(err => console.log(err))
    }

    handleClick(value) {
        if (value === "remix") {
            this.props.remixProject(this.state.lesson, this.props.user);
            history.push(`/create/${this.props.user.displayName || "anonymous"}/${this.props.match.params.title}/${this.props.match.params.uid}/${this.props.match.params.contentId}/`)
        }
        // window.location.href  = `/create/${this.state.currentUsername}/${this.state.currentTitle}`
        // else if (value === "comments")
        //     window.location.href = `/comments/${this.state.currentUsername}/${this.state.currentTitle}`
        // else if (value === "content")
        //     window.location.href = `/content/`
        else if (value === "user") {            
          history.push(`/user/${this.props.match.params.username || "anonymous"}/${this.props.match.params.uid}`) 
        }        
          else if (value === "flag"){
              this.setState({
                showSnackbar:true,
                snackbarMessage:"Thank you for notifying us about this content."
              }) 
          }
    }

    handleStartContent() {
        const {title, username, uid, contentId} = this.state.lesson;

        this.props.remixProject(this.state.lesson, this.props.user);

        window.location.href = `/view/${username}/${title}/${uid}/${contentId}/0`;
    }

    onCloseSnackBar() {
        this.setState({
            snackbarMessage: "",
            showSnackbar:false,
        });
    }

    renderOverview() {
        const lesson = this.state.lesson;
        return (
            <Card style={{...styles.cardStyle, ...styles.boxShadow}}>
                <CardBody style={styles.homeCardBody}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <CardTitle style={styles.cardTitle}>
                                {lesson.title}
                            </CardTitle>
                            <CardSubtitle style={styles.cardSubtitle}>
                                by {lesson.username}
                            </CardSubtitle>
                        </div>
                        <div>
                            {lesson.iconName ?
                                <img src={require('./assets/category-icons/' + lesson.iconName)} width='70px'
                                     height='70px' alt=''/>
                                :
                                <img src={require('./assets/category-icons/005-atom.svg')} width='70px' height='70px'
                                     alt=''/>
                            }
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{width: '50%'}}>
                            <p style={{marginTop: '20px'}}>
                                {lesson.description}
                            </p>
                            <p>
                                Average rating: {lesson.rating.mean} <br/>
                                Number of ratings: {lesson.rating.count}
                            </p>
                            <p>
                                {lesson.tags.map(tag => <span className='tag'>{tag}</span>)}
                            </p>


                            <Button onClick={()=>this.handleStartContent()} className='start-button'>
                                Start learning
                            </Button>
                        </div>
                        <div style={{marginTop: '30px'}}>
                            <Button block color="light" onClick={()=>this.handleClick("remix")}
                                    className='action-button'>
                                <FontAwesomeIcon icon="pencil-alt"/>
                                Remix
                            </Button>
                            <Button block color="light" onClick={()=>this.handleClick("user")}
                                    className='action-button'>
                                <FontAwesomeIcon icon="comment"/>
                                {"Go To " + lesson.username + "'s Page"}
                            </Button>
                            <Button block color="light" onClick={()=>this.handleClick("flag")}
                                    className='action-button'>
                                <FontAwesomeIcon icon="flag"/>
                                Flag as Inappropriate
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }

    removeLastComponentOfUrl(url) {
        const array = url.split("/");
        array.pop();
        return array.join("/");
    }

    render() {
        const paddingVal = (isMobile()===true ? "80px" : "30px")
        const {username, title} = this.props.match.params;
        var url = this.removeLastComponentOfUrl(window.location.href);
        return (
            <div className='app-body'>
                <main className='main' style={{marginLeft: '0px', padding:paddingVal}}>
                    <Container fluid className='main-width'>
                        {this.state.lesson !== null
                            ? <div className='content-overview'>
                                {this.renderOverview()}
                            </div>
                            : <div>...Loading Content</div>
                        }
                      <SocialSharingButtons url={url} author={username} title={title} description={this.state.lesson!==null ? this.state.lesson.description : "Loading.."} />

                    </Container>
                </main>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.showSnackbar}
                    autoHideDuration={6000}
                    onClose={()=>this.onCloseSnackBar()}
                >
                    <SnackbarContent
                        aria-describedby="client-snackbar"
                        message={
                            <span id="client-snackbar">
                          {this.state.snackbarMessage}
                        </span>
                        }
                    />
                </Snackbar>
            </div>
        );
    }
}

const mapStoreToProps = ({user}) => ({user})
const neededActions = (store) => {
    const {remixProject} = actions();
    return {remixProject}
};

export default connect(mapStoreToProps, neededActions)(ContentOverview);