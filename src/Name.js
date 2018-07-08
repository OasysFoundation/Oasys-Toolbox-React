  import React from 'react';


class Name extends React.Component {
 constructor(props) {
    super(props);
    this.state={
      username:null
    };

    }


  render() {
    const profile = 'https://api.joinoasys.org/'+this.props.authUser.uid+'/profile'
        fetch(profile, {
          method: 'GET',
        }).then((response) => {
            response.json().then((body) => {
              console.log(body);
              if(body)
                this.setState({username:body[0].NAME});
            });
        });

      return (
        this.state.username

      )
  }
}
export default Name;   

  