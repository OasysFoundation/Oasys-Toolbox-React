import React, { Component } from 'react';

class QuizzButton extends Component {
	constructor(props) {
        super(props);

        this.state= {
        	isSelected: props.isSelected
        }

        this.onSelect = this.onSelect.bind(this);
    }

    onSelect() {
    	this.setState({
    		isSelected: !this.state.isSelected
    	});

    	this.props.onSelect(this.props.index);
    }

    render() {

    	const quizAnswerOptionStyle = {
            boxShadow: "1px 1px #AAAAAA",
            borderRadius: "6px 6px 6px 6px",
            padding: '2px',
            textAlign: "center",
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: this.props.width,
            minHeight: this.props.height,
            backgroundColor: this.props.color,
            position: 'relative',
            cursor: 'pointer'
        };

    	return (
    		<div style={quizAnswerOptionStyle} onClick={this.onSelect} id={this.props.id}>
    					{this.props.showsSelectionIndicator? <div style={{position:'absolute', top:'5px', right:'5px'}}> {this.state.isSelected? "✅" : "☑️"} </div> : null}
    					
                        <div>{this.props.answer.title? this.props.answer.title : "This answer option is empty. Click \'Edit Quiz\' in order to edit or remove it."}</div>
                        <div>
                        {this.props.answer.image!==""? (
                                <center>
                                    <img src={this.props.answer.image} alt="" width="100%" style={{padding:'10px'}}/>
                                </center>
                        ) : null}
            </div></div>
    		)
    }
}


export default QuizzButton;