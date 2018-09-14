
import React from 'react';
import MaterialSnackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {connect} from 'redux-zero/react';

import actions from './store/actions';
import store from "./store/store";

class MySnackbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackBarMessage: null,
        }
        this.onCloseSnackBar = this.onCloseSnackBar.bind(this);
    }

    componentWillReceiveProps(props) {
        console.log(props)
        this.setState({
            snackBarMessage: props.snackBarMessage,
        });
    }

    onCloseSnackBar() {
        this.setState({
            snackBarMessage: null
        });
    }

    render(){
        return (
             <MaterialSnackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={Boolean(this.state.snackBarMessage)}
                autoHideDuration={6000}
                onClose={this.onCloseSnackBar}
            >
                <SnackbarContent
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar">
                      {this.state.snackBarMessage}
                    </span>
                    }
                />
            </MaterialSnackbar>
        )
    }
}


const mapStoreToProps = ({snackBarMessage}) => ({snackBarMessage});
const neededActions = (store) => {
    const {} = actions();
    return {}
};
export default connect(mapStoreToProps, neededActions)(MySnackbar);