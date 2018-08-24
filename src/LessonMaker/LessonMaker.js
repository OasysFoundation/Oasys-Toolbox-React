import React, {Component} from 'react';
import {Container} from "reactstrap"
import SideBarLesson from "./SideBarLesson";
import posed, {PoseGroup} from 'react-pose';
import PropTypes from 'prop-types';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {connect} from "redux-zero/react";

import actions from "../store/actions";
import Element from "./Element";
import ElementAdder from './ElementAdder'
import ContentView from './ContentView'
import colors from '../utils/colors';

import EditModalWarning from './EditModalWarning'

const Item = posed.div();

class LessonMaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDeleteChapterDialog: false,
        }
        // props.mergeStoreWithSessionStorage();
        this.handleChapterDeleteModal = this.handleChapterDeleteModal.bind(this);
        this.handleChapterDeleteModalClose = this.handleChapterDeleteModalClose.bind(this);
        this.handleChapterDelete = this.handleChapterDelete.bind(this);
        this.renderChapterDeleteModal = this.renderChapterDeleteModal.bind(this);
    }

    componentDidMount() {
        // this.inhaleSessionStorage();
        //api.getProjectsForUser().then()
        const that = this;
        this.autoSaver = setInterval(function () {
            that.saveStatus()
        }, 20000);

        this.props.updateChapterLinks();

    }

    componentWillUnmount() {
        clearInterval(this.autoSaver);
    }

    saveStatus() {
        console.log('saving status....')
        //api.saveContent
    }

    handleChapterDeleteModal(){
        this.setState({
            showDeleteChapterDialog: true,
        });
    }

    handleChapterDeleteModalClose() {
        this.setState({
            showDeleteChapterDialog: false,
        });
    }

    handleChapterDelete() {
        const {chapters, activeChapterIndex} =  this.props;
        this.handleChapterDeleteModalClose();
        const oldIndex = activeChapterIndex;
        let index = activeChapterIndex === chapters.length-1 ? chapters.length -2 : activeChapterIndex;
        // const currIdx = activeChapterIndex;
        console.log(this.props.activeChapterIndex, index)

        if (chapters.length === 1 ) {
            index = 0;
        }

        this.props.onChangeActiveChapter(chapters[index].id)
        this.props.onDeleteChapter(chapters[oldIndex].id);

        console.log(this.props.chapters[this.props.activeChapterIndex])

    }

    renderChapterDeleteModal(){
        const modal = (this.props.chapters.length===1)
        ? (<React.Fragment>
                <ModalHeader>
                    Cannot delete chapter
                </ModalHeader>
                <ModalBody>
                    <p>Sorry, but each lesson needs to have at least one chapter, so you 
                    cannot delete this chapter.</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleChapterDeleteModalClose}>OK</Button>
                </ModalFooter>
            </React.Fragment>
        )
        : (<React.Fragment>
                <ModalHeader>
                    Delete chapter?
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this chapter?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.handleChapterDeleteModalClose}>Cancel</Button>
                    <Button style={{backgroundColor: '#c6361d', color: colors.SNOW1}} onClick={this.handleChapterDelete}>Delete</Button>
                </ModalFooter>
            </React.Fragment>
        )
        return modal;
    }    

    checkMobile() {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    render() {
        const activeChapter = this.props.chapters[this.props.activeChapterIndex];
        if (!activeChapter) {return <div>No chapters found</div>}
        const {elements} = activeChapter;
        const emptyChapterAdder = elements.length > 0 ? null : <ElementAdder key={"filler"} idx={0}/>;
        const paddingVal = (this.checkMobile() ? "60px" : "10px")


        return (
            <div className="app-body" style={{paddingTop:paddingVal}}>
                <EditModalWarning contentTitle={"Mark22 adventures"} isOpen={false}/>
                <SideBarLesson/>
                <main className="main">
                    <Modal isOpen={this.state.showDeleteChapterDialog} toggle={this.handleChapterDeleteModalClose} backdrop={true}>
                        { this.renderChapterDeleteModal() }
                    </Modal>

                    <Container fluid className='main-width'>
                        <center>


                                    <section className='main-width' style={{
                                        display: 'flex',
                                        marginTop: '1rem',
                                        marginBottom: '1rem',
                                        flex: 1,
                                        flexDirection: 'row'
                                    }}>

                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">Chapter Title</span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control header"
                                            placeholder="Name your Chapter"
                                            aria-label="Name this Chapter"
                                            value={activeChapter.title}
                                            onChange={(ev) => this.props.onChangeChapterTitle(ev.target.value)}
                                            aria-describedby="basic-addon1"
                                            style={{marginRight: '10px'}}
                                        />
                                        <button
                                            type="button"
                                            className="btn preview-btn delete-btn"
                                            onClick={this.handleChapterDeleteModal}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className={this.props.isEditMode ? "btn btn-dark preview-btn" : "btn btn-light preview-btn"}
                                            style={{width: '150px'}}
                                            onClick={() => this.props.onToggleEditMode()}
                                        >
                                            <span className={this.props.isEditMode ? "icon-grid" : "icon-layers"}></span>
                                            {"  "}
                                            {this.props.isEditMode ? 'Preview' : '  Edit  '}
                                        </button>
                                    </section>
                            {this.props.isEditMode
                                ? (<React.Fragment>
                                <PoseGroup>
                                    {elements.map((el, idx) =>
                                        <Item key={el.id}>
                                            <Element
                                                key={el.id}
                                                data={el}
                                                isPreview={true}
                                            />

                                            {/*SHORT FORM FOR --> isEditMode ? <Adder/> : null */}
                                            {this.props.isEditMode && <ElementAdder key={el.id + 1} idx={idx}/>}
                                        </Item>
                                    )}
                                </PoseGroup>

                            </React.Fragment>)


                            : <ContentView
                                    isPreview={true}
                                    chapters={this.props.chapters}
                                    onChangeActiveChapter={this.props.onChangeActiveChapter}/>
                        }

                        {emptyChapterAdder}
                        </center>

                    </Container>
                </main>
            </div>
        )
    }
}

LessonMaker.propTypes = {
    chapters: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        links: PropTypes.array,
        id: PropTypes.string,
        elements: PropTypes.array
    })).isRequired,
    isEditMode: PropTypes.bool.isRequired,
    activeChapterIndex: PropTypes.number
};

const mapStoreToProps = ({chapters, activeChapterIndex, isEditMode}) => ({isEditMode, chapters, activeChapterIndex})
const neededActions = (store) => {
    const {onChangeActiveChapter, updateChapterLinks, onDeleteChapter, onChangeChapterTitle, onToggleEditMode, mergeStoreWithSessionStorage} = actions();
    return {onChangeActiveChapter, updateChapterLinks, onDeleteChapter, onChangeChapterTitle, onToggleEditMode, mergeStoreWithSessionStorage}
};

export default connect(mapStoreToProps, neededActions)(LessonMaker);
