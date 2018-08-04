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
    this.setState({
      isOpen: !this.state.isOpen,
      isHidden: !this.state.isHidden,
    });
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
              <NavItem hidden={this.state.isHidden} style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}> 
                <NavLink href="/create/" style={{padding:"0px 0px 0px 0px"}}>
                    <img src={Create} style={{height:"20px"}}/>
                </NavLink>
                <NavLink href="/create/" className={"text-white"} style={{paddingLeft:"2px"}}>Create</NavLink>
              </NavItem>
              <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"0px 8px 0px 8px"}}>
                <NavLink href="/user/" style={{padding:"0px 0px 0px 0px"}}>
                    <img src={User} style={{height:"20px"}}/>
                </NavLink>
                <NavLink href="/user/" className={"text-white"} style={{paddingLeft:"2px"}}>My Account</NavLink>
              </NavItem>
            </Nav>
        );


        const {classes} = this.props;
        return (
        <div>

        <Navbar inverse style={{backgroundColor: BG, height: '50px'}} expand="md">
          <NavbarBrand href="/explore" className={"text-white"} style={{padding: "1em", fontFamily: navBarFont}}>
          <img src={Logo_transparent} style={{height: '30px'}}/>
          Oasys Education
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} style={{width:"100%"}} navbar>

          <Form inline style={{width:"50%"}}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0" style={{width:"100%"}}>
              <Input type="text" name="search" id="search" placeholder="Search" style={{borderTopRightRadius:0, borderBottomRightRadius:0, width: "80%"}}/>
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

