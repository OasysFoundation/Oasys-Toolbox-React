import React, {Component} from 'react';
import globals from "../globals"


class EmbedEdit extends Component {

    constructor({location}, props) {
        super();
        this.onChooseGame = this.onChooseGame.bind(this);
        this.submitNewGame = this.submitNewGame.bind(this);
        this.textInput = React.createRef();

        this.state = {
            isChoosing: false
        }
    }
    onChooseGame(embeddable) {
        this.setState({isChoosing: false});
        this.props.onChange(embeddable, {type: globals.EMBED})
    }

    handleTryOut() {
        window.open(`/games/${this.props.value.name}`);
    }

    submitNewGame() {
        const url = this.textInput.current.value;
        const game = {
            name: "testGame",
            url: url,
            primaryText: 'Test',
            description: "test",
            thumbnail: null
        }
        this.onChooseGame(game)
    }

    render() {
        //set Ratios of Thumbnail
        const w = window.innerWidth * 0.5;
        const h = w / 4 * 2.5;
        return (
            <div className='embed-edit'>
            {this.props.data.provider} <br/>
            {this.props.data.url}
            </div>
        )
    }
}


export default EmbedEdit;