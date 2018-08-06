import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ToolbarGroup from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button';
import IconExplore from '@material-ui/icons/Explore';
import IconCreate from '@material-ui/icons/Create';
import Search from './images/search_grey_96x96.png';
import Learn from './images/learn.png'
import Create from './images/create.png'
import User from './images/settings.png'

import IconAccountCircle from '@material-ui/icons/AccountCircle';
import IconInsertChart from '@material-ui/icons/InsertChart';
import Typography from '@material-ui/core/Typography';
import SignOutButton from './SignOutButton';
import Logo_transparent from './oasys_logo_transparent.png'

import 'firebase/auth';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {withStyles} from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

//import Navbar from '@coreui/react/lib';
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
  Input, } from 'reactstrap';


const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
    navbar: {
        backgroundColor: "#00695c"
    }
});

const BG = "#00695c";
const navBarFont = "SF-Pro-Text-Regular";


/*
<NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}>
                <NavLink href="/data/" style={{padding:"0px 0px 0px 0px"}}>
                    <IconInsertChart style={{color:"white"}}/>
                </NavLink>
                <NavLink href="/data/" className={"text-white"} style={{paddingLeft:"2px"}}>Analytics</NavLink>
              </NavItem>
                            {accountMenuItemsNew}
              {signOut}

              <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}>
                <NavLink href='https://joinoasys.org' className={"text-white"} style={{padding:"0px 0px 0px 0px"}}>About</NavLink>
              </NavItem>
*/
class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
          height: "50px",
          isOpen: false,
          isHidden: false,
        };
    }

    state = {
        open: false,
    };

    handleClick = () => {
        this.setState({open: true});
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open: false});
    };

    toggle() {
    this.state.height==="13rem"
    ? this.setState({
       height:"50px"
      })
    : this.setState({
       height:"13rem"
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

    render() {

        const loggedIn = this.props.authUser && this.props.authUser !== "loggedOut";
        let signOut = (null);
        let accountMenuItemsNew = (
                <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"8px 10px 8px 10px"}}>
                    <NavLink href="/login/" className={"text-white"} >Sign In</NavLink>
                </NavItem>
        );
        if (loggedIn) {
            accountMenuItemsNew = (
                <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}>
                    <NavLink href="/user/" style={{padding:"0px 0px 0px 0px"}}>
                        <IconAccountCircle style={{color:"white"}}/>
                    </NavLink>
                    <NavLink href="/user/" className={"text-white"} style={{paddingLeft:"2px"}}>{this.props.authUser.displayName}</NavLink>
                </NavItem>
            );
            signOut = (
                <SignOutButton color="inherit" handleClick={this.handleClick.bind(this)}/>
            );

        }

        let navBarElementsNew = (
            <Nav navbar className="ml-auto" style={{fontFamily: navBarFont}}>
              <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}>
                <NavLink href="/explore/" style={{padding:"0px 0px 0px 0px"}}>
                    <img src={Learn} style={{height:"20px"}}/>
                </NavLink>
                <NavLink href="/explore/" className={"text-white"} style={{paddingLeft:"2px"}}>Learn</NavLink>
              </NavItem>
              <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}> 
                <NavLink href="/create/" style={{padding:"0px 0px 0px 0px"}}>
                    <img src={Create} style={{height:"20px"}}/>
                </NavLink>
                <NavLink href="/create/" className={"text-white"} style={{paddingLeft:"2px"}}>Create</NavLink>
              </NavItem>
              <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}>
                <NavLink href="/user/" style={{padding:"0px 0px 0px 0px"}}>
                    <img src={User} style={{height:"20px"}}/>
                </NavLink>
                <NavLink href="/user/" className={"text-white"} style={{paddingLeft:"2px"}}>Profile</NavLink>
              </NavItem>
            </Nav>
        );


        const {classes} = this.props;
        return (
        <div>

        <Navbar inverse style={{backgroundColor: BG, height: this.state.height}} expand="md">
          <NavbarBrand href="/explore" className={"text-white"} style={{padding: "1em", fontFamily: navBarFont}}>
          <img src={Logo_transparent} style={{height: '30px'}}/>
          Oasys Education
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} style={{width:"100%"}} navbar>

          <Form inline hidden={this.state.isHidden} style={{width:"100%"}}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0" style={{width:"100%"}}>
              <Input type="text" name="search" id="search" placeholder="Search" style={{borderTopRightRadius:0, borderBottomRightRadius:0, width: "50%"}}/>
              <button type="submit" class="btn btn-default" style={{borderTopLeftRadius:0, borderBottomLeftRadius:0, border:"1px solid #ced4da", borderLeft:"none", backgroundColor:"#f6f6f6"}}>
                    <img src={Search} style={{height: "20px"}}/>
              </button>
            </FormGroup>
          </Form>
                
          {navBarElementsNew}

          </Collapse>
          <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Signed out successful</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />

        </Navbar>

            
            </div>

        )
    }
}


NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);   

