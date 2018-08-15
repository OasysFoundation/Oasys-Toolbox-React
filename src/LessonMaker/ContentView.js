import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import ScrollView, {ScrollElement} from "../utils/scroller";

// import '../styles/scroller.css'

class ContentView extends Component {
    scrollTo = (name) => {
        this._scroller.scrollTo(name);
    }

    render() {
        const {elements} = this.props;
        return (
            <React.Fragment>
                <div className="app-body">

                {/*{elements.map(el => (<Element data={el} id={el.id} isEditMode={false}/>))}*/}

                {
                    elements.map(({id}) => <button class="yoloBut" onClick={() => this.scrollTo(id)}>{id}</button>)
                }
                <ScrollView ref={scroller => this._scroller = scroller}>
                    <div className="scroller">

                        {elements.map(el => (

                            <ScrollElement key={el.id} name={el.id}>
                                <div className="item">
                                    <Element data={el} id={el.id} isEditMode={false}/>
                                    {el.id}
                                </div>
                            </ScrollElement>))
                        }
                    </div>
                </ScrollView>
                </div>
            </React.Fragment>
        );
    }
}

ContentView.propTypes = {
    elements: PropTypes.array.isRequired
};

export default ContentView;
