 import React, {Component} from 'react'
 import './styles/About.css'
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import colors, { hexToRgba } from './utils/colors'
 //Image imports, can probably be optimized
 import robbie from "./assets/images/robbie.jpeg"
 import daniel from "./assets/images/daniel.jpeg"
 import frederik from "./assets/images/frederik.jpeg"
 import markus from "./assets/images/markus.jpeg"
 import contentCreation from "./assets/images/contentCreation.png"
 import pedagogy from "./assets/images/pedagogy.png"
 import learningEffectiveness from "./assets/images/learningEffectiveness.png"

const styles = {
  title: {
        justifyContent: "center",
        textAlign: "center",
        marginTop: "0",
        paddingTop: '10px',
        backgroundColor: hexToRgba(colors.RUST, 0.7),
        textShadow: '0px 0px 3px #6f2002',
  },
  titleFont: {
      fontFamily: 'Charter-Bold',
      fontSize: "2.5rem", 
      fontWeight: '400',
      padding: '10px 20px',
      color: colors.SNOW1,
  },
  subtitleFont: {
      fontFamily: 'Charter-Bold',
      fontSize: '1.8rem',
      fontWeight: '400',
      padding: '10px 20px',
      color: colors.SNOW1,
  },
}

class About extends Component{
  render(){
    return(
    
      <div className="about">
        <header className="masthead">
          <div className="my-container">
          </div>
          <div>
            <div className="row h-100">
              <div className="col-lg-8 mx-auto text-center">
                <div style={styles.title}>
                    <h1 style={styles.titleFont}>
                      Create, Modify &amp; Earn from Educational Content
                    </h1>
                    <h2 style={styles.subtitleFont}>
                      We connect teachers, students, and coders to make the creation of interactive educational contents easy, fun and rewarding
                    </h2>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section className="bg-light rz-start rz-no-border-special-2" id="about">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <h2 className="section-heading">What We Do</h2>
                <hr />
                <p className="text-faded lead mb-4" style={{fontSize: '1.3rem'}}> 
                  Our authoring tools let you create <em> highly interactive </em> learning experiences - no coding skills required. Our learning experiences focus on simulations, games, quizzes, and interactive plotting tools that make learning more effective and engaging. Remixing, modifying and improving existing contents is made easy. 
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <img src={contentCreation} alt="img error" align="right" className="svg" style={{height: "100px",width:"auto", marginLeft: '20px', marginTop: '40px'}} />
                <h3 style={{marginTop: '10px'}}>Easy Content Creation</h3>
                <p className="lead mb-0">Our authoring tools radically decrease barriers for creating all kinds of educational contents or improving existing ones. No coding skills are needed to adapt and remix other people's simulations or educational games.</p>
              </div>
            </div>  
            <div className="row" style={{marginTop: '20px'}}>
              <div className="col-lg-8 mx-auto">
                <img src={learningEffectiveness} alt="img error" align="right" className="svg" style={{height: "100px",width:"auto", marginLeft: '20px', marginTop: '40px'}} />
                <h3 style={{marginTop: '10px'}}>Advance Learning Effectiveness</h3>
                <p className="lead mb-0">Interactive learning experiences communicate more information than static ones. The problem with  static contents like textbooks and powerpoint slides, is that they dont allow for trial and error, which is necessary for effective learning.</p>
              </div>
            </div>  
            <div className="row" style={{marginTop: '20px'}}>
              <div className="col-lg-8 mx-auto">
                <img src={pedagogy} alt="img error" align="right" className="svg" style={{height: "100px",width:"auto", marginLeft: '20px', marginTop: '40px'}} />
                <h3 style={{marginTop: '10px'}}>Pedagogy over Popularity</h3>
                <p className="lead mb-0">Content creators are rewarded fairly based on how well their contents teach a knowledge concept. Our machine learning models estimate the educational value each content brings to the platform. Rewards are distributed via a blockchain-based token system - this ensures easy and secure payouts globally. This also raises the average quality of contents over time.</p>
              </div>
            </div>  
          </div>
        </section>
        <section className="bg-light rz-no-border-special-2 bg-white" id="why">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <h2 className="section-heading">Our Focus is STEM</h2>
                <hr />
                <p className="text-faded lead mb-4" style={{fontSize: '1.3rem'}}> 
                  Our Focus is STEM. 80% of high school students graduate without STEM proficiency. STEM subjects are inherently dynamic and complex, and understanding them intuitively requires modeling, interaction, manipulation and play. But this is not what textbooks, lectures, or MOOCs are! Our tools allow creatives and teachers to make and remix high-impact, high bandwith and highly interactive experiences.  
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-light rz-no-border-special-2" id="team">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <h2 className="section-heading">Meet the Team</h2>
                <hr />
              </div>
            </div>
          </div>
        </section>
        <section className="testimonials rz-no-border-special-1 rz-no-bottom text-center bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-3 mx-auto">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src={robbie} alt="Robbie Zuazua" />
                  <h5>Robbie Zuazua</h5>
                  <p className="font-weight-light mb-0">Founder, Software Engineer, Business Operations, Climber</p>
                  <p className="font-weight-light mb-0"><a href="https://www.linkedin.com/in/robert-zuazua-231795a8" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'linkedin-in']} className="faAlignRight marginRight5" size="lg"/> LinkedIn</a></p>
                  <p className="font-weight-light mb-0"><a href="https://github.com/RobZuazua" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/> Github</a></p>
                </div>
              </div>
              <div className="col-lg-3 mx-auto">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src={frederik} alt="Frederik Riedel" />
                  <h5>Frederik Riedel</h5>
                  <p className="font-weight-light mb-0">Founder, Software Engineer, Platform Design, Climber</p>
                  <p className="font-weight-light mb-0"><a href="https://www.linkedin.com/in/frederik-riedel" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'linkedin-in']} className="faAlignRight marginRight5" size="lg"/> LinkedIn</a></p>
                  <p className="font-weight-light mb-0"><a href="https://twitter.com/frederikriedel" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'twitter']} className="faAlignRight marginRight5" size="lg"/> Twitter</a></p>
                  <p className="font-weight-light mb-0"><a href="https://github.com/frogg" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/> Github</a></p>
                </div>
              </div>
              <div className="col-lg-3 mx-auto">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src={daniel} alt="Daniel Renz" />
                  <h5>Daniel Renz</h5>
                  <p className="font-weight-light mb-0">Founder, Machine Learning PhD, Neuroscience of Learning, Surfer</p>
                  <p className="font-weight-light mb-0"><a href="https://www.linkedin.com/in/daniel-renz-22045b9/" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'linkedin-in']} className="faAlignRight marginRight5" size="lg"/> LinkedIn</a></p>
                  <p className="font-weight-light mb-0"><a href="https://github.com/dlrenz" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/> Github</a></p>
                </div>
              </div>
              <div className="col-lg-3 mx-auto">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img className="img-fluid rounded-circle mb-3" src={markus} alt="Markus Strasser" />
                  <h5>Markus Strasser</h5>
                  <p className="font-weight-light mb-0">Founder, Software Engineer, Game Creator, VR/AR, Artist</p>
                  <p className="font-weight-light mb-0"><a href="https://www.linkedin.com/in/markus-strasser-3098b4165/" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'linkedin-in']} className="faAlignRight marginRight5" size="lg"/> LinkedIn</a></p>
                  <p className="font-weight-light mb-0"><a href="https://github.com/cocokiri" rel="noopener noreferrer" target="_blank"> <FontAwesomeIcon icon={['fab', 'github']} className="faAlignRight marginRight5" size="lg"/> Github</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>


       
      </div>
    );
  }
}

export default About;

 

     
   