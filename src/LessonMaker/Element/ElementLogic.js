import React, {Component} from 'react';

class ElementLogic extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {data, isEditMode, shouldFoldInView, handleFoldInView, handleReady} = this.props;
        const logicProps = {data, isEditMode, shouldFoldInView, handleFoldInView, handleReady};
        return (
            this.props.render(logicProps)
        );
    }
}

export default ElementLogic;