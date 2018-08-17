import React, { Component } from 'react';

import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  RedditShareButton,
  TumblrShareButton,
  EmailShareButton,
} from 'react-share';

class SocialSharingButtons extends Component {

	render() {
		const iconStyle = {color: '#A2ABB8', fontSize:'30px', margin: '10px'};
		const defaultTitle = 'One of the best explanations for \"' + this.props.title + '\" I\'ve seen so far. Made by ' + this.props.author;
		return (
				<div style={{display:'flex', alignItems: 'center', justifyContent: 'center'}}>
					<i style={iconStyle} className='icon-plus' />
					<TwitterShareButton url={this.props.url} title={defaultTitle + ' on'} hashtags={['learnWithOasys', 'joinoasys', 'interactiveLearning']}>
						<i style={iconStyle} className='twitter-square' />
						T
					</TwitterShareButton>
					<FacebookShareButton url={this.props.url} quote={this.props.description} > 
						<i style={iconStyle} className='facebook-square' />
						F
					</FacebookShareButton>
					<TelegramShareButton url={this.props.url} title={defaultTitle}>
						<i style={iconStyle} className='telegram' />
						TG
					</TelegramShareButton>
					<WhatsappShareButton url={this.props.url} title={defaultTitle}>
						<i style={iconStyle} className='whatsapp' />
						WA
					</WhatsappShareButton>
					<EmailShareButton url={this.props.url} subject={defaultTitle} >
						<i style={iconStyle} className='email' />
						E
					</EmailShareButton>
				</div>
			)
	}

}

export default SocialSharingButtons;