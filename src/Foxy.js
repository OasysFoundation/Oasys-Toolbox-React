import React, {Component} from 'react';

class Foxy extends Component {
    constructor(props){
        super(props);
        this.width = 128;
        this.height = 128 / 1.26
    }

    
    render() {
        return <img alt={"Foxy, your friend"}
                    width={this.width}
                    height={this.height}
                    src={'https://i.pinimg.com/originals/1d/45/e0/1d45e0f646e17cc87257ebd5869b0ff0.jpg'}>
        </img>
    }
}
export default Foxy;