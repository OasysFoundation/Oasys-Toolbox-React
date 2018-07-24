import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ToolbarGroup from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button';
import IconExplore from '@material-ui/icons/Explore';
import IconCreate from '@material-ui/icons/Create';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import IconInsertChart from '@material-ui/icons/InsertChart';
import Typography from '@material-ui/core/Typography';
import SignOutButton from './SignOutButton';

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
  DropdownItem } from 'reactstrap';


const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
    navbar: {
        backgroundColor: "#74A4AC"
    }
});

const BG = "#74A4AC";


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

        let accountMenuItems = (
            <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center"}}>
                    <NavLink href="/login/" className={"text-white"} style={{flex: 1}}>Sign In</NavLink>
            </NavItem>
        );

        let accountMenuItemsNewSecond = (null);

        let accountMenuItemsNew = (
                <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"8px 10px 8px 10px"}}>
                    <NavLink href="/login/" className={"text-white"} >Sign In</NavLink>
                </NavItem>
        );

        if (loggedIn) {
            accountMenuItems = (
                <div style={{display: 'inline'}}>
                    <Button href='/user' color="inherit">
                        <IconAccountCircle/>
                        {this.props.authUser.displayName}
                    </Button>

                    <SignOutButton color="inherit" handleClick={this.handleClick.bind(this)}/>
                </div>
            )
        }

        if (loggedIn) {
            accountMenuItemsNew = (
                <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"8px 10px 8px 10px"}}>
                    <NavLink href="/user/" style={{paddingLeft:"0px",paddingRight: "0px"}}>
                        <IconAccountCircle style={{color:"white"}}/>
                    </NavLink>
                    <NavLink href="/user/" className={"text-white"} style={{paddingLeft:"2px"}}>{this.props.authUser.displayName}</NavLink>
                </NavItem>
            );
            accountMenuItemsNewSecond = (
                <SignOutButton color="inherit" handleClick={this.handleClick.bind(this)}/>
            );

        }


        let navBarElements = (
            <div>
                <Button href='/explore' color="inherit">
                    <IconExplore style={{marginRight: '7px'}}/>
                    Explore
                </Button>

                <Button href='/create' color="inherit">
                    <IconCreate style={{marginRight: '7px'}}/>
                    Create
                </Button>

                <Button href='/data' color="inherit">
                    <IconInsertChart style={{marginRight: '7px'}}/>
                    Analytics
                </Button>

                {accountMenuItems}

                <Button href='https://joinoasys.org' color="inherit">About</Button>

            </div>
        );

        let navBarElementsNew = (
            <Nav className="ml-auto" navbar>
              <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"8px 10px 8px 10px"}}>
                <NavLink href="/explore/" style={{paddingLeft:"0px",paddingRight: "0px"}}>
                    <IconExplore style={{color:"white"}}/>
                </NavLink>
                <NavLink href="/explore/" className={"text-white"} style={{paddingLeft:"2px"}}>Explore</NavLink>
              </NavItem>
              <NavItem hidden={this.state.isHidden} style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"8px 10px 8px 10px"}}> 
                <NavLink href="/create/" style={{paddingLeft:"0px",paddingRight: "0px"}}>
                    <IconCreate style={{color:"white"}}/>
                </NavLink>
                <NavLink href="/create/" className={"text-white"} style={{paddingLeft:"2px"}}>Create</NavLink>
              </NavItem>
              <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"8px 10px 8px 10px"}}>
                <NavLink href="/data/" style={{paddingLeft:"0px",paddingRight: "0px"}}>
                    <IconInsertChart style={{color:"white"}}/>
                </NavLink>
                <NavLink href="/data/" className={"text-white"} style={{paddingLeft:"2px"}}>Analytics</NavLink>
              </NavItem>
              {accountMenuItemsNew}
              {accountMenuItemsNewSecond}

              <NavItem style={{display: "flex",alignItems: "center", justifyContent: "center", padding:"8px 10px 8px 10px"}}>
                <NavLink href='https://joinoasys.org' className={"text-white"}>About</NavLink>
              </NavItem>
            </Nav>
        );


        const {classes} = this.props;
        return (
        <div>

        <Navbar inverse style={{backgroundColor: BG}} expand="md">
          <NavbarBrand href="/explore" className={"text-white"} style={{padding: "1em"}}>Oasys Education</NavbarBrand>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            {this.props.authUser
                ? navBarElementsNew
                : null
            }
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

