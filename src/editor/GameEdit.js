import React, {Component} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';

import {buttonGradientCSS} from '../stylings';
import {CoolPinkButton} from '../stylings'
import gameMetaData from "../gameMetaData"
import globals from "../globals"


class GameEdit extends Component {
    constructor({location}, props) {
        super();
        this.onChooseGame = this.onChooseGame.bind(this);
        this.submitNewGame = this.submitNewGame.bind(this);
        this.textInput = React.createRef();

        this.state = {
            isChoosing: false
        }
    }
    onChooseGame(game) {
        this.setState({isChoosing: false});
        this.props.onChange(game, {type: globals.GAME})
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
        const that  = this;
        return (
            <Card style={{marginLeft: "2em", marginRight: '2em', padding: '1rem'}}>
                <div id='gameRenderer'>
                {this.props.value && !that.state.isChoosing ?
                    (<section>
                        <CoolPinkButton style={buttonGradientCSS} variant="flat" color="primary" onClick={() => that.setState({isChoosing: true})}> Choose
                            Different Game </CoolPinkButton>
                            <img src={this.props.value ? this.props.value.thumbnail : ""} alt=""
                             style={{width: this.props.width || w, height: this.props.height || h}}/>
                        <figcaption style={{padding: 1 + "rem"}}>{this.props.value ? this.props.value.description : ""}</figcaption>
                        <CoolPinkButton style={buttonGradientCSS} variant="flat" color="primary" onClick={this.handleTryOut.bind(this)}> Try Out </CoolPinkButton>
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
                        <CoolPinkButton style={buttonGradientCSS} variant="flat" color="primary" onClick={this.submitNewGame}>Submit</CoolPinkButton>

                        <ChooseGameGrid choose={this.onChooseGame}/>
                    </div>)
                }
            </div>
            </Card>
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
                            <img src={item.thumbnail} width={width / 3} style={{padding: 1 + "rem"}} alt=""/>
                        </Tooltip>
                    </div>
                )
            )}
        </section>
    )
}

export default GameEdit;
