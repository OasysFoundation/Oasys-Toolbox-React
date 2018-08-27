import {isEmpty} from '../utils/trickBox'
import React, {Component} from 'react';
import getDisplayName from 'react-display-name';



const withLoader = (propName1, propOfProp = null) => (WrappedComponent) => {
    class withLoading extends Component {

        render() {
            return isEmpty(propOfProp ? this.props[propName1][propOfProp] : this.props[propName1] ) ? (<div>Waiting for data... </div>) : <WrappedComponent {...this.props} />
        }
    }

    withLoading.displayName = `withLoading(${getDisplayName(WrappedComponent)})`;
    return withLoading;
}

export default withLoader