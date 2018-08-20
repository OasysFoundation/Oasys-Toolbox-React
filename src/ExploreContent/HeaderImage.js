import React, {Component} from 'react';
import {Button} from 'reactstrap'
import Media from "react-media";

import colors, {hexToRgba} from '../colors';

//images
import cover from '../assets/images/Cover.jpg'
import coverMobile from '../assets/images/coverMid.png'
import coverTiny from '../assets/images/coverTiny.png'

const styles = {
    mainContainer: {
        minWidth: 0,
        marginBottom: "16px",
        position: "relative",
        display: "flex",
        justifyContent: "center",
    },
    backgroundImage: {
        width: "auto",
        maxHeight: "475px",
        maxWidth: "100%",
    },
    floatingAbsoluteContainer: {
        position: "absolute",
        top: "1em",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "90%",
    },
    titleAndSubtitle: {
        flex: "5",
        display: "flex",
        flexDirection: "column",
        height: "auto",
    },
    bottomButtonDiv: {
        flex: "1",
        display: "flex",
        justifyContent: "center",
        height: "50%",
    },
    bottomButton: {
        height: '50%',
        fontSize: "1.3rem",
        color: colors.RUST,
        fontFamily: 'HelveticaNeue-Bold',
        backgroundColor: colors.SNOW1,
        border: '2px solid ' + colors.SNOW2,
        boxShadow: '0px 0px 20px 1px #555555',
    },
    title: {
        display: "flex",
        justifyContent: "center",
        color: colors.SNOW1,
        WebkitTextStroke: '1px ' + colors.SPANISHWHITE,
        textStroke: '1px ' + colors.SPANISHWHITE,
        fontFamily: 'HelveticaNeue-Light',
        textAlign: "center",
        marginTop: "6vw",
        textShadow: '0px 0px 20px #000000',
        paddingTop: '10px',
    },
    subtitle: {
        color: colors.SNOW1,
        WebkitTextStroke: '1px ' + colors.SPANISHWHITE,
        textStroke: '1px ' + colors.SPANISHWHITE,
        fontFamily: 'HelveticaNeue-Light',
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        textShadow: '0px 0px 20px #000000',
        paddingTop: '10px',
    },

}

class HeaderImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageLoading: true,
        };
    }

    handleImageLoaded() {
        this.setState({
            imageLoading: false
        });
    }

    openCreate() {
        window.location.href = "/create"
    }

    getPCScreenImage(value) {
        let myFontSizeTitle = "2.5rem";
        let myFontSizeSubTitle = "1.8rem";
        let currentCover = coverMobile;

        if (value === "tiny") {
            myFontSizeTitle = "2.5rem";
            myFontSizeSubTitle = "1.8rem";
            currentCover = coverTiny;
        }
        else if (value === "medium") {
            myFontSizeTitle = "3.0rem";
            myFontSizeSubTitle = "2.0rem";
            currentCover = cover;
        }
        else if (value === "large") {
            myFontSizeTitle = "3.0rem"
            myFontSizeSubTitle = "2.0rem"
            currentCover = cover;
        }

        return (
            <div style={styles.mainContainer}>

                <img src={currentCover} onLoad={this.handleImageLoaded.bind(this)} style={styles.backgroundImage}/>

                {this.state.imageLoading
                    ? "Loading..."
                    : (
                        <div style={styles.floatingAbsoluteContainer}>
                            <div style={styles.titleAndSubtitle}>
                                <div style={styles.title}>
                                    <h1 style={{fontSize: myFontSizeTitle, fontVariant: 'small-caps'}}>Explore
                                        Interactive Content</h1>
                                </div>
                                ​​​​​​​
                                <div style={styles.subtitle}>
                                    <h2 style={{fontSize: myFontSizeSubTitle}}>Learn Science and Technology through
                                        Experimentation and Play</h2>
                                </div>
                            </div>
                            <div style={styles.bottomButtonDiv}>
                               
                            </div>
                        </div>
                    )
                }

            </div>
        )
    }

    renderMobileHeader() {
        let myFontSizeTitle = "7vw";
        let myFontSizeSubTitle = "5vw";
        return (
            <div style={styles.mainContainer}>
                <img src={coverTiny} onLoad={this.handleImageLoaded.bind(this)} style={styles.backgroundImage}/>
                {this.state.imageLoading
                    ? "Loading..."
                    : (
                        <React.Fragment>
                            <div style={styles.floatingAbsoluteContainer}>
                                <div style={styles.titleAndSubtitle}>
                                    <div style={styles.title}>
                                        <h1 style={{fontSize: myFontSizeTitle}}>Explore Interactive Content</h1>
                                    </div>
                                    ​​​​​​​
                                    <div style={styles.subtitle}>
                                        <h2 style={{fontSize: myFontSizeSubTitle}}>Learn Science and Technology through
                                            Experimentation and Play</h2>
                                    </div>
                                </div>
                                <div style={styles.bottomButtonDiv}>
                                </div>
                            </div>
                            
                        </React.Fragment>

                    )
                }
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.props.type === "mobile"
                    ? this.renderMobileHeader()
                    : (
                        <div>
                            <Media
                                query="(max-width: 624px)"
                                render={() => this.getPCScreenImage("tiny")}
                            />
                            <Media
                                query="(min-width: 625px) and (max-width: 999px)"
                                render={() => this.getPCScreenImage("small")}
                            />
                            <Media
                                query="(min-width: 1000px) and (max-width: 1283px)"
                                render={() => this.getPCScreenImage("medium")}
                            />
                            <Media
                                query="(min-width: 1284px)"
                                render={() => this.getPCScreenImage("large")}
                            />
                        </div>
                    )

                }
            </div>
        )
    }

}

export default HeaderImage;


		