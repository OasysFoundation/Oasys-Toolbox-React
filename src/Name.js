  import React from 'react';


class Name extends React.Component {
 constructor(props) {
    super(props);
    this.state={
      username:null
    };

    const profile = 'https://api.joinoasys.org/profile/'+this.props.authUser.uid
      fetch(profile, {
        method: 'GET',
      }).then((response) => {
          response.json().then((body) => {
            console.log(body);
            if(body)
              this.setState({username:body[0].NAME});
          });
      });
    }


  render() {
      return (
        this.state.username
      )
  }
}
export default Name;   

  