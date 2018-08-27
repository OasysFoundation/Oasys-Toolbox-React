import React, {Component} from 'react';
import HorizontalScroll from './ExploreContent/HorizontalScroll'
import api from './utils/api'
import {getTagsForCategory} from "./utils/LandingPage";
import ScrollableAnchor from 'react-scrollable-anchor'
//import * as auth from './Authentication/auth';
//import history from './history'

import {connect} from "redux-zero/react";

//import {Button} from 'reactstrap';
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
            filteredContent: [{
                title: "Loading"
            }],
            pageData: [],
            noContent:true,
        };

        this.loadAccountPage = this.loadAccountPage.bind(this);


    }

    componentDidMount() {
        //User Contents
        const {uid} = this.props.match.params;

        try {
             api.getUsersPublicContentsPreview(uid)
                .then(json => {
                    if (json && json.length) {
                        this.setState({
                                content: json || "errorLoadingContent"
                            },
                            () => this.setState({
                                    filteredContent: json,
                                },
                                () => this.setState({
                                     pageData: [
                                        {
                                            title: "Physics",
                                            data: this.state.filteredContent.filter(this.correctCategory("Physics")),
                                        },
                                        {
                                            title: "Chemistry",
                                            data: this.state.filteredContent.filter(this.correctCategory("Chemistry")),
                                        },
                                        {
                                            title: "Computer Science Fundamentals",
                                            data: this.state.filteredContent.filter(this.correctCategory("Computer Science Fundamentals")),
                                        },
                                        {
                                            title: "Mathematics",
                                            data: this.state.filteredContent.filter(this.correctCategory("Mathematics")),
                                        },
                                        {
                                            title: "Machine Learning",
                                            data: this.state.filteredContent.filter(this.correctCategory("Machine Learning")),
                                        },
                                        {
                                            title: "iOS",
                                            data: this.state.filteredContent.filter(this.correctCategory("iOS")),
                                        },
                                        {
                                            title: "Blockchain",
                                            data: this.state.filteredContent.filter(this.correctCategory("Blockchain")),
                                        },
                                        {
                                            title: "Smart Contracts",
                                            data: this.state.filteredContent.filter(this.correctCategory("Smart Contracts")),
                                        },
                                        {
                                            title: "Web Dev",
                                            data: this.state.filteredContent.filter(this.correctCategory("Web Dev")),
                                        },
                                    ],
                                    noContent:false,
                                }))
                        )
                    }
                    else
                        console.log("Mhh there is something strange going on. Email us at info@joinoasys.org if this continues!")
                })
        }
        catch (e){
            console.log(e)
        }
    }

    //function in function to pass extra argument to filter function
    correctCategory(category) {
        function stringHasSubstring(str, substr) {
            if (!str || !substr)
                return
            let returnVar = false;
            for(let i = 0; i < str.length; i++){
                if(str[i].toLowerCase().includes(substr.toLowerCase()))
                    returnVar = true;
            }
            return returnVar 
        }

        return function (element) {
            const keywords = getTagsForCategory(category);
            return keywords.filter(kw => stringHasSubstring(element.tags, kw)).length ? element : null
        }

    }

    createHorizontalScrollers(value){
        if(value === "mobile")
            return(
                <div>
                    {this.state.pageData.map(dataObj =>
                        < HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data} type = "mobile" / >
                        )
                    }
                </div>
            )
        else
            return(
                <div>
                    {this.state.pageData.map(dataObj =>
                            < HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data}/ >
                            )
                    }
                </div>
            )
    }

    loadAccountPage(){
        return(
            <div>
                <section style={styles.HorizontalScrollOuterCenterContainer}>
                    <div style={styles.HorizontalScrollContainer}>
                        <br/>
                        <ScrollableAnchor id={'searchResults'}>
                            <div>
                                {isMobile()
                                    ? this.createHorizontalScrollers("mobile")
                                    : this.createHorizontalScrollers("pc")
                                }
                            </div>
                        </ScrollableAnchor>
                    </div>
                </section>
            </div>
        )
    }

    render() {
        const {username} = this.props.match.params
        const paddingVal = (isMobile() ? "120px" : "70px")

        return (
            <div>
                <section className="bg-light rz-start rz-no-border-special-2" id="about" style={{paddingTop:paddingVal}}>
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-10 mx-auto">
                        <div style={styles.HorizontalScrollTitle}>
                        {username + "'s Content"}
                        <hr style={styles.HRDividingLine}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  { this.state.noContent
                     ? null
                     : this.loadAccountPage()
                  }
                </section>
            </div>
        )
    }
}

const mapStoreToProps = ({user}) => ({user});
const neededActions = {};

export default connect(mapStoreToProps, neededActions)(AccountPage);