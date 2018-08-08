import React, { Component } from 'react';
import LandingPageHorizontalSection from './LandingPageHorizontalSection'
import cover from '../images/cover4.png'
import './landingPage.css'
import api from '../tools'
import {getTagsForCategory} from "../utils";
import {Unwrap, Wrap} from "../utils"
import ErrorLoadingContentPage from "../ErrorLoadingContentPage"




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
		name: "Statistics", 
		color: tileColors.light,
	},{
		name: "Engineering", 
		color: tileColors.dark,
	},{
		name: "Java", 
		color: tileColors.medium,
	},{
		name: "Machine Learning", 
		color: tileColors.dark,
	},{
		name: "Anatomy", 
		color: tileColors.light,
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
			category: 'Featured'

		}

		api.getContentsPreview()
            .then(json => this.setState({
                content: json || "errorLoadingContent"},
                () => this.setState({filteredContent: this.getContentForCategory(this.state.category)})))
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

	render(){
		// <LandingPageHorizontalSection title={"Physics"} data={this.state.filteredContent} />
		// <LandingPageHorizontalSection title={"Chemistry"} data={this.state.filteredContent} />
		// <LandingPageHorizontalSection title={"Computer Science"} data={this.state.filteredContent} />
		return(
			<div>
				<section style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
				 	<div style={{minWidth: 0, marginBottom: "16px"}}>
	                  <img src={cover} style={{width: "auto%", maxWidth: "100%", maxHeight: "450px"}}/>
	                </div>
                </section>

                <section style={{display:"flex", justifyContent:"center"}}>
					<div  style={{width:"100%", maxWidth:"900px"}}>
						<LandingPageHorizontalSection title={"Tiles"} data={tiles} id={sectionIds[0]}/>
						<LandingPageHorizontalSection title={"Featured"} data={this.state.filteredContent} id={sectionIds[1]}/>
						<LandingPageHorizontalSection title={"Physics"} data={this.state.filteredContent} id={sectionIds[2]}/>
						<LandingPageHorizontalSection title={"Chemistry"} data={this.state.filteredContent} id={sectionIds[3]}/>
						<LandingPageHorizontalSection title={"Computer Science"} data={this.state.filteredContent} id={sectionIds[4]}/>
					</div>
				</section>
			</div>
			)
	}
}

export default LandingPageController;