import glb from "./globals";
// require('dotenv').config()


//READ if we are in DEV(npm start) or PROD (npm run build) and change the API LOCATION accordingly


const DEV = process.env.NODE_ENV === 'development';
const USE_REMOTE = true;
// const API = DEV && USE_REMOTE ? glb.API_DEV_REMOTE : (DEV && !USE_REMOTE ? glb.API_DEV_LOCAL : glb.API_PROD);
// console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV} so I app uses << ${API} >> to make API CALLS`)


//replace BASE_URL with API when ready
const BASE_URL = glb.API_PROD;
//const BASE_URL = glb.API_DEV_LOCAL;

//Markus: I use a Promise instead of a callback so you can chain
//with .then and .catch (errorhandling) inside the component and

const api = {
    getContentsForCreator: function (user) {
        const url = BASE_URL + 'getAllContentsForCreator/' + user.displayName;
        return get(url);
    },
    getCommentsForCreator: function (user) {
        const url = BASE_URL + 'getAllComments/' + user.displayName;
        return get(url);
    },
    getRatingsForCreator: function (user) {
        const url = BASE_URL + 'getAllRatings/' + user.displayName;
        return get(url);
    },
    getContent({userName, contentName}) { //ES6 Object destructuring
        const url = `${BASE_URL}user/${userName}/${contentName}`;
        return get(url);
    },
    getCommentsForContent(userId, contentId, slideNumber) { 
        const url = `${BASE_URL}comment/${userId}/${contentId}/${slideNumber}`;
        return get(url);
    },
    getContentsPreview() {
        const url = BASE_URL + 'getContentsPreview/';
        return get(url)
    },
    postImage(img) {
        const url = 'https://api.imgur.com/3/image';
        return fetch(url, {
            method: 'POST',
            body: img,
            headers: new Headers({
             'Authorization': 'Client-ID dab43e1ba5b9c27',
             'Accept': 'application/json'
            })
        });
    },
    getWalletIdForUser(userName) {
        const url = `${BASE_URL}profile/${userName}`;
        return get(url);
    },
    postUserContentAccess(interactionData) {
        const url = `${BASE_URL}saveUserContentAccess`
        return post(url, interactionData)
    },
    getProfileInfo(authUserID) {
        const url = `${BASE_URL}profile/${authUserID}`;
        return get(url)
    },
    postRating(contentOwner, contentName, rating, userWhoRates) {
        const url = `${BASE_URL}rate/${contentOwner}/${contentName}/${rating}/${userWhoRates}`;
        return post(url)
    },
    postComment(userId, contentId, data) {
        const url = `${BASE_URL}comment/${userId}/${contentId}`;
        return post(url, data)
    },
    postContent(userId, contentId, data){
        const url = `${BASE_URL}save/${userId}/${contentId}`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        })
    },
    // what is this for? @markus
    post(url, data = {}) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        })
    },
};

const get = function (url) {
    return fetch(url, {method: 'GET'})
        .then(function (response) {
            return response.json();
        })
        .catch(function (err) {
            console.debug(`
            Content Fetch NO SUCCESS
            URL = ${url}
            ERROR = ${err}
            `)
        })
};

const post = function (url, data = {}) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    })
        .then(function (response) {
            return response.json();
        })
        .catch(function (err) {
            console.debug(`
            Content Fetch NO SUCCESS
            URL = ${url}
            ERROR = ${err}
            `)
        })
};

export default api;