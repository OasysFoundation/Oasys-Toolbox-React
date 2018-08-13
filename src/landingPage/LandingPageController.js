import React, { Component } from 'react';
import LandingPageHorizontalSection from './LandingPageHorizontalSection'
import cover from '../images/plzfinal.png'
import './landingPage.css'
import api from '../tools'
import {getTagsForCategory} from "../utils";
import {Unwrap, Wrap} from "../utils"
import ErrorLoadingContentPage from "../ErrorLoadingContentPage"

import {Button} from 'reactstrap'


const tileColors = {
	light:"#F4F4E8",
	medium:"#F6F1DE",
	dark:"#F4EFB6",
}

const tiles = [{
		name: "Physics", 
		color: tileColors.dark,
	},{
		name: "Chemistry", 
		color: tileColors.medium,
	},{
		name: "Computer Science Fundamentals", 
		color: tileColors.light,
	},{
		name: "Mathematics", 
		color: tileColors.dark,
	},{
		name: "Machine Learning", 
		color: tileColors.dark,
	},{
		name: "iOs", 
		color: tileColors.medium,
	},{
		name: "Blockchain", 
		color: tileColors.dark,
	},{
		name: "Smart Contracts", 
		color: tileColors.medium,
	},{
		name: "Web Dev", 
		color: tileColors.dark,
	}
]

const loadingData = [{
	title:"Loading"
}]

const sectionIds = [0,1,2,3,4]

class LandingPageController extends Component{
	constructor(props){
		super(props);
		this.state={
			content:[],
			filteredContent:[{
				title:"Loading"
			}],
			category: 'Featured',
			pageData:[],
			previousState:'',

		}

		api.getContentsPreview()
            .then(json => 
            	this.setState({
                	content: json || "errorLoadingContent"},
                	() => this.setState({filteredContent: this.getContentForCategory(this.state.category)},
                	() => this.setState({
						pageData : [
						{
							title:"Featured",
							data:this.state.filteredContent,
							id: sectionIds[1]
						},
						{
							title:"Physics",
							data:this.state.filteredContent.filter(this.correctCategory("Physics")),
							id: sectionIds[2]
						},
						{
							title:"Chemistry",
							data:this.state.filteredContent.filter(this.correctCategory("Chemistry")),
							id: sectionIds[3]
						},
						{
							title:"Computer Science Fundamentals",
							data:this.state.filteredContent.filter(this.correctCategory("Computer Science Fundamentals")),
							id: sectionIds[4]
						},
						{
							title:"Mathematics",
							data:this.state.filteredContent.filter(this.correctCategory("Mathematics")),
							id: sectionIds[4]
						},
						{
							title:"Machine Learning",
							data:this.state.filteredContent.filter(this.correctCategory("Machine Learning")),
							id: sectionIds[4]
						},
						{
							title:"iOs",
							data:this.state.filteredContent.filter(this.correctCategory("iOs")),
							id: sectionIds[4]
						},
						{
							title:"Blockchain",
							data:this.state.filteredContent.filter(this.correctCategory("Blockchain")),
							id: sectionIds[4]
						},
						{
							title:"Smart Contracts",
							data:this.state.filteredContent.filter(this.correctCategory("Smart Contracts")),
							id: sectionIds[4]
						},
						{
							title:"Web Dev",
							data:this.state.filteredContent.filter(this.correctCategory("Web Dev")),
							id: sectionIds[4]
						},
					]
				}))
            ))

	}

	handleCategoryChange(event) {
        this.setState({
         category: event.target.value,
         filteredContent: this.getContentForCategory(event.target.value)
     });
    }

	getContentForCategory(category) {
        if (category === "Recently Added" || category === "Featured") {
            return this.state.content
        }
        const keywords = getTagsForCategory(category);
        //confusing naming! tags sounds like array and state.content sounds like obj -- not array

        function stringHasSubstring(str, substr) {
            return str.toLowerCase().includes(substr.toLowerCase())
        }
        return this.state.content
            .filter(content => keywords.filter(kw => stringHasSubstring(content.tags, kw) ).length)
            //filter out when the tags string (??? should be array!) includes the keyword

                //if there is an array with at least 1 match then .length returns true(=> don't filter) else false

    }

