import React, { Component } from 'react';
import api from '../api'
import {getTagsForCategory} from "../utils/LandingPage";
import ScrollableAnchor from 'react-scrollable-anchor'

import HorizontalScroll from './HorizontalScroll'
import HeaderImage from './HeaderImage'


const styles={
	HorizontalScrollOuterCenterContainer:{
		display:"flex", 
		justifyContent:"center",
	},
	HorizontalScrollContainer:{
		width:"100%", 
		maxWidth:"900px",
	},
}

const tileColors = {
	light:"#F4F4E8",
	medium:"#F6F1DE",
	dark:"#F4EFB6",
}

const tiles = [{
		name: "Featured", 
		color: tileColors.medium,
	},{
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
		name: "iOS", 
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


const sectionIds = [0,1,2,3,4,5,6,7,8,9]

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
							id: sectionIds[1],
							icon: "trophy",
						},
						{
							title:"Physics",
							data:this.state.filteredContent.filter(this.correctCategory("Physics")),
							id: sectionIds[2],
							icon:"atom",
						},
						{
							title:"Chemistry",
							data:this.state.filteredContent.filter(this.correctCategory("Chemistry")),
							id: sectionIds[3],
							icon:"microscope",
						},
						{
							title:"Computer Science Fundamentals",
							data:this.state.filteredContent.filter(this.correctCategory("Computer Science Fundamentals")),
							id: sectionIds[4],
							icon:"code",
						},
						{
							title:"Mathematics",
							data:this.state.filteredContent.filter(this.correctCategory("Mathematics")),
							id: sectionIds[5],
							icon:"shapes",
						},
						{
							title:"Machine Learning",
							data:this.state.filteredContent.filter(this.correctCategory("Machine Learning")),
							id: sectionIds[6],
							icon:"brain",
						},
						{
							title:"iOS",
							data:this.state.filteredContent.filter(this.correctCategory("iOS")),
							id: sectionIds[7],
							icon:"mobile-alt",
						},
						{
							title:"Blockchain",
							data:this.state.filteredContent.filter(this.correctCategory("Blockchain")),
							id: sectionIds[8],
							icon:"link",
						},
						{
							title:"Smart Contracts",
							data:this.state.filteredContent.filter(this.correctCategory("Smart Contracts")),
							id: sectionIds[9],
							icon:"file-contract",
						},
						{
							title:"Web Dev",
							data:this.state.filteredContent.filter(this.correctCategory("Web Dev")),
							id: sectionIds[10],
							icon:"js",
						},
					]
				}))
            ))

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
		window.location.href="#searchResults"

    }
    componentDidUpdate(){
		if(this.props.category && this.props.category.length && this.props.category!==this.state.previousState){
			this.setState({previousState:this.props.category})
			this.changeSectionOrder(this.props.category);
		}
    }

    checkMobile(){
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      }

	render(){

		return(
			<div>
				{this.checkMobile()
					?	(
						<div className="landingPage">
							<HeaderImage type="mobile"/>
							<section style={styles.HorizontalScrollOuterCenterContainer}>
								<div  style={styles.HorizontalScrollContainer}>
									<br/>
									<ScrollableAnchor id={'searchResults'}>
									<div>
									<HorizontalScroll title={"Tiles"} data={tiles} id={sectionIds[0]} positionChange={this.changeSectionOrder.bind(this)} type="mobile"/>
									{this.state.pageData.map(dataObj=>
											<HorizontalScroll key={dataObj.title} title={dataObj.title} data={dataObj.data} id={dataObj.id} type="mobile"/>
									)}
									</div>
									</ScrollableAnchor>

								</div>
							</section>
						</div>
					)
					: (
						<div className="landingPage">
							<HeaderImage type="PC"/>
							<section style={styles.HorizontalScrollOuterCenterContainer}>
								<div style={styles.HorizontalScrollContainer}>
									<br/>
									<ScrollableAnchor id={'searchResults'}>
							        <div>
									<HorizontalScroll title={"Tiles"} data={tiles} id={sectionIds[0]} positionChange={this.changeSectionOrder.bind(this)}/>
									{this.state.pageData.map(dataObj=>
											<HorizontalScroll title={dataObj.title} data={dataObj.data} id={dataObj.id} icon={dataObj.icon}/>
									)}
									</div>
									</ScrollableAnchor>

								</div>
							</section>
						</div>
					)
				}
			</div>
			)
	}
}

export default LandingPageController;