import React, {Component} from 'react';
import api from '../utils/api'
import {getTagsForCategory} from "../utils/LandingPage";
import ScrollableAnchor from 'react-scrollable-anchor'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import HorizontalScroll from './HorizontalScroll'
import HeaderImage from './HeaderImage'

import { isMobile } from '../utils/tools'

const styles = {
    HorizontalScrollOuterCenterContainer: {
        display: "flex",
        justifyContent: "center",
    },
    HorizontalScrollContainer: {
        width: "100%",
        maxWidth: "900px",
    },
    mobileTopPadding:{
        paddingTop:"100px"
    },
    pcTopPadding:{
        paddingTop:"50px"
    },
    modalOuterDiv:{
        fontFamily:"Raleway-Regular",
    },
    modalHeader:{
        fontSize:"2.5em"
    },
    modalBody:{
        display: "flex",
        flexDirection: "column",
        fontSize:"1.5em",
    },
    modalButton:{
        display:"flex",
        padding:"1em",
    },
}

const tileColors = {
    light: "#F4F4E8",
    medium: "#F6F1DE",
    dark: "#F4EFB6",
}

const tiles = [{
    name: "Featured",
    color: tileColors.medium,
}, {
    name: "Physics",
    color: tileColors.dark,
}, {
    name: "Chemistry",
    color: tileColors.medium,
}, {
    name: "Computer Science Fundamentals",
    color: tileColors.light,
}, {
    name: "Mathematics",
    color: tileColors.dark,
}, {
    name: "Machine Learning",
    color: tileColors.dark,
}, {
    name: "iOS",
    color: tileColors.medium,
}, {
    name: "Blockchain",
    color: tileColors.dark,
}, {
    name: "Smart Contracts",
    color: tileColors.medium,
}, {
    name: "Web Dev",
    color: tileColors.dark,
}
]

