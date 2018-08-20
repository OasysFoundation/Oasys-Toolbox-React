import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './HorizontalScroll.css';
import HorizontalScrollButtonMaker from './HorizontalScrollButtonMaker'


const styles={
    HorizontalScrollContainer:{
        padding:"10px 10px 10px 10px",
    },
    HorizontalScrollTitle:{
        fontSize:"1.3rem",
        fontFamily: "HelveticaNeue-Light,-apple-system, sans-serif",
    },
    HRDividingLine:{
        height:"1px", 
        border: "none", 
        marginTop:"0",
    }
}

const underlineOnSelectionColours = {
            0: "#2a9699",
        }

class HorizontalScroll extends Component {
    constructor(props) {
        super(props);

        //Create Unique Ids for each core element in horizontal scroller
        let pnProductNav = "pnProductNav" + this.props.id;
        let pnProductNavContents = "pnProductNavContents" + this.props.id;
        let pnIndicator = "pnIndicator" + this.props.id;
        let pnAdvancerLeft = "pnAdvancerLeft" + this.props.id;
        let pnAdvancerRight = "pnAdvancerRight" + this.props.id;

        //Create a Ref to the core elements so we can access DOM node
        this.pnProductNav = React.createRef();
        this.pnProductNavContents = React.createRef();
        this.pnIndicator = React.createRef();
        this.pnAdvancerLeft = React.createRef();
        this.pnAdvancerRight = React.createRef();

        this.state = {
            firstLoad:true,
        }
    }

    componentDidMount(){
        let SETTINGS = {
            navBarTravelling: false,
            navBarTravelDirection: "",
            navBarTravelDistance: 150,
        }

        let loaded = false;
        let needRefresh = false;

        //Remove the underlying default scroller
        document.documentElement.classList.remove("no-js");
        document.documentElement.classList.add("js");

        // get React Refs
        let pnAdvancerLeft = this.pnAdvancerLeft.current;
        let pnAdvancerRight = this.pnAdvancerRight.current;
        let pnIndicator = this.pnIndicator.current;
        let pnProductNav = this.pnProductNav.current;
        let pnProductNavContents = this.pnProductNavContents.current;

        if(pnAdvancerLeft && pnAdvancerRight && pnIndicator && pnProductNav && pnProductNavContents && this.state.firstLoad){
            loaded=true;
            this.setState({
                firstLoad:false,
            });
        }
        else{
            loaded=false;
        }

        if (loaded){
            pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));

            // Set the indicator
            this.props.title=="Tiles"
            ? moveIndicator(pnProductNav.querySelector("[aria-selected=\"true\"]"), underlineOnSelectionColours[0])
            : null

