import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import history from '../history'

const styles = {
    mobileTopPadding:{
        paddingTop:"100px"
    },
    pcTopPadding:{
        paddingTop:"50px"
    },
    modalOuterDiv:{
        fontFamily:"Raleway-Regular",
    },
    modalHeader:{
        fontSize:"2.5em"
    },
    modalBody:{
        display: "flex",
        flexDirection: "column",
        fontSize:"1.5em",
    },
    modalButton:{
        display:"flex",
        padding:"1em",
    },
}


//this is the new "Preview" Component
class ContentTileMenuModal extends Component {


    toggle() {
      this.props.onClose();
    }

    handleClick(value) {
      if (value === "remix") {
            history.push(`/create/${this.props.data.username || "anonymous"}/${this.props.data.title}/`)
        }
        // window.location.href  = `/create/${this.state.currentUsername}/${this.state.currentTitle}`
        else if (value === "comments")
            window.location.href = `/comments/${this.props.data.username}/${this.props.data.title}`
        else if (value === "content")
            window.location.href = `/content/`
    }


    render() {
    	
        return (
            <div>
              <Modal isOpen={this.props.isOpen} toggle={this.toggle.bind(this)}
                           className={'modal-sm ' + this.props.className} style={styles.modalOuterDiv}>
              <ModalHeader toggle={this.toggle.bind(this)} style={styles.modalHeader}>{this.props.data.title}</ModalHeader>
              <ModalBody style={styles.modalBody}>
                  <Button block color="light" onClick={this.handleClick.bind(this,"remix")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-pencil-alt"/></div>
                    <div style={{flex:3, textAlign:"left"}}>Remix</div>
                  </Button>
                  <Button block color="light" onClick={this.handleClick.bind(this,"comments")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-comment" /></div>
                    <div style={{flex:3, textAlign:"left"}}>View Comments</div>
                  </Button>
                  <Button block color="light" onClick={this.handleClick.bind(this,"user")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-user"/></div>
                    <div style={{flex:3, textAlign:"left"}}>{"Go To " + this.props.data.username + "'s Page"}</div>
                  </Button>
                  <Button block color="light" onClick={this.handleClick.bind(this,"collection")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-layer-group"/></div>
                    <div style={{flex:3, textAlign:"left"}}>Create New Collection</div>
                  </Button>
                  <Button block color="light" onClick={this.handleClick.bind(this,"flag")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-flag"/></div>
                    <div style={{flex:3, textAlign:"left"}}>Flag as Inappropriate</div>
                  </Button>

              </ModalBody>
              </Modal>
            </div>
        )
    }
}

ContentTileMenuModal.propTypes = {

}

export default ContentTileMenuModal;
