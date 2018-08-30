import React from 'react';
import Media from "react-media";
import Select from 'react-select';
import api from './utils/api'

import Logo from './assets/images/brand/oasys_logo_big.png'
import Logo_Small from './assets/images/brand/oasys_logo_small.png'

import {connect} from "redux-zero/react";
// import actions from "./store/actions";
//import {auth} from "./Authentication/firebase";

// Styling
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

import history from './history'

import { isMobile } from './utils/tools'


const ITEMDICT = [
    {link: '/explore', icon: 'fa-lightbulb', label: 'Learn'},
    {link: '/create', icon: 'fa-pencil-alt', label: 'Create'},
    {link: '/data', icon: 'fa-chart-bar', label: 'Analytics'},
    {link: '/about', icon: 'fa-info-circle', label: 'About'},
    {link: '/auth', icon: 'fa-user', label: 'Login'}
];


const styles = {
    navbarNavItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0px 8px 0px 8px",
        color: "​​​​​​​#3E4B54",
        fontSize: "1.0rem",
        cursor: 'pointer',
        marginTop: '5px',
    },
    navbarNavLinkForImage: {
        padding: "0px 0px 0px 0px",
    },
    navbarNavImage: {
        height: "20px",
    },
    navbarLinks: {
        padding: "2px",
        color: "#27363E",
        display: "flex",
        flexDirection: "column",
    },
    navbarNavs: {
        fontFamily: "HelveticaNeue-Light",
        fontSize: "1em",
        marginLeft: "auto",
    },
    navBarBrand: {
        padding: "1em",
        fontFamily: "HelveticaNeue-Light",
    },
    navbarBrandImage: {
        height: "40px",
        marginRight: '35px',
    },
    navbarCollapse: {
        width: "100%",
    },
    navbarForm: {
        width: "50%",
    },
    navbarInputGroup: {
        width: "100%",
    },
    navbarSearchBox: {
        height: "auto",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        width: "50%",
        paddingTop: ".28rem",
        paddingBottom: ".28rem",
        fontFamily: "HelveticaNeue-Light",
    },
    navbarSubmitButton: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        border: "1px solid #e4e7ea",
        borderLeft: "none",
        backgroundColor: "#f6f6f6",
        borderTopRightRadius: ".25rem",
        borderBottomRightRadius: ".25rem",
    },
    navbarMobileTopRow: {
        height: "50%",
        width: "100%",
        display: "flex",
        color: "White",
        fontFamily: "HelveticaNeue_Bold",
    },
    navbarBrandMobile: {
        height: "100%",
        flex: 1,
        display: "flex",
        alignItems: "center",
    },
    navbarBrandMobileImage: {
        height: '70%',
    },
    navbarMobileForm: {
        flex: 5,
        paddingRight: "1rem",
    },
    navbarMobileInputGroup: {
        width: "100%",
        display: "flex",
        alignItems: "center",
    },
    navbarMobileSearchBox: {
        height: "auto",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        width: "50%",
        flex: 5,
        fontFamily: "HelveticaNeue-Light",
    },
    navbarMobileSubmitButton: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        border: "1px solid #e4e7ea",
        borderLeft: "none",
        backgroundColor: "#f6f6f6",
        flex: 1,
        borderTopRightRadius: ".25rem",
        borderBottomRightRadius: ".25rem",
        paddingTop: ".375rem",
        paddingBottom: ".375rem",
        height: "30.5px"
    },
    navbarMobileBottomRow: {
        height: "50%",
        width: "100%",
        display: "flex",
    },
    navbarMobileNavs: {
        height: "100%",
        flex: 1,
        display: "flex",
        alignItems: "center",
        color: "#27363E",
        justifyContent: "center",
        cursor: 'pointer'
    },
    navbarMobileNavImage: {
        height: '65%',
    },
    navbarSelectOuterDiv: {
        width: "50%",
        maxWidth: "350px"
    },
    navbarMobileSelectDiv: {
        width: "85%",
        color: "black",
    },
    navbarMobile: {
        height: "100px",
        borderBottom: "1px solid #27363E",
        backgroundColor: "#f8f8f4",
        //zIndex: 1999,
    }

};

const selectOptions = [{
    label: "Physics",
    value: "Physics",
}, {
    label: "Chemistry",
    value: "Chemistry",
}, {
    label: "Computer Science Fundamentals",
    value: "Computer Science Fundamentals",

}, {
    label: "Mathematics",
    value: "Mathematics",
}, {
    label: "Machine Learning",
    value: "Machine Learning",
}, {
    label: "iOs",
    value: "iOs",
}, {
    label: "Blockchain",
    value: "Blockchain",
}, {
    label: "Smart Contracts",
    value: "Smart Contracts",
}, {
    label: "Web Dev",
    value: "Web Dev",
},
];

//Styles for Searchbar
const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const groupBadgeStyles = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
};

