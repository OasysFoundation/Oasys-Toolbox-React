import React, {Component} from 'react';
import foxy_default from './foxy_assets/foxy_default.gif'
import foxy_excited from './foxy_assets/foxy_excited.gif'
// import './foxy_style.css'
import {buttonGradientCSS} from "./stylings";

class Foxy extends Component {
    constructor(props) {
        super(props);
        this.width = 200;
        this.height = 200 / 1.26

        this.state = {
            isExcited: false,
            show: true
        }
    }

    render() {
        if (window.innerWidth < 550) {
            // no Foxy
            return
        }
        return (
            <section style={{display: 'flex', flexDirection: 'column'}}>
                {this.state.show ? (
                    <img
                        onMouseEnter={() => this.setState({isExcited: true})}
                        onMouseLeave={() => this.setState({isExcited: false})}
                        src={this.state.isExcited ? foxy_excited : foxy_default}
                    />) : (null)}

                <button style={buttonGradientCSS.mini}
                        onClick={() => this.setState({show: !this.state.show})}>
                    {this.state.show ? 'Husshh!' : 'Foxy!!'}
                </button>
            </section>)
    }
}

export default Foxy;