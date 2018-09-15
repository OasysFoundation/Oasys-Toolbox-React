import React from 'react';

class ElementLogic extends React.Component {

    render() {
        const {data, shouldFoldInView, handleFoldInView, handleReady} = this.props;
        const logicProps = {data, shouldFoldInView, handleFoldInView, handleReady};
        return (
            this.props.render(logicProps)
        );
    }
}

export default ElementLogic;