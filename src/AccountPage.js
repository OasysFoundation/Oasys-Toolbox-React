import React, {Component} from 'react';
import HorizontalScroll from './ExploreContent/HorizontalScroll'
import api from './utils/api'
import ScrollableAnchor from 'react-scrollable-anchor'
import * as auth from './Authentication/auth';
import history from './history'

import {connect} from "redux-zero/react";

import {Button} from 'reactstrap';
import colors from './utils/colors';

import { isMobile } from './utils/tools'

const styles = {
    HorizontalScrollOuterCenterContainer: {
        display: "flex",
        justifyContent: "center",
    },
    HorizontalScrollContainer: {
        width: "100%",
        maxWidth: "900px",
    },
    HorizontalScrollTitle:{
        fontSize:"1.5rem",
        fontFamily: "Charter-Bold,-apple-system, sans-serif",
    },
    HRDividingLine:{
        marginTop: "0",
        borderColor: colors.GULLGREY,
        width:"100%",
        marginRight:"100%",
    },
}

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentUser: [],
            filteredContent: [{
                title: "Loading"
            }],
            pageDataReccommended: [],
            pageDataUser: [],
            noContent:true,
            doneLoading:false,
        };
        this.loadAccountPage = this.loadAccountPage.bind(this);
    }

    componentDidMount(){
   
           // Recommendations for user
           try {
               api.getContentsPreview()
                   .then(json => {
                       if (json && json.length) {
                           this.setState({
                               pageDataReccommended: [
                                   {
                                       title: "Recommended for You",
                                       data: json,
                                   },
                               ]
                           })
                       }
                       else
                           console.log("Mhh there is something strange going on. Email us at info@joinoasys.org if this continues!")
                   })
           }
           catch (error) {
               console.log("Mhh there is something strange going on. Email us at info@joinoasys.org if this continues!")
               console.log(error)
           }
    }

    createHorizontalScrollersRec(value){
        if(value === "mobile")
            return(
                <div>
                    {this.state.pageDataReccommended.map(dataObj =>
                        <HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data} type = "mobile" / >
                        )
                    }
                </div>
            )
        else
            return(
                <div>
                    {this.state.pageDataReccommended.map(dataObj =>
                            <HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data} />
                            )
                    }
                </div>
            )
    }

    createHorizontalScrollersUser(value){
        if(value === "mobile")
            return(
                <div>
                    {this.state.pageDataUser.map(dataObj =>
                        <HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data} type = "mobile" />
                        )
                    }
                </div>
            )
        else
            return(
                <div>
                    {this.state.pageDataUser.map(dataObj =>
                            <HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data} />
                            )
                    }
                </div>
            )
    }
                

    loadReccommended(){
        return(
            <div className = "landingPage" >
                <section style = {styles.HorizontalScrollOuterCenterContainer}>
                    <div style = {styles.HorizontalScrollContainer}>
                        <br/>
                        <ScrollableAnchor id = {'searchResults'} >
                            <div>
                            {isMobile()
                                ? this.createHorizontalScrollersRec("mobile")
                                : this.createHorizontalScrollersRec("pc")
                            }
                            </div>
                        </ScrollableAnchor>
                    </div>
                </section>
            </div>            
        )
    }

    loadAccountPage() {
        return(
            <div>
                <section style={styles.HorizontalScrollOuterCenterContainer}>
                    <div style={styles.HorizontalScrollContainer}>
                        <br/>
                        <ScrollableAnchor id={'searchResults'}>
                            <div>
                                {isMobile()
                                    ? this.createHorizontalScrollersUser("mobile")
                                    : this.createHorizontalScrollersUser("pc")
                                }
                            </div>
                        </ScrollableAnchor>
                    </div>
                </section>
            </div>
        )
    }

    hasLoaded(value) {
        const paddingVal = (value==="mobile" ? "120px" : "70px")
        return(
            <div>
                <section className="bg-light rz-start rz-no-border-special-2" id="about" style={{paddingTop: paddingVal}}>
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-10 mx-auto">
                        <div style={styles.HorizontalScrollTitle}>
                        {"Welcome " + this.props.user.displayName + "!"}
                        <Button 
                          style={{float:"right", backgroundColor: colors.GHOST, fontFamily: 'JafBernino-Regular'}} 
                          onClick={() => auth.doSignOut()}
                        >
                          Logout
                        </Button>
                        <hr style={styles.HRDividingLine}/>
                        </div>
                        <p className="text-faded lead mb-4" style={{fontSize: '1.3rem'}}>                                 
                          We are excited to have you in the Oasys Community! Feel free to learn more <a href="/about">about Oasys</a> and how you could <a href="/">earn money</a> for the content you create.
                        </p>
                      </div>
                    </div>
                  </div>
                  {this.loadReccommended()}
                  { this.state.noContent
                     ? null
                     : this.loadAccountPage()
                  }
                  <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                         <Button size="lg" style={{margin: '1rem'}} color="primary" onClick={() => window.location.href="/create"}> Create Content</Button>
                        <Button size="lg" style={{margin: '1rem'}} color="primary" onClick={() => window.location.href="/explore"}> Home </Button>
                  </div>
                </section>
            </div>
        )
    }

    loadUserData() {
       try {
               api.getUserContentsPreview()
                   .then(json => {
                       this.setState({
                           contentUser: json || "errorLoadingContent"
                       })
                       if(json && json.length)
                           this.setState({
                               pageDataUser: [
                                   {
                                       title: "My Publications",
                                       data: this.state.contentUser.filter(content => content.published === 1),
                                   },
                                   {
                                       title: "My Drafts",
                                       data: this.state.contentUser.filter(content => content.published !== 1),
                                   },
                               ],
                               noContent:false,
                           })
                       else{
                           this.setState({noContent:true})
                       }
                       this.setState({doneLoading:true})
                   })
                   .catch(err => {
                       console.log(err)
                   })
           }
           catch (e){
               console.log(e)
           }
    }

    render() {
        // eslint-disable-next-line no-unused-expressions
        this.props.user.status===0
            ? null
            : this.props.user.status===1
                ? history.push('/auth') 
                : this.state.doneLoading
                    ? null
                    : this.loadUserData()
        return (
           <div>
                {this.props.user.status!==0
                    ? isMobile()
                        ? this.hasLoaded("mobile")
                        : this.hasLoaded("pc")
                    : null
                }
           </div>
        )
    }
}

const mapStoreToProps = ({user}) => ({user});
const neededActions = {};

export default connect(mapStoreToProps, neededActions)(AccountPage);