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

function fakeAsyncCall(val) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(val * 2);
        }, 3000)
    })
}

async function waitForMany() {
    const at = [2, 4, 5, 3, 12].map(async function (val) {
        return await fakeAsyncCall(val)
    })

    const results = await Promise.all(at);
    console.log('res', results)
    return results
}


//PROMISE EXAMPLE
const myFetch = function (params) {
    return new Promise(function (resolve, reject) {
        window.setTimeout(function () {
            if (data === params.id) {
                resolve(data) //passes data to the .then handler
            }
            reject("error")
        }, 2000)
    })
};
const futureValue = async function () {
    t = await Promise.resolve(new Promise(function (resolve, reject) {
        resolve(5)
    }));
    return t
}
const imwaiting = await futureValue();


fetch
    .then(function (data) {
        console.log(data)
    }
        .catch())