import React from 'react';
import { Col, Container, Row, Footer } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class FooterPage extends React.Component {
    render(){
        return(
            <Footer color="blue-grey" className="page-footer font-small lighten-5 pt-4" style={{backgroundColor:"#f8f8f4", borderTop:"1px solid #27363E"}}>
                <Container className="mt-5 text-center text-md-left">
                    <Row className="mt-3" style={{display:"flex", justifyContent:"center"}}>
                        <Col md="3" lg="4" xl="3" className="mb-4 dark-grey-text">
                            <h6 className="text-uppercase font-weight-bold"><strong>Oasys Education</strong></h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '60px'}}/>
                            <p><a href="/about" className="dark-grey-text">About</a></p>
                            <p><a href="/terms-of-service" className="dark-grey-text">Terms of Service</a></p>
                            <p><a href="/privacy" className="dark-grey-text">Privacy Policy</a></p>
                        </Col>
                        <Col md="3" lg="2" xl="2" className="mb-4 dark-grey-text">
                            <h6 className="text-uppercase font-weight-bold"><strong>Useful links</strong></h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '60px'}}/>
                            <p><a href="/" className="dark-grey-text">Home</a></p>
                            <p><a href="/user" className="dark-grey-text">Your Account</a></p>
                            <p><a href="/create" className="dark-grey-text">Create Content</a></p>
                        </Col>
                        <Col md="2" lg="2" xl="2" className="mb-4 dark-grey-text">
                            <h6 className="text-uppercase font-weight-bold"><strong>Follow us</strong></h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '60px'}}/>
                            <div style={{fontSize:"1rem"}}>
                            <p><a href="https://github.com/OasysFoundation" className="dark-grey-text" style={{color:"#27363E"}}><FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/></a></p>
                            <p><a href="https://twitter.com/OasysOrg" className="dark-grey-text" style={{color:"#27363E"}}><FontAwesomeIcon icon={['fab', 'twitter']} className="faAlignRight marginRight5" size="lg"/></a></p>
                            <p><a href="https://www.instagram.com/oasyseducation/" className="dark-grey-text" style={{color:"#27363E"}}><FontAwesomeIcon icon={['fab', 'instagram']} className="faAlignRight marginRight5" size="lg"/></a></p>
                            </div>
                        </Col>
                        <Col md="4" lg="3" xl="3" className="mb-4 dark-grey-text">
                            <h6 className="text-uppercase font-weight-bold"><strong>Contact</strong></h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '60px'}}/>
                            <p><i className="fa fa-home mr-3"></i> Berlin, 10115 🇩🇪</p>
                            <p><i className="fa fa-envelope mr-3"></i> info@joinoasys.com</p>
                        </Col>
                    </Row>
                </Container>
            </Footer>
        );
    }
}

export default FooterPage;