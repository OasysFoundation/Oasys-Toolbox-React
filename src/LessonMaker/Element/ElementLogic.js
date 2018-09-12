import React, {Component} from 'react';

class ElementLogic extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {data, isEditMode, isLoading, shouldFoldInView, handleFoldInView} = this.props;
        const logicProps = {data, isEditMode, isLoading, shouldFoldInView, handleFoldInView};
        return (
            this.props.render(logicProps)
        );
    }
}

export default ElementLogic;