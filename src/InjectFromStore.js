import React from 'react';
import {connect} from 'redux-zero/react';

/*
This component connects to the store and provides selected state and dispatch to its children. Example:
<InjectFromStore select={(state)=>({message:state.snackbarMessage})}>
    { (props) => <Snackbar message={props.message}/> }
</InjectFromStore>
*/
const InjectFromStore = ({ children, state, dispatch }) => children(state, dispatch);

const defaultSelector = (state) => state; // pass the whole state by default

export default connect(
  // the second parameter of this mapStateToProps is the component's props. 
  (state, { select = defaultSelector }) => ({ state: select(state) }),
  dispatch => ({ dispatch }),
)(InjectFromStore);

