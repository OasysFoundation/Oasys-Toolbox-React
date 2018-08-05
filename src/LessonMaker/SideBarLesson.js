import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SideBarLesson extends Component {
    //title, tags
    render() {
        return (
            <div style={this.props.style}>
                <section>Category</section>
                <section>Tags</section>
                <button>Settings</button>
                <button>ToC</button>
                <button onClick={this.props.onAddChapter}>Add Chapter</button>
                {this.props.chapters.map(chap =>
                <button key={chap.id} onClick={() => this.props.onChapterChange(chap.id)}> {" -- " + chap.title + " -- "}</button>
                )}
            </div>
        );
    }
}

SideBarLesson.propTypes = {
    onChapterChange:PropTypes.func.isRequired,
    onAddChapter:PropTypes.func.isRequired,
    chapters: PropTypes.array
};

export default SideBarLesson;
