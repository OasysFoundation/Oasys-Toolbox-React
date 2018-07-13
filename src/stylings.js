import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const buttonGradientCSS = {
    coolPink: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        margin: 0.5 + "rem",
        color: 'white',
        height: 48,
        padding: '0 25px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
    }
};

// const ClassInject = props => <Button onClick={this.onClick} className={props.classes.coolPink}>{props.children ? props.children : 'class names'}</Button>

const CoolPinkButton = (props) => <Button {...props} style={buttonGradientCSS.coolPink} />

export {buttonGradientCSS, CoolPinkButton}