import React, {Component} from 'react';
import {Button} from 'reactstrap'
import Media from "react-media";

import colors, {hexToRgba} from '../utils/colors';

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
    floatingContainer: {
        position: "absolute",
        top: "1em",
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
        alignItems: "center",
        height: "50%",
        paddingTop:"20vh"
    },
    bottomButton: {
        height: '50%',
        fontSize: "1.3rem",
        color: colors.RUST,
        fontFamily: 'Charter-Bold',
        backgroundColor: colors.SNOW1,
        border: '2px solid ' + colors.SNOW2,
        boxShadow: '0px 0px 20px 1px #555555',
    },
    title: {
        justifyContent: "center",
        textAlign: "center",
        marginTop: "6vw",
        paddingTop: '10px',
        backgroundColor: hexToRgba(colors.RUST, 0.5),
        textShadow: '0px 0px 3px #6f2002',
    },
    subtitle: {
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: '10px',
    },
    titleFont: {
        fontFamily: 'Charter-Bold',
        fontSize: "2.5rem", 
        fontWeight: '400',
        padding: '10px 20px',
        color: colors.SNOW1,
    },
    subtitleFont: {
        fontFamily: 'Charter-Bold',
        fontSize: '1.8rem',
        fontWeight: '400',
        padding: '10px 20px',
        color: colors.SNOW1,
    }
}

class HeaderImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageLoading: true,
            windowWidth: window.innerWidth,
        };
    }

    handleImageLoaded() {
        this.setState({
            imageLoading: false,
        });
    }

    openCreate() {
        window.location.href = "/create"
    }

    getPCScreenImage(value) {
        let currentCover = coverMobile;
        let titleFontSize = "2.5rem";
        let subtitleFontSize = "1.8rem";
        if (value === "tiny") {
            titleFontSize = "2.0rem";
            subtitleFontSize = "1.5rem";
            currentCover = coverTiny;
        }
        else if (value === "medium") {
            titleFontSize = "3.0rem";
            subtitleFontSize = "2.0rem";
            currentCover = cover;
        }
        else if (value === "large") {
            titleFontSize = "3.0rem";
            subtitleFontSize = "2.0rem";
            currentCover = cover;
        }

        return (
            <div style={styles.mainContainer}>

                <img src={currentCover} alt="cover" onLoad={this.handleImageLoaded.bind(this)} style={styles.backgroundImage}/>

                {this.state.imageLoading
                    ? "Loading..."
                    : (
                        <div style={styles.floatingContainer}>
                            <div style={styles.title}>
                                <h1 style={styles.titleFont}>
                                    <span style={{fontSize: titleFontSize}}>
                                        Explore Interactive Content
                                    </span>
                                </h1>
                                <h2 style={styles.subtitleFont}>
                                    <span style={{fontSize: subtitleFontSize}}>
                                        Learn Science and Technology through Experimentation and Play
                                    </span>
                                </h2>
                            </div>
                            <div style={styles.bottomButtonDiv}>
                                <Button size="lg" color="light" onClick={this.openCreate} style={{display:"flex", alignItems:"cener"}}> Create your own content!</Button>

                            </div>
                        </div>
                    )
                }

            </div>
        )
    }

    renderMobileHeader() {
        let titleFontSize = "7vw";
        let subtitleFontSize = "5vw";
        return (
            <div style={styles.mainContainer}>
                <img src={coverTiny} alt="cover" onLoad={this.handleImageLoaded.bind(this)} style={styles.backgroundImage}/>
                {this.state.imageLoading
                    ? "Loading..."
                    : (
                        <React.Fragment>
                            <div style={styles.floatingContainer}>
                                <div style={styles.title}>
                                    <h1 style={styles.titleFont}>
                                        <span style={{fontSize: titleFontSize}}>
                                            Explore Interactive Content
                                        </span>
                                    </h1>
                                    <h2 style={styles.subtitleFont}>
                                        <span style={{fontSize: subtitleFontSize}}>
                                            Learn Science and Technology through Experimentation and Play
                                        </span>
                                    </h2>
                                </div>
                                <div style={styles.bottomButtonDiv}>
                                    <Button size="lg" color="light" onClick={this.openCreate} style={{display:"flex", alignItems:"center"}}> Create your own content!</Button>
                                </div>
                            </div>
                            
                        </React.Fragment>

                    )
                }
            </div>
        )
    }

    shouldComponentUpdate(nextProps) {
        // prevent unnecessary re-renders
        return false;
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


		