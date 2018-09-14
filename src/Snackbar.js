import React from 'react';
import PropTypes from 'prop-types';

import MaterialSnackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

/*
This is a wrapper around Material UI Snackbar 
*/
class Snackbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: null,
        }
        this.onCloseSnackBar = this.onCloseSnackBar.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            message: props.message,
        });
    }

    onCloseSnackBar() {
        this.setState({
            message: null
        });
    }

    render(){
        return (
             <MaterialSnackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.state.message ? true : false}
                autoHideDuration={this.props.autoHideDuration}
                onClose={this.onCloseSnackBar}
            >
                <SnackbarContent
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar">
                      {this.state.message}
                    </span>
                    }
                />
            </MaterialSnackbar>
        )
    }
}

    
Snackbar.propTypes = {
    message: PropTypes.string,
    autoHideDuration: PropTypes.number,
}

Snackbar.defaultProps = {
    autoHideDuration: 6000,
}

export default Snackbar;