import React, {Component} from 'react';
import styled from "styled-components";
import Tree from "./Tree"
import Button from '@material-ui/core/Button';


const x = {operators: ["IF", "AND", "OR", "ANDTHEN"]};


const opt = ["A", "B", "C"];
// window.myEvents = [
//     {
//         subject: "Player",
//         options: [
//             {name: "sings", options: opt},
//             {name: "pauses", options: ["yes", "no"]}
//         ]
//     }
// ];

window.eventTree = [
    {
        name: "Player",
        children: [
            {name: "sings", children: opt},
            {name: "pauses", children: ["yes", "no"]}
        ]
    }
];

const EVENT_TREE = new Tree(window.eventTree[0])

class Option extends Component {
    constructor(props) {
        super();
        //props : activated
        this.onClick = this.onClick.bind(this);
        this.state = {
            active:false
        };
    }

    onClick(event) {
        EVENT_TREE.overrideChildProps("active", false)
        event.preventDefault()
        event.stopPropagation();
        const node = EVENT_TREE.findNodeInChildren(this.props.name);

        node.active = true;
        console.log(node);

        node.setParentsProperty("active", true);

        const eventChoice = EVENT_TREE.findNodesWithProp("active", true, [])
        console.log(eventChoice);
        this.props.reset(eventChoice);
    }

    render() {
        if (!this.props.children) {
            return (
                <Column onClick={this.onClick}>
                    {this.props.active ? <div style={{background: "darkRed", color:"white"}}>{this.props.name}</div>: <div>{this.props.name}</div>}
                </Column>
            )
        }
        return (
            <Row>
                <Column onClick={this.onClick}>
                    {this.props.active ? <div style={{background: "darkRed", color:"white"}}>{this.props.name}</div>: <div>{this.props.name}</div>}
                </Column>
                <Column onClick={this.onClick}>
                    {this.props.children.map((o, i) => <Option key= {i}name={o.name || o} children={o.children} active={o.active} reset={this.props.reset}/> )}
                </Column>
            </Row>
        )
    }
}

//Player is the only subject
class EventPicker extends Component {
    constructor(props) {
        super();
        this.state = {
            tree: EVENT_TREE,
            eventChoice: []
        }
        this.reset = this.reset.bind(this);
        this.giveEvent = this.giveEvent.bind(this);
    }
    reset(eventChoice){
        this.setState({
            tree:EVENT_TREE,
            eventChoice: eventChoice
        })
    }
    giveEvent() {
        //TODO DANIEL
        // this.props.danielsFunction();
    }
    render() {
        return (
            <Row>
                <Column>
                    <Option name={this.state.tree.name} children={this.state.tree.children} active={this.state.tree.active} reset={this.reset} />
                </Column>
                <Button variant="contained"
                        size="small" color="primary"
                        onClick={this.giveEvent}>
                    OK
                </Button>
            </Row>

        )
    }
}
const Column = styled.section `
    //margin:1rem;
    min-width: 8vw;
    display:flex;
    text-align: center;
    flex-direction: column;
`;
const Row = styled.section `
    display:flex;
    flex-direction: row;
`;


export default EventPicker