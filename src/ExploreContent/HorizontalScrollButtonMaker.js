import React, { Component } from 'react';
import { Button, Card, CardText, CardBody, CardTitle, CardSubtitle} from 'reactstrap';
import Truncate from 'react-truncate';

import colors from '../utils/colors';

//import {connect} from "redux-zero/react";
//import actions from "../store/actions";
import store from "../store/store"

import history from '../history'

import ContentTileMenuModal from './ContentTileMenuModal'

const styles= {
	cardStyle:{
		width:"170px",
		height:"220px",
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
		height:"40%",
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
		cursor: 'pointer',
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
		padding: '10px',
		marginTop: '-10px',
		marginRight: '-10px',
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
		fontSize: '12px',
	}
}

class HorizontalScrollButtonMaker extends Component{
	constructor(props) { 
		super(props)
		this.state={
			small: false,
			currentTitle: "",
			currentUsername: "",
			showsTileMenu: false
		}
		this.refStars = React.createRef();
		this.starStr = '';

		this.toggleMenu = this.toggleMenu.bind(this);

	}

	componentDidMount() {
		if (this.refStars.current===null) { return; }
		const radius = 67;

		let text = this.starStr.split("");
		let elem = this.refStars.current;

		let pathLenDegree = 120;
		let deg = pathLenDegree / text.length;

		let origin = 298;
		text.forEach((ea) => {
			ea = `<span style='font-size:25px;color: ${colors.SUMMERSUN};text-shadow: 0px 0px 1px ${colors.RUST};height:${radius}px;position:absolute;transform:rotate(${origin}deg);transform-origin:0 100%'>${ea}</span>`;
			elem.innerHTML += ea;
			origin += deg;
		});
	}

	shouldComponentUpdate(nextProps) {
		// prevent any re-renders
		return true;
	}

	toggleMenu() {
		this.setState({
			showsTileMenu: !this.state.showsTileMenu
		});
	}

	render() {
		// for type == tiles
		let hashLink, aTag = "";

		// for type == card
		let returnUrl="",
			starCount="",
			playCount="";

		this.starStr = '';

		if(this.props.type==="Tiles"){
			hashLink=this.props.data.name
			aTag = this.props.data.name==="Featured"
				? <a onClick={this.props.positionChange.bind(this,"Featured")} className="pn-ProductNav_Link" aria-selected="true">Featured</a>
				: <a onClick={this.props.positionChange.bind(this,hashLink)} className="pn-ProductNav_Link">{this.props.data.name}</a>
		}
		else{
			returnUrl = "/user/"+this.props.data.username+"/"+this.props.data.uid;
			let rating = this.props.data.rating;
			let whiteStar = '\u2606';
			let blackStar = '\u2605';
			let ratingRounded = Math.round(rating.mean);
			this.starStr = blackStar.repeat(ratingRounded) + whiteStar.repeat(5-ratingRounded);
			starCount = this.props.data.rating.count;
			playCount = this.props.data.views
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
            	<div className="pn-ProductNav_Link" aria-selected="true"  onClick={() => {
			          		store.setState(this.props.data);
			          		history.push(`/view/${this.props.data.username}/${this.props.data.title}/${this.props.data.uid}/${this.props.data.contentId}`)
                        }} style={styles.cardTitleLink}>
			      <Card style={{...styles.cardStyle,...styles.boxShadow}}>
			        <CardBody style={styles.homeCardBody}>
			          {/*<div style={{position: 'absolute', top: '20px', left: '40px'}}>
				          <i className="fas fa-7x fa-flask" style={{color: hexToRgba(colors.VELVET, 0.1)}}></i>
			          </div> */}
			          <div style={styles.titleAndSubtitle}>
				          <CardTitle style={styles.cardTitle}>
				          	<div style={styles.cardTitleLink}>
				          	  <Truncate lines={3} >
				          	 	{this.props.data.title}
				              </Truncate>
				              </div>
				          </CardTitle>
				          <CardSubtitle>
				          <a href={returnUrl} style={styles.cardSubtitle}>
				          	<div style={styles.cardSubtitle}>
				          	  <Truncate lines={1} >
				          	 	by {this.props.data.username}
				              </Truncate>
				            </div>
				          </a>
				          </CardSubtitle>
				      </div>
			          <div style={styles.verticalEllipsesOuterDiv} className="bruh">
			          	<a onClick={(e) => { e.stopPropagation(); this.toggleMenu(); }} className="noTextDecoration"><i className="fas fa-ellipsis-v faAlignRight" style={styles.ellipsisIcon}/></a>
			          </div>
			        </CardBody>
			        <CardBody>
			        <div style={{position: 'absolute',top:'116px',left:'49px'}}>
			        	{this.props.data.iconName? 
			        		<img src={require('../assets/category-icons/' + this.props.data.iconName)} width='70px' height='70px' alt=''/>
			        	:
			        		<img src={require('../assets/category-icons/005-atom.svg')} width='70px' height='70px' alt=''/>
			        	}
		        	</div>
		        	<div style={{textAlign: 'center', marginTop: '-65px'}}>
					  <div ref={this.refStars} style={{display: 'inline-block', marginBottom: '10px', color: '#ff0000'}}></div>
					</div>
			        <CardText style={styles.cardRatingsOuterDiv}>
			          {/*<span style={styles.rating}>{this.starStr}</span>*/}
			         </CardText>

			        <div style={{position: 'absolute', bottom: '5px', left: '10px'}}>
		            	<span style={styles.ratingCount}>
		            		<i class="fas fa-star" style={{marginRight: '5px'}}></i>
		            		{starCount}
		            	</span>
			        </div>
			        <div style={{position: 'absolute', bottom: '5px', right: '10px'}}>
		            	<span style={styles.ratingCount}>
		            		{playCount} 
		            		<i class="fas fa-user-graduate" style={{marginLeft: '5px'}}></i>
		            	</span>
			        </div>
			        </CardBody>
			      </Card>	
			      <ContentTileMenuModal isOpen={this.state.showsTileMenu} data={this.props.data} onClose={this.toggleMenu.bind(this)} deletable={this.props.deletable}/>       
			    </div>
            )
          )
	}
}

export default HorizontalScrollButtonMaker;
