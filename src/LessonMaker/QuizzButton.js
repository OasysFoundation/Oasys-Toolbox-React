import React, { Component } from 'react';

class QuizzButton extends Component {
	constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect() {
    	this.props.onSelect(this.props.index);
    }

    render() {

    	const quizAnswerWrapStyle = {
            boxShadow: "2px 2px #AAAAAA",
            borderRadius: "6px 6px 6px 6px",
            padding: '2px',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            width: '100%',
            height: '100%',
            margin: '5px',
            backgroundColor: this.props.color,
            position: 'relative',
            cursor: 'pointer'
        };

        const quizAnswerStyle = {
            width: "100%",
            justifyContent: 'center',
            alignSelf: "center",
            alignItems: "center",
            justifySelf: "center",
            placeSelf: 'center',
            color: '#F8F8F4',
            fontSize: '1.3rem',
            fontWeight: '600',
            textShadow: '1px 1px #3E4B54',
        }

    	return (
    		<div style={quizAnswerWrapStyle} onClick={this.onSelect} id={this.props.id}>
                <div style={quizAnswerStyle}>
    					{this.props.showsSelectionIndicator? <div style={{position:'absolute', top:'5px', right:'5px'}}> {this.state.isSelected? "✅" : "☑️"} </div> : null}    					
                        <div>{this.props.answer.title? this.props.answer.title : "This answer option is empty. Click \'Edit Quiz\' in order to edit or remove it."}</div>
                        <div>
                        {this.props.answer.image!==""? (
                                <center>
                                    <img src={this.props.answer.image} alt="" width="100%" style={{padding:'10px'}}/>
                                </center>
                        ) : null}
                </div>
            </div></div>
    		)
    }
}


export default QuizzButton;