import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Freddie extends Component {
    render() {
        return (
            <div>
                {this.props.name}
            </div>
        );
    }
}

Freddie.propTypes = {
    name: PropTypes.string
};



//PROMISE EXAMPLE
const myFetch = function(params) {
    return new Promise(function(resolve, reject) {
        window.setTimeout(function() {
            if (data === params.id) {
                resolve(data) //passes data to the .then handler
            }
            reject("error")
        }, 2000)
    })
};

fetch
    .then(function(data){console.log(data)}
        .catch())