const withLoader = (propName) => (WrappedComponent) => {
    class withLoading extends Component {

        isEmpty(value) {
            return (
                value === undefined || value===null ||
                (value.hasOwnProperty('length') && value.length === 0)
                || value.constructor === Object && Object.keys(propName).length === 0
            );
        }
        render() {
            return this.isEmpty(this.props[propName]) ? (<div>Loading... </div>) : <WrappedComponent {...this.props} />
        }
        }

    withLoading.displayName = `WithLoading(${getDisplayName(WrappedComponent)})`;
    return withLoading;
}

export default withLoader