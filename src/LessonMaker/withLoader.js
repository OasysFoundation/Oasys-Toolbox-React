import {isEmpty} from './trickBox'

const withLoader = (propName) => (WrappedComponent) => {
    class withLoading extends Component {

        render() {
            return isEmpty(this.props[propName]) ? (<div>Loading... </div>) : <WrappedComponent {...this.props} />
        }
    }

    withLoading.displayName = `WithLoading(${getDisplayName(WrappedComponent)})`;
    return withLoading;
}

export default withLoader