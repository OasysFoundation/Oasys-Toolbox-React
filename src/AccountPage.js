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
    paddingForHeaderSection:{
        padding:"10px",
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
        };
        this.loadAccountPage = this.loadAccountPage.bind(this);
        this.getData = this.getData.bind(this);

        if (this.props.user.uid) {
            this.getData(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.user.uid) {
            return;
        }
        this.getData(nextProps);
    }

    getData(nextProps) {
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
                   })
                   .catch(err => {
                       console.log(err)
                   })
           }
           catch (e){
               console.log(e)
           }
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
                <section id="about" style={{paddingTop: paddingVal}}>
                    <div className="row" style={styles.HorizontalScrollOuterCenterContainer}>
                      <div style={styles.HorizontalScrollContainer}>
                      <div style={styles.paddingForHeaderSection}>
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
                          We are excited to have you in the Oasys Community! Feel free to learn more <a href="/about">about Oasys</a>.
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
                         <Button size="lg" style={{margin: '1rem'}} color="primary" onClick={() =>history.push("/create")}> Create Content</Button>
                        <Button size="lg" style={{margin: '1rem'}} color="primary" onClick={() => history.push("/explore")}> Home </Button>
                  </div>
                </section>
            </div>
        )
    }

    render() {
        return (
           <div>
                {isMobile()
                        ? this.hasLoaded("mobile")
                        : this.hasLoaded("pc")
                }
           </div>
        )
    }
}

const mapStoreToProps = ({user}) => ({user});
const neededActions = {};

export default connect(mapStoreToProps, neededActions)(AccountPage);