import React, {Component} from 'react';
import tail from './foxy_assets/foxy_tail.gif'
import body from './foxy_assets/foxy_body.gif'
import head from './foxy_assets/foxy_head.gif'
import './foxy_style.css'
import {buttonGradientCSS} from "./stylings";

class Foxy extends Component {
    constructor(props) {
        super(props);
        this.width = 200;
        this.height = 200 / 1.26

        this.upperLeft = {
            x: this.width * 0.8,
            y: this.height * this.height * 0.8
        }
        this.state = {
            showFoxy: true
        }
    }

    moveTail() {
        if (window.anim) {
            return
        }

        //wait for Head to move first
        setTimeout(function() {
            let deg = 0;
            let reverse = false;
            const tail = document.getElementsByClassName('foxy_tail')[0];
            const speed = 6;
            const range = 70;

            window.anim = window.setInterval(function () {
                tail.style.transform = `rotate(${-deg}deg)`;
                if (deg > range) {
                    reverse = true;
                }
                if (!reverse) {
                    deg += speed;
                }
                else if (reverse && deg >= 0) {
                    deg -= speed;
                }
                else {
                    window.clearInterval(window.anim)
                    window.anim = null;
                }
            }, 25)
        }, 1000)
    }


    //ONLY THE FUCKING HEAD CAN RECEIVE EVENTS...DON"T KNOW WHY
    // THE TAIL CAN't RECEIVE EVENTS>>>>> IT"S OCCLUDED OR SMTH BS*/}

    render() {
        // if (!this.state.showFoxy) {
        //     return <button style={buttonGradientCSS.mini} onClick={() => this.setState({showFoxy: true})}>Foxy!</button>
        // }
        return (
            <div style={{marginTop: 7 + 'rem'}}>
                {/*<div className={'foxy_eyes'}>$     $</div>*/}
                <img alt={"Foxy, your friend"}
                     className={'foxy_head'}
                     onMouseEnter={this.moveTail}
                     src={head}>
                </img>
                <img alt={"Foxy, your friend"}
                     className={'foxy_body'}
                     src={body}>
                </img>
                <img alt={"Foxy, your friend"}
                     className={'foxy_tail'}
                     src={tail}>
                </img>
                {/*<button style={buttonGradientCSS.mini} onClick={() => this.setState({showFoxy: false})}>Hushhh!</button>*/}
            </div>)
    }
}

export default Foxy;