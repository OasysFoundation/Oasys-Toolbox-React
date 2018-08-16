import React , {Component} from 'react'
import auth from "./auth"
import { Button, Card, CardBody, CardFooter, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Authentication extends Component {
	constructor(props){
		super(props);
		this.state={
			currentView:this.getLoginView(),
			email:"",
			username:"",
			password:"",
			confirmPassword:"",
		}
		// For some reason it doesnt work when i bind in constructor... (WTF?)
		// this.RegisterClicked = this.RegisterClicked.bind(this);
		// this.LoginClicked = this.LoginClicked.bind(this);
		// this.ForgotPasswordClicked = this.ForgotPasswordClicked.bind(this);
		// this.ResetPasswordClicked = this.ResetPasswordClicked.bind(this);
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

	LoginSubmitted(){
		alert("login submitted")
	}


	RegisterSubmitted(){
		alert("RegisterSubmitted")
	}

	ForgotPasswordSubmitted(){
		alert("ForgotPasswordSubmitted")
	}

	ResetPasswordSubmitted(){
		alert("ResetPasswordSubmitted")
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
		                    <Input type="text" placeholder="Email" autoComplete="email" />
		                  </InputGroup>
		                  <InputGroup className="mb-4">
		                    <InputGroupAddon addonType="prepend">
		                      <InputGroupText>
		                        <i className="icon-lock"></i>
		                      </InputGroupText>
		                    </InputGroupAddon>
		                    <Input type="password" placeholder="Password" autoComplete="current-password" />
		                  </InputGroup>
		                  <Row>
		                    <Col xs="6">
		                      <Button color="primary" className="px-4" onClick={this.LoginSubmitted.bind(this)}>Login</Button>
		                    </Col>
		                    <Col xs="6" className="text-right">
		                  		<Button color="primary" className="px-4" onClick={this.RegisterClicked.bind(this)}>Register</Button>
		                    </Col>
		                    <Col xs="6">
		                      <Button color="link" className="px-0" onClick={this.ForgotPasswordClicked.bind(this)}>Forgot password?</Button>
		                    </Col>
		                    <Col xs="6" className="text-right">
		                  		<Button color="link" className="px-0" onClick={this.ResetPasswordClicked.bind(this)}>Reset Password</Button>
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
		                  <Button color="primary" className="mt-3" active onClick={this.RegisterClicked.bind(this)}>Get Started!</Button>
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
	                      <Input type="text" placeholder="Username" autoComplete="username" />
	                    </InputGroup>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>@</InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="text" placeholder="Email" autoComplete="email" />
	                    </InputGroup>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="Password" autoComplete="new-password" />
	                    </InputGroup>
	                    <InputGroup className="mb-4">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="Repeat password" autoComplete="new-password" />
	                    </InputGroup>
	                    <Button color="success" block onClick={this.RegisterSubmitted.bind(this)}>Create Account</Button>
	                  </Form>
	                </CardBody>
	                <CardFooter className="p-4">
	                  <Row>
	                    <Col xs="12">
	                      <Button color="primary" className="px-4" block onClick={this.LoginClicked.bind(this)}>Login</Button>
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
	                    <h1>Register</h1>
	                    <p className="text-muted">Recover your password</p>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>@</InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="text" placeholder="Email" autoComplete="email" />
	                    </InputGroup>
	                   	<Button color="success" block onClick={this.ForgotPasswordSubmitted.bind(this)}>Submit</Button>
	                  </Form>
	                </CardBody>
	                <CardFooter className="p-4">
	                  <Row>
	                    <Col xs="12">
	                      <Button color="primary" className="px-4" block onClick={this.LoginClicked.bind(this)}>Login</Button>
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
	                    <h1>Register</h1>
	                    <p className="text-muted">Reset your password</p>
	                    <InputGroup className="mb-3">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="Old Password" autoComplete="new-password" />
	                    </InputGroup>
	                    <InputGroup className="mb-4">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="New Password" autoComplete="new-password" />
	                    </InputGroup>
	                    <InputGroup className="mb-4">
	                      <InputGroupAddon addonType="prepend">
	                        <InputGroupText>
	                          <i className="icon-lock"></i>
	                        </InputGroupText>
	                      </InputGroupAddon>
	                      <Input type="password" placeholder="Repeat password" autoComplete="new-password" />
	                    </InputGroup>
	                    <Button color="success" block onClick={this.ResetPasswordSubmitted.bind(this)}>Submit</Button>
	                  </Form>
	                </CardBody>
	                <CardFooter className="p-4">
	                  <Row>
	                    <Col xs="12">
	                      <Button color="primary" className="px-4" block onClick={this.LoginClicked.bind(this)}>Login</Button>
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
		 	</div>
		)
	}
}
export default Authentication;