const formatGroupLabel = data => (
    <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
);

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            height: "50px",
            isOpen: false,
            isHidden: false,
            selectedOption: null,
            contentTitles: [],
        };
        this.doRender = false;

    }

    componentDidMount(){
        api.getContentsPreview()
            .then(json => {
                if (json) {
                    let contentTitles = [];
                    json.forEach(obj=>{
                        let label = <span>
                            {obj.title}
                            <em> by {obj.username} </em><br/>
                            <span style={{marginTop:'-8px', 'fontSize': '0.8rem'}}>
                                {obj.tags.map(tag=>
                                    <span style={{marginRight: '5px', padding: '2px', backgroundColor: '#eeeeee'}}>{tag}</span>
                                )}
                            </span>
                        </span>
                        let value = obj.title + ' ' + obj.username + ' ' + obj.tags.join(' ');
                        contentTitles.push({
                            'label': label, 
                            'value': value, 
                            'url': '/user/' + obj.userId + '/' + obj.title,
                        });
                    });
                    this.setState({
                        contentTitles: contentTitles,
                    })
                }
            });
    }

    //Search bar functions
    handleChange = (selectedOption) => {
        if (selectedOption.url)
            window.location.href = selectedOption.url;
        else {
            window.location.href = "#searchResults";
            this.props.onChange(selectedOption.label);
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open: false});
    };

    toggle() {
        this.state.height === "21rem"
            ? this.setState({
                height: "50px"
            })
            : this.setState({
                height: "21rem"
            })
        this.setState({
            isOpen: !this.state.isOpen,
            isHidden: !this.state.isHidden,
        });
        this.doRender = true;
    }

    getMobileVersion() {

        let groupedOptions = [
            {
                label: 'Topics',
                options: selectOptions,
            },
            {
                label: 'Content',
                options: this.state.contentTitles,
            },
        ];
        return (
            <Navbar fixed="top" style={styles.navbarMobile} className='navbar-ontop'>
                <div style={styles.navbarMobileTopRow}>
                    <a href="/explore" style={styles.navbarBrandMobile}>
                        <img src={Logo_Small} alt="logo" style={styles.navbarBrandMobileImage}/>
                    </a>
                    <div style={styles.navbarMobileSelectDiv}>
                        <Select
                            defaultValue="Search"
                            options={groupedOptions}
                            onChange={this.handleChange}
                            formatGroupLabel={formatGroupLabel}
                            placeholder="Search"
                            noOptionsMessage={this.noOptionsMessage}

                        />
                    </div>
                </div>
                <div style={styles.navbarMobileBottomRow}>
                    {ITEMDICT.map(elem =>
                        <a key={elem.link} href={elem.link} style={styles.navbarMobileNavs}>
                            <i className={"fas fa-align-right fa-lg " + elem.icon} style={{alignSelf: "center"}}></i>
                        </a>
                    )}
                </div>
            </Navbar>

        );
    }

    noOptionsMessage() {
        return "No content found. Create your own!"
    }

    getPCVersion() {

        const navbarRightElements = (
            <Nav navbar style={styles.navbarNavs}>
                {ITEMDICT.map(elem =>
                    <NavItem key={elem.link} style={styles.navbarNavItem}>
                        <NavLink onClick={() => history.push(elem.link)} style={styles.navbarLinks}>
                            {/* <FontAwesomeIcon icon="lightbulb" className="faAlignRight marginRight5" size="lg" style={{marginRight:"5px"}}/> */}
                            <i
                                className={"fas fa-align-right fa-lg " + elem.icon}
                                style={{alignSelf: "center", marginBottom: '5px'}}
                            />
                            {elem.label}
                        </NavLink>
                    </NavItem>
                )}
            </Nav>
        );



        let groupedOptions = [
            {
                label: 'Topics',
                options: selectOptions,
            },
            {
                label: 'Content',
                options: this.state.contentTitles,
            },
        ];
        return (
            <div>
                <Navbar light fixed="top" expand="sm" style={{
                    height: this.state.height,
                    backgroundColor: "#f8f8f4",
                    borderBottom: "1px solid #27363E"
                }}>
                    <NavbarBrand href="/" style={styles.navBarBrand}>
                        <img src={Logo} alt="logo" style={styles.navbarBrandImage}/>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} style={styles.navbarCollapse} navbar>
                        <Media query="(max-width: 650px)">
                            {matches =>
                                matches ? (
                                    null
                                ) : (
                                    <div style={styles.navbarSelectOuterDiv}>
                                        <Select
                                            defaultValue="Search"
                                            options={groupedOptions}
                                            onChange={this.handleChange}
                                            formatGroupLabel={formatGroupLabel}
                                            placeholder="Search"
                                            noOptionsMessage={this.noOptionsMessage}
                                        />
                                    </div>
                                )
                            }
                        </Media>
                        {navbarRightElements}

                    </Collapse>
                </Navbar>
            </div>
        );
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.user.uid) {
            return true;
        }
        // prevent unnecessary re-renders
        if (this.doRender) { 
            this.doRender = false;
            return true;
        }
        return false;
    }

    render() {

        // if we know the user, display his name in navbar
        ITEMDICT.forEach(item => {
            if (item.link === '/auth' || item.link === '/account') {
                item.label = this.props.user.uid ? "Account" : "Login";
                item.link = this.props.user.uid ? "/account" : "/auth";
                
            }
        })

        return (
            <div>
                {isMobile()
                    ? this.getMobileVersion()
                    : this.getPCVersion()
                }
            </div>

        )
    }
}

const mapStoreToProps = ({user}) => ({user});
/*
const neededActions = (store) => {
    const {} = actions();
    return {}
};
*/

// export default connect(mapStoreToProps, neededActions)(NavBar);
export default connect(mapStoreToProps, {})(NavBar);

