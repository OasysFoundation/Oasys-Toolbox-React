import React, {Component} from 'react';
import ReactMaterialSelect from 'react-material-select';
import Button from '@material-ui/core/Button';
import gameMetaData from "./gameMetaData"
import globals from "./globals"
import Tooltip from '@material-ui/core/Tooltip'

class GameEdit extends Component {
    constructor({location}, props) {
        super();
        // this.onChooseModule = this.onChooseModule.bind(this);
        this.onChooseGame = this.onChooseGame.bind(this);
        this.updateEditor = this.updateEditor.bind(this);
        this.state = {
            chosen: !!props.value
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            chosen: !!nextProps.value
        })
    }

    onChooseGame(index) {
        const game = gameMetaData[index];
        this.setState({
            chosen: true
        }, () => this.updateEditor(game, {type: globals.GAME}))

    }

    updateEditor(slide) {
        console.log("SLLLIIIDEEM  ", slide)
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
                {this.state.chosen ?
                    (<section>
                        <Button variant="flat" color="primary" onClick={() => this.setState({chosen: false})}> Choose
                            Different Game </Button>
                        <img src={this.props.value.thumbnail}
                             style={{width: this.props.width || w, height: this.props.height || h}}/>
                        <figcaption style={{padding: 1 + "rem"}}>{this.props.value.description}</figcaption>
                        <Button variant="flat" color="primary" onClick={this.handleTryOut.bind(this)}> Try Out </Button>
                    </section>)

                    : <ChooseGameGrid choose={this.onChooseGame}/>
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

    return (<section style={flexer}>
            {gameMetaData.map((item, idx) =>
                (<div key={idx} onClick={() => props.choose(idx)} style={{cursor: "pointer"}}>
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
