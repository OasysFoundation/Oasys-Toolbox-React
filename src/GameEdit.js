import React, {Component} from 'react';
import ReactMaterialSelect from 'react-material-select';
import Button from '@material-ui/core/Button';
import gameMetaData from "./gameMetaData"

class GameEdit extends Component {
    constructor({location}, props) {
        super();
        this.state = {
            selectedIdx: gameMetaData[0],
            selectedGame: gameMetaData[0]
        };
        // this.onChange = this.props.onChange.bind(this);
        this.onChooseModule = this.onChooseModule.bind(this);
    }

    onChooseModule(value) {
        this.setState({
            selectedIdx: value.value,
            selectedGame: gameMetaData[value.value] || gameMetaData[0]
        })
        // this.onChange();
    }
    handleTryOut() {
        window.open(`/games/${this.state.selectedGame.name}`);
    }

    render() {
        //set Ratios of Thumbnail
        const w = window.innerWidth * 0.5;
        const h = w / 4 * 2.5;

        return (
            <div id='gameRenderer'>
                <ReactMaterialSelect label="Choose a Simulation!" onChange={this.onChooseModule}>
                    {gameMetaData.map((item, idx) =>
                        <option dataValue={idx}> {item.primaryText} </option>
                    )}
                </ReactMaterialSelect>
                <img src={this.state.selectedGame.thumbnail}
                     style={{width: this.props.width || w, height: this.props.height || h}}/>
                <figcaption>{this.state.selectedGame.description}</figcaption>
                <Button variant="flat" color="primary" style={{backGround: "orange"}} onClick={this.handleTryOut.bind(this)}> Try Out </Button>
            </div>
        )
    }
}

export default GameEdit;