class LandingPageController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            filteredContent: [{
                title: "Loading"
            }],
            category: 'Featured',
            pageData: [],
            previousState: '',
            loadSuccessful: false,
            open:false,
            currentTitle:"",
            currentUsername:"",
            uid:"",
            contentId:"",

        }

        this.toggleOpen = this.toggleOpen.bind(this)
        this.toggleClosed = this.toggleClosed.bind(this)

    }

    componentDidMount() {
        try {
            api.getContentsPreview()
                .then(json => {
                    console.log('getcontents', json)
                    if (json && json.length) {
                        this.setState({
                                content: json || "errorLoadingContent"
                            },
                            () => this.setState({
                                    filteredContent: json,
                                    loadSuccessful: true
                                },
                                () => this.setState({
                                    pageData: [
                                        {
                                            title: "Featured",
                                            data: this.state.filteredContent,
                                            icon: "trophy",
                                        },
                                        // {
                                        //     title: "Physics",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("Physics")),
                                        //     icon: "atom",
                                        // },
                                        // {
                                        //     title: "Chemistry",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("Chemistry")),
                                        //     icon: "microscope",
                                        // },
                                        // {
                                        //     title: "Computer Science Fundamentals",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("Computer Science Fundamentals")),
                                        //     icon: "code",
                                        // },
                                        // {
                                        //     title: "Mathematics",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("Mathematics")),
                                        //     icon: "shapes",
                                        // },
                                        // {
                                        //     title: "Machine Learning",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("Machine Learning")),
                                        //     icon: "brain",
                                        // },
                                        // {
                                        //     title: "iOS",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("iOS")),
                                        //     icon: "mobile-alt",
                                        // },
                                        // {
                                        //     title: "Blockchain",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("Blockchain")),
                                        //     icon: "link",
                                        // },
                                        // {
                                        //     title: "Smart Contracts",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("Smart Contracts")),
                                        //     icon: "file-contract",
                                        // },
                                        // {
                                        //     title: "Web Dev",
                                        //     data: this.state.filteredContent.filter(this.correctCategory("Web Dev")),
                                        //     icon: "js",
                                        // },
                                    ]
                                }))
                        )
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

    getContentForCategory(category) {
        if (category === "Recently Added" || category === "Featured") {
            return this.state.content || []
        }
        const keywords = getTagsForCategory(category);

        //confusing naming! tags sounds like array and state.content sounds like obj -- not array

        function stringHasSubstring(str, substr) {
            return str.toLowerCase().includes(substr.toLowerCase())
        }

        return this.state.content || []
            .filter(content => keywords.filter(kw => stringHasSubstring(content.tags, kw)).length)
        //filter out when the tags string (??? should be array!) includes the keyword

        //if there is an array with at least 1 match then .length returns true(=> don't filter) else false

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

    changeSectionOrder(category) {
        let pageDataUpdate = this.state.pageData;

        if (this.state.loadSuccessful) {
            pageDataUpdate.unshift(                     	// add to the front of the array
                pageDataUpdate.splice(                    	// the result of deleting items
                    pageDataUpdate.findIndex(               	// starting with the index where
                        elt => elt.title === category), 	// the title is category
                    1)[0]                             	// and continuing for one item
            )
            this.setState({
                pageData: pageDataUpdate,
            })
        }
        window.location.href = "#searchResults"

    }

    componentDidUpdate() {
        if (this.props.category && this.props.category.length && this.props.category !== this.state.previousState) {
            this.setState({previousState: this.props.category})
            this.changeSectionOrder(this.props.category);
        }
    }


    toggleOpen(title,username,contentId,uid) {
        this.setState({
          open: !this.state.open,
          currentTitle: title,
          currentUsername: username,
          contentId: contentId,
          uid: uid,
        });
    }
    toggleClosed(){
        this.setState({
          open: !this.state.open,
      });
    }


    handleClick(value){
        console.log(this.props.data, "DATA at button")
            if(value==="remix")
                window.location.href  = `/create/${this.state.currentUsername}/${this.state.currentTitle}/${this.state.uid}/${this.state.contentId}`
            else if(value === "comments")
                window.location.href  = `/comments/${this.state.currentUsername}/${this.state.currentTitle}/${this.state.uid}/${this.state.contentId}`
            else if(value==="user")
                // window.location.href  = `/user/${this.state.currentUsername}/`
                window.location.href  = `/user/${this.state.currentUsername}/${this.state.uid}`
            // else if(value==="collection")
            //  null
            // else if(value==="flag")
            //  null
    }

    render() {

        return (
        < div >
        {isMobile()
            ? (
            	<div className = "landingPage" style={styles.mobileTopPadding}>
                	<HeaderImage type = "mobile" />
            		<section style = {styles.HorizontalScrollOuterCenterContainer}>
	  					<div style = {styles.HorizontalScrollContainer}>
		    				<br/>
		        			< ScrollableAnchor id = {'searchResults'} >
			            		< div >
						            < HorizontalScroll title = {"Tiles"} data = {tiles} positionChange = {this.changeSectionOrder.bind(this)} type = "mobile"/ >
						            {this.state.pageData.map(dataObj =>
						            	< HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data} type = "mobile" toggleOpen={this.toggleOpen}/ >
						    			)
						    		}
			    				</div>
		        			< /ScrollableAnchor>
	        			< /div>
        			< /section>
        		< /div>
    		)
    		: (
        		<div className = "landingPage" style={styles.pcTopPadding} >
            		<HeaderImage type = "PC" / >
            		<section style = {styles.HorizontalScrollOuterCenterContainer}>
    					<div style = {styles.HorizontalScrollContainer}>
    						<br/ >
        					<ScrollableAnchor id = {'searchResults'} >
            					<div >
						            < HorizontalScroll title = {"Tiles"} data = {tiles} positionChange = {this.changeSectionOrder.bind(this)} />
							        {
							            this.state.pageData.map(dataObj =>
							            	< HorizontalScroll title = {dataObj.title} data = {dataObj.data} icon = {dataObj.icon} toggleOpen={this.toggleOpen}/>
        								)
        							}
    							</div>
        					< /ScrollableAnchor>

        				< /div>
        			< /section>
        		< /div>
    		)
    	}
        <Modal isOpen={this.state.open} toggle={this.toggleClosed}
                           className={'modal-sm ' + this.props.className} style={styles.modalOuterDiv}>
              <ModalHeader toggle={this.toggleClosed} style={styles.modalHeader}>{this.state.currentTitle}</ModalHeader>
              <ModalBody style={styles.modalBody}>
                  <Button block color="light" onClick={this.handleClick.bind(this,"remix")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-pencil-alt"/></div>
                    <div style={{flex:3, textAlign:"left"}}>Remix</div>
                  </Button>
                  <Button block color="light" onClick={this.handleClick.bind(this,"comments")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-comment" /></div>
                    <div style={{flex:3, textAlign:"left"}}>View Comments</div>
                  </Button>
                  <Button block color="light" onClick={this.handleClick.bind(this,"user")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-user"/></div>
                    <div style={{flex:3, textAlign:"left"}}>{"Go To " + this.state.currentUsername + "'s Page"}</div>
                  </Button>
                  <Button block color="light" onClick={this.handleClick.bind(this,"collection")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-layer-group"/></div>
                    <div style={{flex:3, textAlign:"left"}}>Create New Collection</div>
                  </Button>
                  <Button block color="light" onClick={this.handleClick.bind(this,"flag")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-flag"/></div>
                    <div style={{flex:3, textAlign:"left"}}>Flag as Inappropriate</div>
                  </Button>

              </ModalBody>
            </Modal>
    </div>
    )
    }
}

export default LandingPageController;