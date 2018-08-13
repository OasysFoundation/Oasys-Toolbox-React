import graph from '../assets/icons/graph.jpg'


const types=['button', 'slider', 'double-slider',]

//no id
const image = {
    action: {
        tooltip: 'make small',
        name: 'small',
        interactionType: 'icon',
        icon: graph, //example
        emitMessage: this.name

    }
};


class Toolbar extends Component {
    constructor(props) {
        super();
    }
    render(){
        //
        //take params, config and map icon buttons
        //icons ==> click ==> emitMessage
    }

}