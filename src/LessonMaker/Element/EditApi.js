import React, {Component} from 'react';
import {connect} from 'redux-zero/react';

import {getContentFromSessionStorage} from '../../utils/trickBox';
import actions from '../../store/actions';
import { isValidAction } from '../../utils/tools';

// Save at most every SAVE_INTERVAL ms. 
const SAVE_INTERVAL = 1000;

class EditApi extends Component {

    constructor(props) {
        super(props);        
        this.timeLastSaved = Date.now();

        this.state = {
            content: this.props.data.content || getContentFromSessionStorage(this.props.data.id),
            timestamp: Date.now(),
        };

        // actionDict defines the set of possible actions that each individual edit/view component has access to.
        // an action can be executed by calling this.props.handleAction(action) from the edit/view component.
        // action must be an object which has properties type and value, where type is any of the properties of actionDict.
        this.actionDict = {
            save: (value) => {
                const now = Date.now();
                const update = (value === undefined) ? {} : {content: value, timestamp: now};
                this.setState(
                    () => (update),
                    () => {
                        if (now - this.timeLastSaved > SAVE_INTERVAL) {
                            this.timeLastSaved = now;
                            this.props.onChangeContent(
                                this.props.data.id,
                                this.state.content,
                                this.props.data.parentChapterID,
                            );
                        }
                });
            },
        }

        this.handleAction = this.handleAction.bind(this);
    }

    handleAction(action) {
        console.log('handling ', action)
        isValidAction(action) ? this.actionDict[action.type](action.value) : null;
    }

    componentWillReceiveProps(nextprops) {
        //this.handleAction({type: 'save', value: undefined});
    }

    componentWillUnmount() {
        this.handleAction({type: 'save', value: undefined});
    }

    render(){
        const logicProps = {
            handleAction: this.handleAction,
            data: this.props.data.content || getContentFromSessionStorage(this.props.data.id),
        };
        return (
            this.props.render(logicProps)
        )
    }
}


const neededActions = (store) => {
    const {onChangeContent} = actions();
    return {onChangeContent}
};
export default connect(
    null, 
    neededActions
)(EditApi);