            // Handle the scroll of the horizontal container
            var last_known_scroll_position = 0;
            var ticking = false;
        }

        function doSomething(scroll_pos) {
            pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
        }

        if (loaded){
            pnProductNav.addEventListener("scroll", function() {
                last_known_scroll_position = window.scrollY;
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        doSomething(last_known_scroll_position);
                        ticking = false;
                    });
                }
                ticking = true;
            });


            pnAdvancerLeft.addEventListener("click", function() {
                // If in the middle of a move return
                if (SETTINGS.navBarTravelling === true) {
                    return;
                }
                // If we have content overflowing both sides or on the left
                if (determineOverflow(pnProductNavContents, pnProductNav) === "left" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
                    // Find how far this panel has been scrolled
                    var availableScrollLeft = pnProductNav.scrollLeft;
                    // If the space available is less than two lots of our desired distance, just move the whole amount
                    // otherwise, move by the amount in the settings
                    if (availableScrollLeft < SETTINGS.navBarTravelDistance * 2) {
                        pnProductNavContents.style.transform = "translateX(" + availableScrollLeft + "px)";
                    } else {
                        pnProductNavContents.style.transform = "translateX(" + SETTINGS.navBarTravelDistance + "px)";
                    }
                    // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
                    pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
                    // Update our settings
                    SETTINGS.navBarTravelDirection = "left";
                    SETTINGS.navBarTravelling = true;
                }
                // Now update the attribute in the DOM
                pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
            });

            pnAdvancerRight.addEventListener("click", function() {
                // If in the middle of a move return
                if (SETTINGS.navBarTravelling === true) {
                    return;
                }
                // If we have content overflowing both sides or on the right
                if (determineOverflow(pnProductNavContents, pnProductNav) === "right" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
                    // Get the right edge of the container and content
                    var navBarRightEdge = pnProductNavContents.getBoundingClientRect().right;
                    var navBarScrollerRightEdge = pnProductNav.getBoundingClientRect().right;
                    // Now we know how much space we have available to scroll
                    var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
                    // If the space available is less than two lots of our desired distance, just move the whole amount
                    // otherwise, move by the amount in the settings
                    if (availableScrollRight < SETTINGS.navBarTravelDistance * 2) {
                        pnProductNavContents.style.transform = "translateX(-" + availableScrollRight + "px)";
                    } else {
                        pnProductNavContents.style.transform = "translateX(-" + SETTINGS.navBarTravelDistance + "px)";
                    }
                    // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
                    pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
                    // Update our settings
                    SETTINGS.navBarTravelDirection = "right";
                    SETTINGS.navBarTravelling = true;
                }
                // Now update the attribute in the DOM
                pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
            });

            pnProductNavContents.addEventListener(
                "transitionend",
                function() {
                    // get the value of the transform, apply that to the current scroll position (so get the scroll pos first) and then remove the transform
                    var styleOfTransform = window.getComputedStyle(pnProductNavContents, null);
                    var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
                    // If there is no transition we want to default to 0 and not null
                    var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
                    pnProductNavContents.style.transform = "none";
                    pnProductNavContents.classList.add("pn-ProductNav_Contents-no-transition");
                    // Now lets set the scroll position
                    if (SETTINGS.navBarTravelDirection === "left") {
                        pnProductNav.scrollLeft = pnProductNav.scrollLeft - amount;
                    } else {
                        pnProductNav.scrollLeft = pnProductNav.scrollLeft + amount;
                    }
                    SETTINGS.navBarTravelling = false;
                },
                false
            );
        }

        // Handle setting the currently active link
        if(loaded)
            pnProductNavContents.addEventListener("click", function(e) {
                var links = [].slice.call(document.querySelectorAll(".pn-ProductNav_Link"));
                links.forEach(function(item) {
                    item.setAttribute("aria-selected", "false");
                })
                e.target.setAttribute("aria-selected", "true");
                // Pass the clicked item and it's colour to the move indicator function
                moveIndicator(e.target, underlineOnSelectionColours[links.indexOf(e.target)]);
            });

        // var count = 0;
        function moveIndicator(item, color) {
            var textPosition = item.getBoundingClientRect();
            var container = pnProductNavContents.getBoundingClientRect().left;
            var distance = textPosition.left - container;
             var scroll = pnProductNavContents.scrollLeft;
            pnIndicator.style.transform = "translateX(" + (distance + scroll) + "px) scaleX(" + textPosition.width * 0.01 + ")";
            // count = count += 100;
            // pnIndicator.style.transform = "translateX(" + count + "px)";
            
            if (color) {
                pnIndicator.style.backgroundColor = color;
            }
        }

        function determineOverflow(content, container) {
            var containerMetrics = container.getBoundingClientRect();
            var containerMetricsRight = Math.floor(containerMetrics.right);
            var containerMetricsLeft = Math.floor(containerMetrics.left);
            var contentMetrics = content.getBoundingClientRect();
            var contentMetricsRight = Math.floor(contentMetrics.right);
            var contentMetricsLeft = Math.floor(contentMetrics.left);
             if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
                return "both";
            } else if (contentMetricsLeft < containerMetricsLeft) {
                return "left";
            } else if (contentMetricsRight > containerMetricsRight) {
                return "right";
            } else {
                return "none";
            }
        }

        /**
         * @fileoverview dragscroll - scroll area by dragging
         * @version 0.0.8
         * 
         * @license MIT, see http://github.com/asvd/dragscroll
         * @copyright 2015 asvd <heliosframework@gmail.com> 
         */



            var _window = window;
            var _document = document;
            var mousemove = 'mousemove';
            var mouseup = 'mouseup';
            var mousedown = 'mousedown';
            var EventListener = 'EventListener';
            var addEventListener = 'add'+EventListener;
            var removeEventListener = 'remove'+EventListener;
            var newScrollX, newScrollY;

            var dragged = [];
            var reset = function(i, el) {
                for (i = 0; i < dragged.length;) {
                    el = dragged[i++];
                    el = el.container || el;
                    el[removeEventListener](mousedown, el.md, 0);
                    _window[removeEventListener](mouseup, el.mu, 0);
                    _window[removeEventListener](mousemove, el.mm, 0);
                }

                // cloning into array since HTMLCollection is updated dynamically
                dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
                for (i = 0; i < dragged.length;) {
                    (function(el, lastClientX, lastClientY, pushed, scroller, cont){
                        (cont = el.container || el)[addEventListener](
                            mousedown,
                            cont.md = function(e) {
                                if (!el.hasAttribute('nochilddrag') ||
                                    _document.elementFromPoint(
                                        e.pageX, e.pageY
                                    ) == cont
                                ) {
                                    pushed = 1;
                                    lastClientX = e.clientX;
                                    lastClientY = e.clientY;

                                    e.preventDefault();
                                }
                            }, 0
                        );

                        _window[addEventListener](
                            mouseup, cont.mu = function() {pushed = 0;}, 0
                        );

                        _window[addEventListener](
                            mousemove,
                            cont.mm = function(e) {
                                if (pushed) {
                                    (scroller = el.scroller||el).scrollLeft -=
                                        newScrollX = (- lastClientX + (lastClientX=e.clientX));
                                    scroller.scrollTop -=
                                        newScrollY = (- lastClientY + (lastClientY=e.clientY));
                                    if (el == _document.body) {
                                        (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                        scroller.scrollTop -= newScrollY;
                                    }
                                }
                            }, 0
                        );
                     })(dragged[i++]);
                }
            }

              
            if (_document.readyState == 'complete') {
                reset();
            } else {
                _window[addEventListener]('load', reset, 0);
            }
    }

    getHorizontalScrollers(){
        //Using External CSS stylesheet
        return(
            <div className="parent">
                <div className="pn-ProductNav_Wrapper">
                    <nav ref={this.pnProductNav} id="pnProductNav" className="pn-ProductNav">    
                        <div ref={this.pnProductNavContents} id="pnProductNavContents" className="pn-ProductNav_Contents">
                            {this.props.data.map((myData)=>{
                                    return (<HorizontalScrollButtonMaker data={myData} type={this.props.title} positionChange={this.props.positionChange} icon={this.props.icon}/>)
                                })}
                                
                            <span ref={this.pnIndicator} id="pnIndicator" className="pn-ProductNav_Indicator"></span>
                        </div>
                    </nav>
                    <button ref={this.pnAdvancerLeft} id="pnAdvancerLeft" className="pn-Advancer pn-Advancer_Left" type="button">
                        <svg className="pn-Advancer_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 1024"><path d="M445.44 38.183L-2.53 512l447.97 473.817 85.857-81.173-409.6-433.23v81.172l409.6-433.23L445.44 38.18z"/></svg>
                    </button>
                    <button ref={this.pnAdvancerRight} id="pnAdvancerRight" className="pn-Advancer pn-Advancer_Right" type="button">
                        <svg className="pn-Advancer_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 1024"><path d="M105.56 985.817L553.53 512 105.56 38.183l-85.857 81.173 409.6 433.23v-81.172l-409.6 433.23 85.856 81.174z"/></svg>
                    </button>
                </div>
            </div>
        )
    }

    render(){
        return(
            <div style={styles.HorizontalScrollContainer} className="horizontal-scroll">
                <div style={styles.HorizontalScrollTitle}>
                    {
                        this.props.title && this.props.title=="Tiles"
                        ? "Popular Topics"
                        : this.props.title

                    }
                    <hr color="black" style={styles.HRDividingLine}/>
                </div>
                {this.getHorizontalScrollers()}
                {this.props.title!="Tiles"
                    ? (
                        this.props.type==="mobile"
                            ? <br/>
                            : (
                                <div>
                                    <br/>
                                    <br/>
                                </div>
                            )
                    )
                    : <br/>
                    
                }
            </div>
            )
    }
}

export default HorizontalScroll;