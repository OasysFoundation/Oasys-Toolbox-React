import React, { Component } from 'react';
import HorizontalScroll from '../horizontal_scroll/HorizontalScroll'

class LandingPageHorizontalSection extends Component{
	constructor(props){
		super(props)
	}


	render(){
		return(
			<div>
				<div>
					<h1 style={{fontSize:"1.5rem"}}> 
					{
						this.props.title && this.props.title=="Tiles"
						? "Filter by Tag"
						: this.props.title

					}
					</h1>
					<hr/>
				</div>
				<HorizontalScroll data={this.props.data} type={this.props.title} id={this.props.id}/>
			</div>
			)
	}
}

export default LandingPageHorizontalSection;