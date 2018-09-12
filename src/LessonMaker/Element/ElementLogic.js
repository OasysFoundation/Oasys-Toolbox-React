import React, {Component} from 'react';

class ElementLogic extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {data, isEditMode, isLoading, shouldFoldInView, handleFoldInView} = this.props;
        return (
            this.props.render(data, isEditMode, isLoading, shouldFoldInView, handleFoldInView)
        );
    }
}

export default ElementLogic;