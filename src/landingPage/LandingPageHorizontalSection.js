import React, { Component } from 'react';
import HorizontalScroll from '../horizontal_scroll/HorizontalScroll'

class LandingPageHorizontalSection extends Component{
	constructor(props){
		super(props)
	}


	render(){
		return(
			<div style={{padding:"10px 10px 10px 10px"}}>
				<div>
					<h1 style={{fontSize:"1.3rem",fontFamily: "SF-Pro-Display-Medium, HelveticaNeue_Bold,-apple-system, sans-serif"}}> 
					{
						this.props.title && this.props.title=="Tiles"
						? "Filter"
						: this.props.title

					}
					</h1>
					<hr color="black" style={{height:"1px", border: "none", marginTop:"0"}}/>
				</div>
				<HorizontalScroll data={this.props.data} type={this.props.title} id={this.props.id} positionChange={this.props.positionChange}/>
				<br/>
				<br/>
			</div>
			)
	}
}

export default LandingPageHorizontalSection;