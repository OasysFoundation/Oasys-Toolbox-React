import React, { Component } from 'react';
import { Button, Card, CardText, CardBody, CardTitle, CardSubtitle, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Truncate from 'react-truncate';

import colors from '../utils/colors';

const styles= {
	cardStyle:{ 
		width:"170px", 
		height:"150px", 
		backgroundColor: colors.SNOW2, 
		borderColor:"#F6F1DE", 
		color: "#F6F1DE", 
		fontFamily:"Raleway-Regular,-apple-system, sans-serif",
		margin:".3em 5px"
	},
	boxShadow:{
		boxShadow: "1px 1px 5px #888888",
	},
	homeCardBody:{
		width:"100%", 
		height:"80%", 
		display:"flex", 
		overflow:"hidden",
		padding: "1.0rem",

	},
	titleAndSubtitle:{
		flex:5, 
		height:"100%",
	},
	cardTitle:{
		textDecoration:"none", 
		width:"100%",
		fontSize:".9rem",
		fontFamily:"Raleway-Regular,-apple-system, sans-serif",
	},
	cardTitleLink:{
		textDecoration:"none", 
		height:"100%",
		color:"#C6361D",
		fontWeight: "bold",
		whiteSpace:"initial",
	},
	cardSubtitle:{
		color: colors.RUST,
		fontSize: '0.8rem',
		fontFamily:"Raleway-Regular,-apple-system, sans-serif",
	},
	verticalEllipsesOuterDiv:{
		flex:"1", 
		height:"100%",
		cursor: 'pointer',
	},
	ellipsisIcon:{
		flex: "1", 
		float: "right", 
		color: colors.RUST,
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
	cardImageOuterLink:{
		textDecoration:"none", 
	},
	cardImageSection:{
		display: "flex", 
		justifyContent: "center", 
		flexWrap: "wrap",
	},
	cardImageDiv:{
		minWidth: 0, 
		marginBottom: "5px",
		textDecoration:"none",
		color:"#2a9699"
	},
	cardImage:{
		width: "auto%", 
		maxWidth: "100%", 
		maxHeight: "85px",
	},
	cardRatingsOuterDiv:{
		display:"flex", 
		justifyContent:"center",
		marginTop: '3px',
	},
	rating: {
		color: colors.SUMMERSUN, 
		textShadow: '0px 0px 1px ' +  colors.RUST,
	},
	ratingCount: {
		color: colors.RUST, 
		marginLeft: '0px',
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
		this.refStars = React.createRef();
		this.starStr = '';
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
  			if(value==="remix")
  				window.location.href  = `/create/${this.state.currentUsername}/${this.state.currentTitle}`
  			else if(value === "comments")
				window.location.href  = `/comments/${this.state.currentUsername}/${this.state.currentTitle}`
			else if(value==="user")
				window.location.href  = `/user/${this.state.currentUsername}/`
			// else if(value==="collection")
			// 	null
			// else if(value==="flag")
			// 	null
	}

	componentDidMount(){
		if (this.refStars.current===null) { return; }
		const radius = 40;

		let text = this.starStr.split("");
		let elem = this.refStars.current;
		
		let deg = 180 / text.length;
		let origin = 275; 

		text.forEach((ea) => {
			ea = `<span style='color: ${colors.SUMMERSUN};text-shadow: 0px 0px 1px ${colors.RUST};height:${radius}px;position:absolute;transform:rotate(${origin}deg);transform-origin:0 100%'>${ea}</span>`;
			elem.innerHTML += ea;
			origin += deg;
		});
	}

	render(){
		
		// for type == tiles
		let hashLink, aTag = "";

		// for type == card
		let returnUrl="",
			starCount="",
			userLink = "";

		this.starStr = '';

		if(this.props.type==="Tiles"){
			hashLink=this.props.data.name
			aTag = this.props.data.name==="Featured" 
				? <a onClick={this.props.positionChange.bind(this,"Featured")} className="pn-ProductNav_Link" aria-selected="true">Featured</a>
				: <a onClick={this.props.positionChange.bind(this,hashLink)} className="pn-ProductNav_Link">{this.props.data.name}</a>
		}
		else{
			userLink = `/user/${this.props.data.userId}/${this.props.data.contentId}`
			returnUrl = "/user/"+this.props.data.userId;
			let rating = this.props.data.rating;
			let whiteStar = '\u2606';
			let blackStar = '\u2605'
			if (rating){
				for (let i = 0; i < 5; i++){
					if(i<rating)
						this.starStr += blackStar
					else
						this.starStr += whiteStar 
				}
				starCount = " (12)"
			}

		}

		const containedStyle = {
			textTransform: "none", 
			borderRadius: "12px", 
			margin:".3em .3em .3em .3em", 
			backgroundColor: this.props.data.color,
		}

		return(
			this.props.type==="Tiles"
			? (
				<Button variant="contained" size="small" color="inherit" style={{...containedStyle,...styles.boxShadow}}>
            		{aTag}
            	</Button>
            )
            : (
            	<div className="pn-ProductNav_Link" aria-selected="true">
			      <Card style={{...styles.cardStyle,...styles.boxShadow}}>
			        <CardBody style={styles.homeCardBody}>
			          {/*<div style={{position: 'absolute', top: '20px', left: '40px'}}>
				          <i className="fas fa-7x fa-flask" style={{color: hexToRgba(colors.VELVET, 0.1)}}></i>
			          </div> */}
			          <div style={styles.titleAndSubtitle}>
					          <CardTitle style={styles.cardTitle}>
					          	<a href={userLink} style={styles.cardTitleLink}>
					          	<div>
					          	  <Truncate lines={4} >
					          	 	{this.props.data.title}
					              </Truncate>
					              </div>
					          	</a>
					          </CardTitle>
					          <CardSubtitle>
					          <a href={returnUrl} style={styles.cardSubtitle}>
					          <div>
					          	  <Truncate lines={1} >
					          	 	by {this.props.data.userId}
					              </Truncate>
					              </div>
					          </a>
					          </CardSubtitle>
				      </div>

			          <div style={styles.verticalEllipsesOuterDiv} className="bruh">
			          	<a onClick={this.toggleSmall.bind(this,this.props.data)} className="noTextDecoration"><FontAwesomeIcon icon="ellipsis-v" style={styles.ellipsisIcon}/></a>
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
				        <CardBody>
			        	<div style={{textAlign: 'center', marginTop: '-50px'}}>
						  <div ref={this.refStars} style={{display: 'inline-block', marginBottom: '10px', color: '#ff0000'}}></div>
						</div>
				        <a href={userLink} style={styles.cardImageOuterLink}>
					        <CardText style={styles.cardRatingsOuterDiv}>
					          {/*<span style={styles.rating}>{this.starStr}</span>*/}
					          <span style={styles.ratingCount}>{starCount}</span>
					         </CardText>
				        </a>
				        </CardBody>
			      </Card>
			    </div>
            )
		)
	}
}

export default HorizontalScrollButtonMaker;