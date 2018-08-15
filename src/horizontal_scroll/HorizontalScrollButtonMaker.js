import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardLink,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import globe from '../images/globe.webp'
import { Rate } from 'antd';
import './horizontal_scroll.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';


const styles= {
	cardStyle:{
		boxShadow: "3px 3px 5px #888888", 
		width:"175px", 
		height:"250px", 
		backgroundColor: '#F6F1DE', 
		borderColor:"#F6F1DE", 
		color: "#F6F1DE", 
		maxHeight:"300px", 
		fontFamily:"HelveticaNeue_Bold,-apple-system, sans-serif",
		margin:"0 5px"
	},
	cardBody:{
		width:"100%", 
		height:"160px", 
		display:"flex", 
		padding:"1em",
	},
	titleAndSubtitle:{
		flex:5, 
		height:"100%",
	},
	cardTitle:{
		textDecoration:"none", 
		width:"100%",
	},
	cardTitleLink:{
		textDecoration:"none", 
		height:"100%",
		color:"#C6361D",
		fontWeight: "bold",
		whiteSpace:"initial",
	},
	cardSubtitle:{
		color:"#C6361D",
	},
	verticalEllipsesOuterDiv:{
		flex:"1", 
		height:"100%",
	},
	ellipsisIcon:{
		flex:"1", 
		float:"right", 
		color:"#C3C8D4",
	},
	modalOuterDiv:{
		fontFamily:"HelveticaNeue_Light",
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
	cardImageOuterLink:{
		textDecoration:"none", 
		height:"100%",
	},
	cardImageSection:{
		display: "flex", 
		justifyContent: "center", 
		flexWrap: "wrap",
	},
	cardImageDiv:{
		minWidth: 0, 
		marginBottom: "5px",
	},
	cardImage:{
		width: "auto%", 
		maxWidth: "100%", 
		maxHeight: "85px",
	},
	cardRatingsOuterDiv:{
		color:"#C6361D", 
		display:"flex", 
		justifyContent:"center",
	}

}

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
  	handleClick(value){
  		value==="remix"
  			? window.location.href=`/create/${this.state.currentUsername}/${this.state.currentTitle}`
  			: value === "comments"
  				? window.location.href=`/comments/${this.state.currentUsername}/${this.state.currentTitle}`
  				: value==="user"
  					? window.location.href=`/user/${this.state.currentUsername}/`
  					: value==="collection"
  						? null
  						: value==="flag"
							? null
							: null

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
			aTag = this.props.data.name==="Featured Experiences" 
				? <a onClick={this.props.positionChange.bind(this,"Featured Experiences")} className="pn-ProductNav_Link" aria-selected="true">Featured Experiences</a>
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
				<Button variant="contained" size="small" color="inherit" style={{textTransform: "none", backgroundColor:this.props.data.color, borderRadius: "12px", margin:".3em .3em .3em .3em", boxShadow: "1px 1px 5px #888888"}}>
            		{aTag}
            	</Button>
            )
            : (
            	<div className="pn-ProductNav_Link" aria-selected="true">
			      <Card backgroundColor="black" style={styles.cardStyle}>
			        <CardBody style={styles.cardBody}>
			          <div style={styles.titleAndSubtitle}>
					          <CardTitle style={styles.cardTitle}>
					          	<a href={userLink} style={styles.cardTitleLink}>
					          	 {this.props.data.title}
					          	</a>
					          </CardTitle>
					          <CardSubtitle>
					          <a href={returnUrl} style={styles.cardSubtitle}>By {this.props.data.userId}</a>
					          </CardSubtitle>
				      </div>

			          <div style={styles.verticalEllipsesOuterDiv}>
			          	<a onClick={this.toggleSmall.bind(this,this.props.data)}><FontAwesomeIcon icon="ellipsis-v" style={styles.ellipsisIcon}/></a>
			          </div>
			          <Modal isOpen={this.state.small} toggle={this.toggleSmall}
	                       className={'modal-sm ' + this.props.className} style={styles.modalOuterDiv}>
	                  <ModalHeader toggle={this.toggleSmall} style={styles.modalHeader}>{this.state.currentTitle}</ModalHeader>
	                  <ModalBody style={styles.modalBody}>
	                      <Button block color="light" onClick={this.handleClick.bind(this,"remix")} style={styles.modalButton}>
	                      	<div style={{flex:1}}><FontAwesomeIcon icon="pencil-alt"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>Remix</div>
	                      </Button>
						  <Button block color="light" onClick={this.handleClick.bind(this,"comments")} style={styles.modalButton}>
						  	<div style={{flex:1}}><FontAwesomeIcon icon="comment"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>View Comments</div>
						  </Button>
						  <Button block color="light" onClick={this.handleClick.bind(this,"user")} style={styles.modalButton}>
						  	<div style={{flex:1}}><FontAwesomeIcon icon="user"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>{"Go To " + this.state.currentUsername + "'s Page"}</div>
						  </Button>
						  <Button block color="light" onClick={this.handleClick.bind(this,"collection")} style={styles.modalButton}>
						  	<div style={{flex:1}}><FontAwesomeIcon icon="layer-group"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>Create New Collection</div>
						  </Button>
						  <Button block color="light" onClick={this.handleClick.bind(this,"flag")} style={styles.modalButton}>
						  	<div style={{flex:1}}><FontAwesomeIcon icon="flag"/></div>
	                      	<div style={{flex:3, textAlign:"left"}}>Flag as Inappropriate</div>
						  </Button>

	                  </ModalBody>
	                </Modal>
			        </CardBody>
			        <a href={userLink} style={styles.cardImageOuterLink}>
				        <section style={styles.cardImageSection}>
						 	<div style={styles.cardImageDiv}>
			                  <img src={globe} style={styles.cardImage}/>
			                </div>
	                	</section>
				        <CardBody>
				        <CardText style={styles.cardRatingsOuterDiv}>
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