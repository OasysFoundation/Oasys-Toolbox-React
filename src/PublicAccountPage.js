import React, {Component} from 'react';
import HorizontalScroll from './ExploreContent/HorizontalScroll'
import api from './utils/api'
import {getTagsForCategory} from "./utils/LandingPage";
import ScrollableAnchor from 'react-scrollable-anchor'
import * as auth from './Authentication/auth';
import history from './history'

import {connect} from "redux-zero/react";

import {Button} from 'reactstrap';
import colors from './utils/colors';


const styles = {
    HorizontalScrollOuterCenterContainer: {
        display: "flex",
        justifyContent: "center",
    },
    HorizontalScrollContainer: {
        width: "100%",
        maxWidth: "900px",
    },
    HorizontalScrollTitle:{
        fontSize:"1.5rem",
        fontFamily: "Charter-Bold,-apple-system, sans-serif",
    },
    HRDividingLine:{
        marginTop: "0",
        borderColor: colors.GULLGREY,
        width:"100%",
        marginRight:"100%",
    },
}

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredContent: [{
                title: "Loading"
            }],
            pageData: [],
            noContent:true,
        };

        this.loadAccountPage = this.loadAccountPage.bind(this);


    }

    componentDidMount() {
        //User Contents
        const {uid} = this.props.match.params;

        try {
             api.getUsersPublicContentsPreview(uid)
                .then(json => {
                    if (json && json.length) {
                        this.setState({
                                content: json || "errorLoadingContent"
                            },
                            () => this.setState({
                                    filteredContent: json,
                                },
                                () => this.setState({
                                     pageData: [
                                        {
                                            title: "Physics",
                                            data: this.state.filteredContent.filter(this.correctCategory("Physics")),
                                        },
                                        {
                                            title: "Chemistry",
                                            data: this.state.filteredContent.filter(this.correctCategory("Chemistry")),
                                        },
                                        {
                                            title: "Computer Science Fundamentals",
                                            data: this.state.filteredContent.filter(this.correctCategory("Computer Science Fundamentals")),
                                        },
                                        {
                                            title: "Mathematics",
                                            data: this.state.filteredContent.filter(this.correctCategory("Mathematics")),
                                        },
                                        {
                                            title: "Machine Learning",
                                            data: this.state.filteredContent.filter(this.correctCategory("Machine Learning")),
                                        },
                                        {
                                            title: "iOS",
                                            data: this.state.filteredContent.filter(this.correctCategory("iOS")),
                                        },
                                        {
                                            title: "Blockchain",
                                            data: this.state.filteredContent.filter(this.correctCategory("Blockchain")),
                                        },
                                        {
                                            title: "Smart Contracts",
                                            data: this.state.filteredContent.filter(this.correctCategory("Smart Contracts")),
                                        },
                                        {
                                            title: "Web Dev",
                                            data: this.state.filteredContent.filter(this.correctCategory("Web Dev")),
                                        },
                                    ],
                                    noContent:false,
                                }))
                        )
                    }
                    else
                        console.log("Mhh there is something strange going on. Email us at info@joinoasys.org if this continues!")
                })
        }
        catch (e){
            console.log(e)
        }
    }

    //function in function to pass extra argument to filter function
    correctCategory(category) {
        function stringHasSubstring(str, substr) {
            if (!str || !substr)
                return
            let returnVar = false;
            for(let i = 0; i < str.length; i++){
                if(str[i].toLowerCase().includes(substr.toLowerCase()))
                    returnVar = true;
            }
            return returnVar 
        }

        return function (element) {
            const keywords = getTagsForCategory(category);
            return keywords.filter(kw => stringHasSubstring(element.tags, kw)).length ? element : null
        }

    }

    checkMobile() {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    createHorizontalScrollers(value){
        if(value === "mobile")
            return(
                <div>
                    {this.state.pageData.map(dataObj =>
                        < HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data} type = "mobile" / >
                        )
                    }
                </div>
            )
        else
            return(
                <div>
                    {this.state.pageData.map(dataObj =>
                            < HorizontalScroll key = {dataObj.title} title = {dataObj.title} data = {dataObj.data}/ >
                            )
                    }
                </div>
            )
    }

    loadAccountPage(){
        return(
            <div>
                <section style={styles.HorizontalScrollOuterCenterContainer}>
                    <div style={styles.HorizontalScrollContainer}>
                        <br/>
                        <ScrollableAnchor id={'searchResults'}>
                            <div>
                                {this.checkMobile()
                                    ? this.createHorizontalScrollers("mobile")
                                    : this.createHorizontalScrollers("pc")
                                }
                            </div>
                        </ScrollableAnchor>
                    </div>
                </section>
            </div>
        )
    }

    render() {
        const {username} = this.props.match.params
        return (
            <div>
                <section className="bg-light rz-start rz-no-border-special-2" id="about" style={{paddingTop:"100px"}}>
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-10 mx-auto">
                        <div style={styles.HorizontalScrollTitle}>
                        {username + "'s Content"}
                        <hr style={styles.HRDividingLine}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  { this.state.noContent
                     ? null
                     : this.loadAccountPage()
                  }
                </section>
            </div>
        )
    }
}

const mapStoreToProps = ({user}) => ({user});
const neededActions = {};

export default connect(mapStoreToProps, neededActions)(AccountPage);