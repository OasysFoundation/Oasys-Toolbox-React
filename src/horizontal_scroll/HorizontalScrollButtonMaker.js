import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Card, CardImg, CardText, CardBody, CardLink,
  CardTitle, CardSubtitle } from 'reactstrap';
import globe from '../images/globe.webp'
import { Rate } from 'antd';



class HorizontalScrollButtonMaker extends Component{
	constructor(props){
		super(props)
	}

	render(){
		
		// for type == tiles
		let hashLink, aTag = "";

		// for other types
		let title="",
			author="",
			rating="",
			numRatings="",
			uniqueId="",
			returnUrl="",
			stars="",
			userLink = "";

		if(this.props.type==="Tiles"){
			hashLink="#"+this.props.data.name
			aTag = this.props.data.name==="Physics" 
				? <a href="#Physics" className="pn-ProductNav_Link" aria-selected="true">Physics</a>
				: <a href={hashLink} className="pn-ProductNav_Link">{this.props.data.name}</a>
		}
		else{
			title= this.props.data.title;
			userLink = `/user/${this.props.data.userId}/${this.props.data.contentId}`
			returnUrl = "/user/"+this.props.data.userId;
			let rating = this.props.data.rating;
			console.log(rating);
			let whiteStar = '\u2606';
			let blackStar = '\u2605'
			if (rating){
				for (let i = 0; i < 5; i++){
					if(i<rating)
						stars += blackStar
					else
						stars += whiteStar 
				}
				stars+=" (12)"
			}

		}




		return(
			this.props.type==="Tiles"
			? (
				<Button variant="contained" color="inherit" style={{textTransform: "none", backgroundColor:this.props.data.color, borderRadius: "12px", margin:".5em .5em .5em .5em", size:"1em"}}>
            		{aTag}
            	</Button>
            )
            : (
            	<div className="pn-ProductNav_Link" aria-selected="true">
			      <Card backgroundColor="black" style={{whiteSpace: "initial", fontSize:"1vw", width:"175px", height:"250px", backgroundColor: '#F6F1DE', borderColor:"#F6F1DE", color: "#F6F1DE", maxHeight:"300px"}}>
			        <a href="?ha" style={{textDecoration:"none", height:"100%"}}>
			        <CardBody style={{width:"100%"}}>
			          <CardTitle style={{width:"100%", color:"#C6361D",fontWeight: "bold", wordWrap: "break-word"}}>{this.props.data.title}</CardTitle>
			          <CardSubtitle>
			          <a href={returnUrl} style={{color:"#C6361D"}}>By {this.props.data.userId}</a>
			          </CardSubtitle>
			        </CardBody>
			        <section style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
				 	<div style={{minWidth: 0, marginBottom: "5px"}}>
	                  <img src={globe} style={{width: "auto%", maxWidth: "100%", maxHeight: "75px"}}/>
	                </div>
                	</section>


			        <CardBody style={{height:"100%"}}>
			        <CardText style={{color:"#C6361D"}}>
			          {stars}
			         </CardText>
			        </CardBody>
			        </a>
			      </Card>
			    </div>
            )
		)
	}
}

export default HorizontalScrollButtonMaker;