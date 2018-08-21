import React from 'react';
import Media from "react-media"; 
import Select from 'react-select';
import api from './api'

import Logo from './assets/images/brand/oasys_logo_big.png'
import Logo_Small from './assets/images/brand/oasys_logo_small.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Styling
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  InputGroup,
  InputGroupAddon } from 'reactstrap';

import history from './history'


const ITEMDICT = [
  {link: '/explore', icon: 'fa-lightbulb', label: 'Learn'},
  {link: '/create', icon: 'fa-pencil-alt', label: 'Create'},
  {link: '/data', icon: 'fa-chart-bar', label: 'Analytics'},
  {link: '/about', icon: 'fa-info-circle', label: 'About'},
  {link: '/user', icon: 'fa-user', label: 'Account'}
];


const styles = {
    navbarNavItem:{
        display: "flex",
        alignItems: "center", 
        justifyContent: "center", 
        padding:"0px 8px 0px 8px",
        color:"​​​​​​​#3E4B54",
        fontSize:"1.0rem",
        cursor: 'pointer',
        marginTop: '5px',
    },
    navbarNavLinkForImage:{
        padding:"0px 0px 0px 0px",
    },
    navbarNavImage:{
        height:"20px",
    },
    navbarLinks:{
        padding:"2px",
        color:"#27363E",
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
    navbarBrandImage:{
        height: "40px",
        marginRight: '35px',
    },
    navbarCollapse:{
        width:"100%",
    },
    navbarForm:{
        width:"50%",
    },
    navbarInputGroup:{
        width:"100%",
    },
    navbarSearchBox:{
        height:"auto", 
        borderTopRightRadius:0, 
        borderBottomRightRadius:0, 
        width: "50%", 
        paddingTop:".28rem", 
        paddingBottom:".28rem",
        fontFamily:"HelveticaNeue-Light",
    },
    navbarSubmitButton:{
        borderTopLeftRadius:0, 
        borderBottomLeftRadius:0, 
        border:"1px solid #e4e7ea", 
        borderLeft:"none", 
        backgroundColor:"#f6f6f6",
        borderTopRightRadius: ".25rem",
        borderBottomRightRadius: ".25rem",
    },
    navbarMobileTopRow:{
        height:"50%", 
        width:"100%", 
        display:"flex", 
        color:"White", 
        fontFamily:"HelveticaNeue_Bold",
    },
    navbarBrandMobile:{
        height:"100%", 
        flex:1, 
        display:"flex", 
        alignItems:"center",
    },
    navbarBrandMobileImage:{
        height: '70%',
    },
    navbarMobileForm:{
        flex:5, 
        paddingRight:"1rem",
    },
    navbarMobileInputGroup:{
        width:"100%", 
        display:"flex", 
        alignItems:"center",
    },
    navbarMobileSearchBox:{
        height:"auto",
        borderTopRightRadius:0, 
        borderBottomRightRadius:0, 
        width: "50%", 
        flex:5,
        fontFamily:"HelveticaNeue-Light",
    },
    navbarMobileSubmitButton:{
        borderTopLeftRadius:0, 
        borderBottomLeftRadius:0, 
        border:"1px solid #e4e7ea", 
        borderLeft:"none", 
        backgroundColor:"#f6f6f6", 
        flex:1,
        borderTopRightRadius: ".25rem",
        borderBottomRightRadius: ".25rem",
        paddingTop:".375rem", 
        paddingBottom:".375rem",
        height:"30.5px"
    },
    navbarMobileBottomRow:{
        height:"50%", 
        width:"100%", 
        display:"flex",
    },
    navbarMobileNavs:{
        height:"100%", 
        flex:1, 
        display:"flex", 
        alignItems:"center", 
        color:"#27363E",
        justifyContent:"center",
        cursor: 'pointer'
    },
    navbarMobileNavImage:{
        height: '65%',
    },
    navbarSelectOuterDiv:{
        width: "50%",
        maxWidth: "350px"
    },
    navbarMobileSelectDiv: {
      width:"85%",
      color:"black",
    },
    navbarMobile:{
      height: "100px",
      borderBottom: "1px solid #27363E",
      backgroundColor:"#f8f8f4",
      zIndex: 1999,
    }
  
};

const selectOptions = [{
        label: "Physics",
        value: "Physics",
    },{
        label: "Chemistry", 
        value: "Chemistry",
    },{
        label: "Computer Science Fundamentals", 
        value: "Computer Science Fundamentals",

    },{
        label: "Mathematics", 
        value: "Mathematics",
    },{
        label: "Machine Learning", 
        value: "Machine Learning",
    },{
        label: "iOs",
        value: "iOs", 
    },{
        label: "Blockchain", 
        value: "Blockchain",
    },{
        label: "Smart Contracts",
        value: "Smart Contracts", 
    },{
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
          contentTitles:[],
        };
        api.getContentsPreview()
            .then(json => {
                if(json){
                    let titles = json.map(obj => obj.title);
                    let userIds = json.map(obj => obj.userId);
                    let contentTitles = [];
                    for (let i = 0; i < titles.length && i<userIds.length; i++) {
                        let newUrl = "/user/"+userIds[i]+"/"+titles[i]
                        contentTitles.push({"label":titles[i],"value":titles[i], "url":newUrl})
                    }
                    this.setState({
                        contentTitles:contentTitles,
                    })
                }
            });
    }

    //Search bar functions
    handleChange = (selectedOption) => {
        if(selectedOption.url)
            window.location.href=selectedOption.url;
        else{
            window.location.href="#searchResults";
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
        this.state.height==="21rem"
        ? this.setState({
           height:"50px"
          })
        : this.setState({
           height:"21rem"
          })
        this.setState({
          isOpen: !this.state.isOpen,
          isHidden: !this.state.isHidden,
        });
      }

      checkMobile(){
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      }

      getMobileVersion(){
        //required for search bar
        const { selectedOption } = this.state;

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
                    <img src={Logo_Small} style={styles.navbarBrandMobileImage}/>
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
              {ITEMDICT.map(elem=>
                <a href={elem.link} style={styles.navbarMobileNavs}>
                    <i className={"fas fa-align-right fa-lg "+elem.icon} style={{alignSelf: "center"}}></i>
                </a>
              )}
            </div>
         </Navbar>

        );
      }

      noOptionsMessage(){
        return "No content found. Create your own!"
      }

      getPCVersion(){

        const navbarRightElements = (
            <Nav navbar style={styles.navbarNavs}>
              {ITEMDICT.map(elem=>
                <NavItem style={styles.navbarNavItem}>
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

        //required for Searchbar
        const { selectedOption } = this.state;

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
        return(
            <div>
            <Navbar light fixed="top" expand="sm" style={{height:this.state.height, backgroundColor:"#f8f8f4", borderBottom: "1px solid #27363E",zIndex: 1999}} >
              <NavbarBrand href="/" style={styles.navBarBrand}>
                  <img src={Logo} style={styles.navbarBrandImage}/>
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


    render() {
        const { selectedOption } = this.state;

        return (
            <div>
               { this.checkMobile()
                   ? this.getMobileVersion()
                   : this.getPCVersion()
               }
            </div>

        )
    }
}

export default NavBar;   

