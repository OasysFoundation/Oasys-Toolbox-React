import React, { Component } from 'react';
import cover from '../images/coverFred-4.jpg'
import coverMobile from '../images/coverMid.png'
import {Button} from 'reactstrap'
import Media from "react-media";

const styles = {
	mainContainer:{
		minWidth: 0, 
		marginBottom: "16px",
		position:"relative",
		display: "flex",
		justifyContent:"center",
	},
	backgroundImage:{
		width: "auto",
		maxHeight: "475px",
		maxWidth: "100%",
	},
	floatingAbsoluteContainer:{
		position:"absolute",
		top: "1em", 
		width:"100%", 
		display:"flex", 
		justifyContent:"center",  
		flexDirection: "column", 
		height:"90%",
	},
	titleAndSubtitle:{
		flex:"5", 
		display:"flex", 
		flexDirection:"column", 
		height:"auto",
	},
	bottomButtonDiv:{
		fontSize:"2vh", 
		fontFamily:"helveticaneue", 
		flex:"1",
		display:"flex", 
		justifyContent:"center",
		height:"50%",
		color:"#27363e",
	},
	title:{
		display:"flex",
		justifyContent:"center",
		color:"#27363e", 
		fontFamily:"helveticaneue",
	},
	subtitle:{
		color:"#27363e", 
		fontFamily:"helveticaneue",
		display:"flex", 
		justifyContent:"center",
	},

}

class HeaderImage extends Component{
	constructor(props){
		super(props);
	}

	getPCScreenImage(value){
		let myFontSizeTitle="3.5vw";
		let myFontSizeSubTitle="2vw";
		let currentCover = coverMobile;
		
		if(value==="medium"){
			myFontSizeTitle="2.5vw";
		    myFontSizeSubTitle="1.25vw";
			currentCover=cover;
		}
		else if(value==="large"){
			myFontSizeTitle = "2vw"
			myFontSizeSubTitle = "1vw"
			currentCover = cover;
		}

		return (
			<div style={styles.mainContainer}>
			  
			  	<img src={currentCover} style={styles.backgroundImage}/>
			  
              <div style={styles.floatingAbsoluteContainer}>
              	<div style={styles.titleAndSubtitle}>
              		<div style={styles.title}>
              			<h1 style={{fontSize:myFontSizeTitle}}>Explore Interactive Content</h1>
              		</div>​​​​​​​
              		<div style={styles.subtitle}>
              			<h2 style={{fontSize:myFontSizeSubTitle}}>Learn Science and Technology through Experimentation and Play</h2> 
              		</div>
              	</div>
              	<div style={styles.bottomButtonDiv}>
              		<Button size="lg" color="light"> Create Your Own Content!</Button>
              	</div>
              </div>
             </div>
		)
	}

	getMobileScreenImage(){
		alert("mobile bitches");
	}

	render(){
		return(
			<div>
				<Media 
					query="(max-width: 767px)"
	          		render={() => null}
	          	/>
	          	<Media 
					query="(min-width: 768px) and (max-width: 999px)"
	          		render={() => this.getPCScreenImage("small")}
	          	/>
	          	<Media 
					query="(min-width: 1000px) and (max-width: 1283px)"
	          		render={() => this.getPCScreenImage("medium")}
	          	/>
	          	<Media 
					query="(min-width: 1284px)"
	          		render={() => this.getPCScreenImage("large")}
	          	/>
          	</div>
		 	
		)
	}

}

export default HeaderImage;


		