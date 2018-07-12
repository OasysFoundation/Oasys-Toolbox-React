import React, {Component} from 'react';
import ReactMaterialSelect from 'react-material-select';
import Button from '@material-ui/core/Button';
import gameMetaData from "./gameMetaData"
import globals from "./globals"
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField';

class GameEdit extends Component {
    constructor({location}, props) {
        super();
        this.onChooseGame = this.onChooseGame.bind(this);
        this.submitNewGame = this.submitNewGame.bind(this);
        this.state = {
            chosen: !!props.value
        }
        this.textInput = React.createRef();

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            chosen: !!nextProps.value
        })
    }

    onChooseGame(game) {
        this.setState({
            chosen: true
        }, () => this.props.onChange(game, {type: globals.GAME}))

    }

    handleTryOut() {
        window.open(`/games/${this.props.value.name}`);
    }
    submitNewGame() {
        const url = this.textInput.current.value;
        console.log(this.textInput);
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
            <div id='gameRenderer'>
                {this.state.chosen ?
                    (<section>
                        <Button variant="flat" color="primary" onClick={() => this.setState({chosen: false})}> Choose
                            Different Game </Button>
                        <img src={this.props.value.thumbnail}
                             style={{width: this.props.width || w, height: this.props.height || h}}/>
                        <figcaption style={{padding: 1 + "rem"}}>{this.props.value.description}</figcaption>
                        <Button variant="flat" color="primary" onClick={this.handleTryOut.bind(this)}> Try Out </Button>
                    </section>)

                    :
                    (<div>
                        {/*<TextField*/}
                            {/*id="with-placeholder"*/}
                            {/*label="Embed Simulation from URL"*/}
                            {/*placeholder="Your URL goes here"*/}
                            {/*margin="normal"*/}
                            {/*ref={this.textInput}*/}
                        {/*/>*/}
                        <input
                            ref={this.textInput} label="...add URL to embed your own Simulation" />
                        <Button variant="flat" color="primary" onClick={this.submitNewGame}>Submit</Button>

                        <ChooseGameGrid choose={this.onChooseGame}/>
                    </div>)
                }
            </div>
        )
    }
}


const ChooseGameGrid = props => {
    const width = window.innerWidth * 2 / 3;
    const flexer = {
        display: "flex",
        flexGrow: 1,
        flexWrap: "wrap",
        flexDirection: "row",
        width: width
    }

    return (
        <section style={flexer}>
            {gameMetaData.map((item, idx) =>
                (<div key={idx} onClick={() => props.choose(item)} style={{cursor: "pointer"}}>
                        <Tooltip fontSize={20} id="tooltip-fab" title={item.description}>
                            <img src={item.thumbnail} width={width / 3} style={{padding: 1 + "rem"}}/>
                        </Tooltip>
                    </div>
                )
            )}
        </section>
    )
}

export default GameEdit;