    filterContentByCategory(content, category) {
        
        const keywords = getTagsForCategory(category);
        //confusing naming! tags sounds like array and state.content sounds like obj -- not array

        function stringHasSubstring(str, substr) {
            return str.toLowerCase().includes(substr.toLowerCase())
        }
        return this.state.content
            .filter(content => keywords.filter(kw => stringHasSubstring(content.tags, kw) ).length)
            //filter out when the tags string (??? should be array!) includes the keyword

                //if there is an array with at least 1 match then .length returns true(=> don't filter) else false

    }

    //function in function to pass extra argument to filter function
    correctCategory(category){
    	function stringHasSubstring(str, substr) {
    		if(!str||!substr)
    			return
            return str.toLowerCase().includes(substr.toLowerCase())
        }
    	return function(element){
    		const keywords = getTagsForCategory(category);
    		return keywords.filter(kw => stringHasSubstring(element.tags, kw) ).length ? element : null
    	}

    }

    changeSectionOrder(category){
    	let pageDataUpdate = this.state.pageData;

    	pageDataUpdate.unshift(                     	// add to the front of the array
		  pageDataUpdate.splice(                    	// the result of deleting items
		    pageDataUpdate.findIndex(               	// starting with the index where
		      elt => elt.title === category), 	// the title is category
		  1)[0]                             	// and continuing for one item
		)

		this.setState({
			pageData:pageDataUpdate,
		})

    }
    componentDidUpdate(){
		if(this.props.category && this.props.category.length && this.props.category!=this.state.previousState){
			this.setState({previousState:this.props.category})
			this.changeSectionOrder(this.props.category);
		}
    }

	render(){

		

		return(
			<div>
				<section style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
				 	<div style={{minWidth: 0, marginBottom: "16px",position:"relative"}}>
	                  <img src={cover} style={{width: "100%", maxWidth: "100%", maxHeight: "450px"}}/>
	                  <div style={{position:"absolute",top: ".5em", width:"100%", display:"flex", justifyContent:"center",  flexDirection: "column", height:"90%",}}>
	                  	<div style={{flex:"5", display:"flex", flexDirection:"column", height:"auto"}}>
	                  		<div style={{display:"flex",justifyContent:"center"}}>
	                  			<h1 style={{fontSize:"3.6vw", color:"#27363e", fontFamily:"helveticaneue"}}>Explore Interactive Content</h1>
	                  		</div>​​​​​​​
	                  		<div style={{fontSize:"1.3vw", color:"#27363e", fontFamily:"helveticaneue",display:"flex", justifyContent:"center"}}>
	                  			Learn STEM Naturally with Trial, Error, and Feedback 
	                  		</div>
	                  	</div>
	                  	<div style={{fontSize:"2vh", fontFamily:"helveticaneue", flex:"1",display:"flex", justifyContent:"center"}}>
	                  		<div style={{height:"50%"}}>
	                  		<Button size="lg" color="light" style={{color:"#27363e"}}> Create Your Own Content!</Button>
	                  		</div>
	                  	</div>
	                  </div>
	                 </div>
                </section>

                <section style={{display:"flex", justifyContent:"center"}}>
					<div  style={{width:"100%", maxWidth:"900px"}}>
						<br/>
						<LandingPageHorizontalSection title={"Tiles"} data={tiles} id={sectionIds[0]} positionChange={this.changeSectionOrder.bind(this)}/>
						
						{this.state.pageData.map(dataObj=>
								<LandingPageHorizontalSection title={dataObj.title} data={dataObj.data} id={dataObj.id}/>
						)}

					</div>
				</section>
			</div>
			)
	}
}

export default LandingPageController;