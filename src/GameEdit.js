import React, {Component} from 'react';
import ReactMaterialSelect from 'react-material-select';
import Button from '@material-ui/core/Button';
import gameMetaData from "./gameMetaData"
import globals from "./globals"

class GameEdit extends Component {
    constructor({location}, props) {
        super();
        this.onChooseModule = this.onChooseModule.bind(this);
    }

    onChooseModule(value) {
        const slide = Object.assign(gameMetaData[value.value], {type: globals.GAME})
        this.props.onChange(slide);
    }
    handleTryOut() {
        window.open(`/games/${this.props.value.name}`);
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
                <img src={this.props.value.thumbnail}
                     style={{width: this.props.width || w, height: this.props.height || h}}/>
                <figcaption>{this.props.value.description}</figcaption>
                <Button variant="flat" color="primary" onClick={this.handleTryOut.bind(this)}> Try Out </Button>
            </div>
        )
    }
}

export default GameEdit;
