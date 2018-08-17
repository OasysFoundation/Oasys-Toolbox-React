import React , {Component} from 'react'
import * as auth from './auth';
import * as firebase from './firebase';
import { Button, Card, CardBody, CardFooter, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { CardHeader, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import api from '../tools'

const INITIAL_STATE = {
	email:"",
	username:"",
	password:"",
	confirmPassword:"",
	previousPassword:"",
};

class Authentication extends Component {
	constructor(props){
		super(props);
		this.state = { ...INITIAL_STATE };
		this.state={
			currentView:"",
			showModal:false,
			modalTitle:"",
			modalBody:"",
		}


		this.RegisterClicked = this.RegisterClicked.bind(this);
		this.LoginClicked = this.LoginClicked.bind(this);
		this.ForgotPasswordClicked = this.ForgotPasswordClicked.bind(this);
		this.ResetPasswordClicked = this.ResetPasswordClicked.bind(this);
		this.LoginSubmitted = this.LoginSubmitted.bind(this);
		this.RegisterSubmitted = this.RegisterSubmitted.bind(this);
		this.ForgotPasswordSubmitted = this.ForgotPasswordSubmitted.bind(this);
		this.ResetPasswordSubmitted = this.ResetPasswordSubmitted.bind(this);

		this.updateEmail = this.updateEmail.bind(this)
		this.updateUsername = this.updateUsername.bind(this)
		this.updatePassword = this.updatePassword.bind(this)
		this.updateConfirmPassword = this.updateConfirmPassword.bind(this)
		this.updatePreviousPassword = this.updatePreviousPassword.bind(this)

		this.closeModal = this.closeModal.bind(this)
		this.goHome = this.goHome.bind(this)

	}

	componentDidMount(){
		this.setState({
			currentView:this.getLoginView()
		})
	}

	LoginClicked(){
		this.setState({
			currentView:this.getLoginView(),
		})
	}

	RegisterClicked() {
		this.setState({
			currentView:this.getRegisterView(),
		})
	}

	ForgotPasswordClicked(){
		this.setState({
			currentView:this.getForgotPasswordView(),
		})
	}

	ResetPasswordClicked(){
		this.setState({
			currentView:this.getResetPasswordView(),
		})
	}

	LoginSubmitted(event){
		
	}


	RegisterSubmitted(){
		if (this.state.username.indexOf('-') > -1){
			this.setState(() => ({ ...INITIAL_STATE }));
	        this.setState({
	        	modalTitle:"Error",
	        	modalBody:"Usernames cannot contain hyphens (-)",
	        	showModal:"true",
	        });
		}
		else{
			let that = this;
			auth.doCreateUserWithEmailAndPassword(that.state.email, that.state.password)
	            .then(authUser => {
	                auth.doGetIdToken()
	                	.then(function(idToken) {
		            	  const userObject = {
		               	 	"uid": auth.doGetUid(),
		                	"username": that.state.username,
		            	  }
		                  api.postNewUserName(userObject, idToken)
		                    .then((body) => {
		                            if (body.hyphen){
								        that.setState({
								        	modalTitle:"Error",
								        	modalBody:"Usernames cannot contain hyphens (-)",
								        	showModal:"true",
								        });
		                            }
		                            else {
		                                auth.doUpdateProfile(that.state.username)
		                                	.then(function () {
			                                    that.setState(() => ({ ...INITIAL_STATE }));
										        that.setState({
										        	modalTitle:"Weclome to Oasys",
										        	modalBody:"Your account was created successfully",
										        	showModal:"true",
										        })
										    })
			                                .catch(function (error) {
										        that.setState({
										        	modalTitle:"Error",
										        	modalBody:error.message,
										        	showModal:"true",
										        });
			                                });
		                            }
		                    })
		                    .catch(function(err){
						        that.setState({
						        	modalTitle:"Error",
						        	modalBody:"Houston we have a problem. Email us at info@joinoasys.org if this continuous!",
						        	showModal:"true",
						        });
		                  	})
		                })
		                .catch(function (error) {
					        that.setState({
					        	modalTitle:"Error",
					        	modalBody:error.message,
					        	showModal:"true",
					        });
                        })
		            })
		            .catch(function (error) {
				        that.setState({
				        	modalTitle:"Error",
				        	modalBody:error.message,
				        	showModal:"true",
				        });
                    })
		}
	}

	ForgotPasswordSubmitted(){
		auth.doPasswordReset(this.state.email)
		  //SUCCESS
	      .then(() => {
	        this.setState(() => ({ ...INITIAL_STATE }));
	        this.setState({
	        	modalTitle:"Success",
	        	modalBody:"Your password has been reset! Please check your email to retrieve your new password.",
	        	showModal:"true",
	        })
	      })
	      // FAILURE
	      .catch(error => {
	        this.setState({
	        	modalTitle:"Error",
	        	modalBody:error.message,
	        	showModal:"true",
	        });
	      });
	}

	ResetPasswordSubmitted(){
		let that = this;
		auth.doSignInWithEmailAndPassword(this.state.email,this.state.previousPassword)
			.then(function(user){
				auth.doPasswordUpdate(this.state.password)
					.then(function(){
						 that.setState(() => ({ ...INITIAL_STATE }));
						 that.setState({
				        	modalTitle:"Success",
				        	modalBody:"Your password has been changed!",
				        	showModal:"true",
				        });
					})
					.catch(function(error){
						that.setState({
				        	modalTitle:"Error",
				        	modalBody:error.message,
				        	showModal:"true",
				        });
					})
			})
			.catch(function(error){
				that.setState({
		        	modalTitle:"Error",
		        	modalBody:error.message,
		        	showModal:"true",
		        });
			})
	}

	updateEmail(event){
	    this.setState({
	      email: event.target.value
	    });
	}

	updateUsername(event){
		this.setState({
	      username: event.target.value
	    });
	}

	updatePassword(event){
		this.setState({
	      password: event.target.value
	    });
	}

	updateConfirmPassword(event){
		this.setState({
	      confirmPassword: event.target.value
	    });
	}

	updatePreviousPassword(event){
		this.setState({
	      previousPassword: event.target.value
	    });
	}

	closeModal(){
		this.setState({
			showModal:false,
		})
	}

	goHome(){
		window.location.href="/"
	}

	getLoginView() {
		return( 
			<div className="app flex-row align-items-center">
		    <Container>
		      <Row className="justify-content-center">
		        <Col md="8">
		          <CardGroup>
		            <Card className="p-4">
		              <CardBody>
		                <Form>
		                  <h1>Login</h1>
		                  <p className="text-muted">Sign In to your account</p>
		                  <InputGroup className="mb-3">
		                    <InputGroupAddon addonType="prepend">
		        			  <InputGroupText>@</InputGroupText>
		                    </InputGroupAddon>
		                    <Input type="text" placeholder="Email" autoComplete="email" onChange={this.updateEmail}/>
		                  </InputGroup>
		                  <InputGroup className="mb-4">
		                    <InputGroupAddon addonType="prepend">
		                      <InputGroupText>
		                        <i className="icon-lock"></i>
		                      </InputGroupText>
		                    </InputGroupAddon>
		                    <Input type="password" placeholder="Password" autoComplete="current-password" onChange={this.updatePassword}/>
		                  </InputGroup>
		                  <Row>
		                    <Col xs="6">
		                      <Button color="primary" className="px-4" onClick={this.LoginSubmitted}>Login</Button>
		                    </Col>
		                    <Col xs="6" className="text-right">
		                  		<Button color="primary" className="px-4" onClick={this.RegisterClicked}>Register</Button>
		                    </Col>
		                    <Col xs="6">
		                      <Button color="link" className="px-0" onClick={this.ForgotPasswordClicked}>Forgot password?</Button>
		                    </Col>
		                    <Col xs="6" className="text-right">
		                  		<Button color="link" className="px-0" onClick={this.ResetPasswordClicked}>Reset Password</Button>
		                    </Col>
		                  </Row>
		                </Form>
		              </CardBody>
		            </Card>
		            <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
		              <CardBody className="text-center">
		                <div>
		                  <h2>Welcome to Oasys</h2>
		                  <p>Learn Science and Technology through experimentation and play! Oasys makes it easy to create highly interactive educational content </p>
		                  <Button color="primary" className="mt-3" active onClick={this.RegisterClicked}>Get Started!</Button>
		                </div>
		              </CardBody>
		            </Card>
		          </CardGroup>
		        </Col>
		      </Row>
		    </Container>
		  </div>
		)
	}
	
	getRegisterView(){
		return(
	      <div className="app flex-row align-items-center">
	        <Container>
	          <Row className="justify-content-center">
	            <Col md="6">
	              <Card className="mx-4">
	                <CardBody className="p-4">
	                  <Form>
	                    <h1>Register</h1>
	                    <p className="text-muted">Create your account</p>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-user"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="text" placeholder="Username" autoComplete="username" onChange={this.updateUsername}/>
	                    </InputGroup>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>@</InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="text" placeholder="Email" autoComplete="email" onChange={this.updateEmail}/>
	                    </InputGroup>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="Password" autoComplete="new-password"  onChange={this.updatePassword}/>
	                    </InputGroup>
	                    <InputGroup className="mb-4">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="Repeat password" autoComplete="new-password"  onChange={this.updateConfirmPassword}/>
	                    </InputGroup>
	                    <Button color="success" block onClick={this.RegisterSubmitted}>Create Account</Button>
	                  </Form>
	                </CardBody>
	                <CardFooter className="p-4">
	                  <Row>
	                    <Col xs="4">
	                      <Button color="primary" className="px-4" block onClick={this.LoginClicked}>Back</Button>
	                    </Col>
	                  </Row>
	                </CardFooter>
	              </Card>
	            </Col>
	          </Row>
	        </Container>
	      </div>
	     )
	}

	getForgotPasswordView(){
		return (
		  <div className="app flex-row align-items-center">
	        <Container>
	          <Row className="justify-content-center">
	            <Col md="6">
	              <Card className="mx-4">
	                <CardBody className="p-4">
	                  <Form>
	                    <h1>Forgot Password</h1>
	                    <p className="text-muted">Recover your password</p>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>@</InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="text" placeholder="Email" autoComplete="email"  onChange={this.updateEmail}/>
	                    </InputGroup>
	                   	<Button color="success" block onClick={this.ForgotPasswordSubmitted}>Submit</Button>
	                  </Form>
	                </CardBody>
	                <CardFooter className="p-4">
	                  <Row>
	                    <Col xs="4">
	                      <Button color="primary" className="px-4" block onClick={this.LoginClicked}>Back</Button>
	                    </Col>
	                  </Row>
	                </CardFooter>
	              </Card>
	            </Col>
	          </Row>
	        </Container>
	      </div>
		)
	}

	getResetPasswordView(){
		return (
		  <div className="app flex-row align-items-center">
	        <Container>
	          <Row className="justify-content-center">
	            <Col md="6">
	              <Card className="mx-4">
	                <CardBody className="p-4">
	                  <Form>
	                    <h1>Reset Password</h1>
	                    <p className="text-muted">Reset your password</p>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>@</InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="text" placeholder="Email" autoComplete="email"  onChange={this.updateEmail}/>
	                    </InputGroup>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="Old Password" autoComplete="new-password"  onChange={this.updatePreviousPassword}/>
	                    </InputGroup>
	                    <InputGroup className="mb-4">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="New Password" autoComplete="new-password"  onChange={this.updatePassword}/>
	                    </InputGroup>
	                    <InputGroup className="mb-4">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="Repeat password" autoComplete="new-password"  onChange={this.updateConfirmPassword}/>
	                    </InputGroup>
	                    <Button color="success" block onClick={this.ResetPasswordSubmitted}>Submit</Button>
	                  </Form>
	                </CardBody>
	                <CardFooter className="p-4">
	                  <Row>
	                    <Col xs="4">
	                      <Button color="primary" className="px-4" block onClick={this.LoginClicked}>Back</Button>
	                    </Col>
	                  </Row>
	                </CardFooter>
	              </Card>
	            </Col>
	          </Row>
	        </Container>
	      </div>
		)
	}

	render(){
		return(
			<div>
		 		{this.state.currentView}
		 		<Modal isOpen={this.state.showModal} toggle={this.toggleSmall}
                       className={'modal-sm ' + this.props.className}>
                  <ModalHeader toggle={this.toggleSmall}>{this.state.modalTitle}</ModalHeader>
                  <ModalBody>
                    {this.state.modalBody}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.closeModal}>Close</Button>
                    <Button color="primary" onClick={this.goHome}>Home</Button>
                  </ModalFooter>
                </Modal>
		 	</div>
		)
	}
}
export default Authentication;