import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardLink,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import globe from '../images/globe.webp'
import { Rate } from 'antd';
import './horizontal_scroll.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';




class HorizontalScrollButtonMaker extends Component{
	constructor(props){
		super(props)
		this.state={
			small: false,
			currentTitle: "",
			currentUsername: "",
		}
		this.toggleSmall = this.toggleSmall.bind(this);

	}

	toggleSmall(data) {
	    this.setState({
	      small: !this.state.small,
	      currentTitle: data.title,
	      currentUsername: data.userId,
	    });
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
			hashLink=this.props.data.name
			aTag = this.props.data.name==="Physics" 
				? <a onClick={this.props.positionChange.bind(this,"Physics")} className="pn-ProductNav_Link" aria-selected="true">Physics</a>
				: <a onClick={this.props.positionChange.bind(this,hashLink)} className="pn-ProductNav_Link">{this.props.data.name}</a>
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
				<Button variant="contained" size="small" color="inherit" style={{textTransform: "none", backgroundColor:this.props.data.color, borderRadius: "12px", margin:".5em .5em .5em .5em", boxShadow: "1px 1px 5px #888888"}}>
            		{aTag}
            	</Button>
            )
            : (
            	<div className="pn-ProductNav_Link" aria-selected="true">
			      <Card backgroundColor="black" style={{boxShadow: "3px 3px 5px #888888", width:"175px", height:"250px", backgroundColor: '#F6F1DE', borderColor:"#F6F1DE", color: "#F6F1DE", maxHeight:"300px", fontFamily:"HelveticaNeue_Bold,-apple-system, sans-serif"}}>
			        <CardBody style={{width:"100%", height:"160px", display:"flex", padding:"1em"}}>
			          <div style={{flex:5, height:"100%"}}>
					          <CardTitle style={{textDecoration:"none", width:"100%"}}>
					          	<a href="/" style={{textDecoration:"none", height:"100%",color:"#C6361D",fontWeight: "bold",whiteSpace:"initial"}}>
					          	 {this.props.data.title}
					          	</a>
					          </CardTitle>
					          <CardSubtitle>
					          <a href={returnUrl} style={{color:"#C6361D"}}>By {this.props.data.userId}</a>
					          </CardSubtitle>
				      </div>

			          <div style={{flex:"1", height:"100%"}}>
			          	<a onClick={this.toggleSmall.bind(this,this.props.data)}><FontAwesomeIcon icon="ellipsis-v" style={{flex:"1", float:"right", color:"#C3C8D4"}}/></a>
			          </div>
			          <Modal isOpen={this.state.small} toggle={this.toggleSmall}
	                       className={'modal-sm ' + this.props.className} style={{fontFamily:"HelveticaNeue_Light"}}>
	                  <ModalHeader toggle={this.toggleSmall} style={{fontSize:"2.5em"}}>{this.state.currentTitle}</ModalHeader>
	                  <ModalBody style={{display: "flex",flexDirection: "column", fontSize:"1.5em"}}>
	                      <Button block color="light" style={{display:"flex", padding:"1em"}}>
	                      	<div style={{flex:1}}><FontAwesomeIcon icon="pencil-alt"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>Remix</div>
	                      </Button>
						  <Button block color="light" style={{display:"flex", padding:"1em"}}>
						  	<div style={{flex:1}}><FontAwesomeIcon icon="comment"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>View Comments</div>
						  </Button>
						  <Button block color="light" style={{display:"flex", padding:"1em"}}>
						  	<div style={{flex:1}}><FontAwesomeIcon icon="user"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>{"Go To " + this.state.currentUsername + "'s Page"}</div>
						  </Button>
						  <Button block color="light" style={{display:"flex", padding:"1em"}}>
						  	<div style={{flex:1}}><FontAwesomeIcon icon="object-group"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>Create New Collection</div>
						  </Button>
						  <Button block color="light" style={{display:"flex", padding:"1em"}}>
						  	<div style={{flex:1}}><FontAwesomeIcon icon="flag"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>Flag as Inappropriate</div>
						  </Button>

	                  </ModalBody>
	                </Modal>
			        </CardBody>
			        <a href="/" style={{textDecoration:"none", height:"100%"}}>
				        <section style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
					 	<div style={{minWidth: 0, marginBottom: "5px"}}>
		                  <img src={globe} style={{width: "auto%", maxWidth: "100%", maxHeight: "85px"}}/>
		                </div>
	                	</section>
				        <CardBody>
				        <CardText style={{color:"#C6361D", display:"flex", justifyContent:"center"}}>
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