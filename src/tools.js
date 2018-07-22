import glb from "./globals";

const BASE_URL = glb.OASYS_API_BASE;

//Markus: I use a Promise instead of a callback so you can chain
//with .then and .catch (errorhandling) inside the component and

const promiseGet = function(URL) {
    return fetch(URL, {method: 'GET'})
        .then(function (response) {
            return response.json();
        })
        .catch(function(err){
            console.debug("Content Fetch NO SUCCESS")
        })
};

let api = {
    get: function(url, callback) {
        console.log(url)
        fetch(url, {method: 'GET'}).then(function (response) {
            return response.json();
        }).then(callback);
    },

    post: function(url, callback) {
        fetch(url, {method: 'POST'}).then(function (response) {
            return response.json();
        }).then(callback);
    },

    getContentsForCreator: function (user, callback) {
        const url = BASE_URL + 'getAllContentsForCreator/' + user.displayName;
        return this.get(url, callback);
    },

    getCommentsForCreator: function (user, callback) {
        const url = BASE_URL + 'getAllComments/' + user.displayName;
        return this.get(url, callback);
    },
    getRatingsForCreator: function (user, callback) {
        const url = BASE_URL + 'getAllRatings/' + user.displayName;
        return this.get(url, callback);
    },
    getContent( {userName, contentName} ) { //ES6 Object destructuring
        const url = `${BASE_URL}user/${userName}/${contentName}`;
        return promiseGet(url)
    }
}

export default api;