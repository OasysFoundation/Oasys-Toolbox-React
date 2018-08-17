 import React, {Component} from 'react'
 import './About.css'
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


 //Image imports, can probably be optimized
 import robbie from "./images/robbie.jpeg"
 import daniel from "./images/daniel.jpeg"
 import frederik from "./images/frederik.jpeg"
 import markus from "./images/markus.jpeg"
 import contentCreation from "./images/contentCreation.png"
 import pedagogy from "./images/pedagogy.png"
 import learningEffectiveness from "./images/learningEffectiveness.png"



class About extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
    
      <div>
        <header className="masthead text-white text-center vertical-center">
          <div className="my-container">
          </div>
          <div className="container h-100">
            <div className="row h-100">
              <div className="col-lg-8 mx-auto text-center">
                <h2 align="left" className="text-center mb-5 rz-font rz-fontsize-lg text-white">Create, Modify &amp; Earn from Educational Content</h2>
                <p align="left" className="text-center lead mb-5 rz-font text-white">We aim to connect teachers, students, and coders to make the creation of interactive educational contents easy, fun and rewarding.</p>
                <div className="form-row mx-auto text-center">
                  <div className="mx-auto col-8 mb-2">
                    <form action="/">
                      <button type="submit" className="btn btn-block btn-lg btn-primary button1 pl-0 pr-0 mx-auto rz-font"><small>Take Me to Oasys!</small></button>
                    </form>
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </header>
        <section className="bg-light rz-start rz-no-border-special-2" id="about">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto text-center">
                <h2 className="section-heading">What We Do</h2>
                <hr className="light my-4 rz-small-margin" />
                <p className="text-faded lead mb-4"> 
                  Our authoring tools let you create <em> highly interactive </em> learning experiences - no coding skills required. Our learning experiences focus on simulations, games, quizzes, and interactive plotting tools that make learning more effective and engaging. Remixing, modifying and improving existing contents is made easy. 
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="features-icons rz-no-border-special-1 bg-light text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                  <div className="features-icons-icon d-flex">
                    <img src={contentCreation} className="svg m-auto" style={{height: "100%",width:"auto"}} />
                  </div>
                  <h3>Easy Content Creation</h3>
                  <p className="lead mb-0">Our authoring tools radically decrease barriers for creating all kinds of educational contents or improving existing ones. No coding skills are needed to adapt and remix other people's simulations or educational games.</p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                  <div className="features-icons-icon d-flex">
                    <img src={pedagogy} className="svg m-auto" width="2em" />
                  </div>
                  <h3>Pedagogy over Popularity</h3>
                  <p className="lead mb-0"> Content creators are rewarded fairly based on how well their contents teach a knowledge concept. Our machine learning models estimate the educational value each content brings to the platform. Rewards are distributed via a blockchain-based token system - this ensures easy and secure payouts globally. This also raises the average quality of contents over time.</p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                  <div className="features-icons-icon d-flex">
                    <img src={learningEffectiveness} className="svg m-auto" style={{width: "2em"}}/>
                  </div>
                  <h3>Advance Learning Effectiveness</h3>
                  <p className="lead mb-0">Interactive learning experiences communicate more information than static ones. The problem with  static contents like textbooks and powerpoint slides, is that they dont allow for trial and error, which is necessary for effective learning.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="features-icons rz-no-border bg-white" id="why">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto text-center">
                <h2 className="section-heading">Our Focus is STEM</h2>
                <hr className="light my-4 rz-small-margin" />
                <p className="text-faded lead mb-4">
                  Our Focus is STEM. 80% of high school students graduate without STEM proficiency. STEM subjects are inherently dynamic and complex, and understanding them intuitively requires modeling, interaction, manipulation and play. But this is not what textbooks, lectures, or MOOCs are! Our tools allow creatives and teachers to make and remix high-impact, high bandwith and highly interactive experiences. 
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-light rz-no-border-special-2" id="team">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto text-center">
                <h2 className="section-heading">Meet the Team</h2>
                <hr className="light my-4 rz-small-margin" />
              </div>
            </div>
          </div>
        </section>
        <section className="testimonials rz-no-border-special-1 rz-no-bottom text-center bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-3 mx-auto">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src={robbie} alt="Picture of Robbie Zuazua" />
                  <h5>Robbie Zuazua</h5>
                  <p className="font-weight-light mb-0">Founder, Software Engineer, Business Operations, Climber</p>
                  <p className="font-weight-light mb-0"><a href="https://www.linkedin.com/in/robert-zuazua-231795a8" target="_blank"> <FontAwesomeIcon icon={['fab', 'linkedin-in']} className="faAlignRight marginRight5" size="lg"/> LinkedIn</a></p>
                  <p className="font-weight-light mb-0"><a href="https://github.com/RobZuazua" target="_blank"> <FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/> Github</a></p>
                </div>
              </div>
              <div className="col-lg-3 mx-auto">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src={frederik} alt="Picture of Frederik Riedel" />
                  <h5>Frederik Riedel</h5>
                  <p className="font-weight-light mb-0">Founder, Software Engineer, Platform Design, Climber</p>
                  <p className="font-weight-light mb-0"><a href="https://www.linkedin.com/in/frederik-riedel" target="_blank"> <FontAwesomeIcon icon={['fab', 'linkedin-in']} className="faAlignRight marginRight5" size="lg"/> LinkedIn</a></p>
                  <p className="font-weight-light mb-0"><a href="https://twitter.com/frederikriedel" target="_blank"> <FontAwesomeIcon icon={['fab', 'twitter']} className="faAlignRight marginRight5" size="lg"/> Twitter</a></p>
                  <p className="font-weight-light mb-0"><a href="https://github.com/frogg" target="_blank"> <FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/> Github</a></p>
                </div>
              </div>
              <div className="col-lg-3 mx-auto">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src={daniel} alt="Picture of Daniel Renz" />
                  <h5>Daniel Renz</h5>
                  <p className="font-weight-light mb-0">Founder, Machine Learning PhD, Neuroscience of Learning, Surfer</p>
                  <p className="font-weight-light mb-0"><a href="https://www.linkedin.com/in/daniel-renz-22045b9/" target="_blank"> <FontAwesomeIcon icon={['fab', 'linkedin-in']} className="faAlignRight marginRight5" size="lg"/> LinkedIn</a></p>
                  <p className="font-weight-light mb-0"><a href="https://github.com/dlrenz" target="_blank"> <FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/> Github</a></p>
                </div>
              </div>
              <div className="col-lg-3 mx-auto">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src={markus} alt="Picture of Markus Strasser" />
                  <h5>Markus Strasser</h5>
                  <p className="font-weight-light mb-0">Founder, Software Engineer, Game Creator, VR/AR, Artist</p>
                  <p className="font-weight-light mb-0"><a href="https://www.linkedin.com/in/markus-strasser-3098b4165/" target="_blank"> <FontAwesomeIcon icon={['fab', 'linkedin-in']} className="faAlignRight marginRight5" size="lg"/> LinkedIn</a></p>
                  <p className="font-weight-light mb-0"><a href="https://github.com/cocokiri" target="_blank"> <FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/> Github</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="invest" className="showcase bg-white rz-no-border">
          <div className="container">
            <div className="row">
              <div className="text-center mx-auto col-lg-10">
                <h2 className="section-heading">Invest</h2>
                <hr className="light my-4 rz-small-margin" />
                <p className="lead mb-0">
                  Everyone can be a part of the Oasys Project.
                  <br />
                  <br /> 
                  The JOBS ACT of 2012 allows private companies (us) to sell equity to everyday people. After our seed round, we will be raising money through this new regulation. We will aim to list securities bought through our crowdfunding rounds on alternate trading systems, giving investors near instant liquidity after the initial lockup period.
                  <br />
                  <br />
                  We will also be awarding equity to developers and content creators who bring valuable content onto our platform. Join the investor mailing list to stay tuned! 
                </p>
                <div className="col-12 col-md-5 mb-2 mx-auto">
                  <form action="https://interactivelearning.us12.list-manage.com/subscribe/post?u=41cb0bc0776297ab2392d8c32&id=28c3666981" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                    <br />
                    <br />
                    <button type="submit" className="btn btn-block btn-lg btn-primary button2 pl-0 pr-0 mx-auto">Be an Investor </button>
                  </form>
                </div>
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default About;

 

     
   