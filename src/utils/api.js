import glb from "./globals";
import store from '../store/store'

//READ if we are in DEV(npm start) or PROD (npm run build) and change the API LOCATION accordingly
// const DEV = process.env.NODE_ENV === 'development';
// const USE_REMOTE = true;

/*
const API = DEV && USE_REMOTE ? glb.API_DEV_REMOTE : (DEV && !USE_REMOTE ? glb.API_DEV_LOCAL : glb.API_PROD);
*/

// console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV} so I app uses << ${API} >> to make API CALLS`)


const BASE_URL = glb.API_PROD;
//const BASE_URL = glb.API_DEV_LOCAL;

console.log('BACKEND API : ', BASE_URL)

//const BASE_URL = glb.API_PROD;
//const BASE_URL = glb.API_DEV_LOCAL;

//Markus: I use a Promise instead of a callback so you can chain
//with .then and .catch (errorhandling) inside the component and

function getIdTokenFromStore() {
    const idToken = store.getState().user.idToken;
    if (! idToken) console.log('no idToken in store @ api call')
    else return idToken
}

function getUserIdFromStore() {
    const uid = store.getState().user.uid;
    if (! uid) console.log("no usedID in store @ api call");
    else return uid
}


const api = {
    getContentsForCreator: function (user) {
        // this returns all analytics info
        const url = BASE_URL + 'getAllContentsForCreator/' + user.uid;
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
    getContent(uid, contentId) { //ES6 Object destructuring
        const url = `${BASE_URL}user/${uid}/${contentId}`;
        return get(url);
    },
    getCommentsForContent(userId, contentId, slideNumber) { 
        const url = `${BASE_URL}comment/${userId}/${contentId}/${slideNumber}`;
        return get(url);
    },
    getContentsPreview() {
        const url = BASE_URL + 'getContentsPreview/';
        return get(url);
    },
    getContentById(contentId) {
        const url = BASE_URL + 'getContentById/' + contentId;
        return get(url);
    },
    // getContentByUserNameAndTitle(username, title) {
    //     const url = BASE_URL + 'getContentByUserNameAndTitle/' + username + "/" + title;
    //     return get(url);
    // },
    getUserContentsPreview() {
        const userId = getUserIdFromStore();
        const url = `${BASE_URL}getUserContentsPreview/${userId}`;
        return get(url);
    },
    getUsersPublicContentsPreview(uid) {
        const url = `${BASE_URL}contentsPreviewPublishedUserPage/${uid}`;
        return get(url);
    },
    getWalletIdForUser(userName) {
        const url = `${BASE_URL}profile/${userName}`;
        return get(url);
    },
    getProfileInfo(authUserID) {
        const url = `${BASE_URL}profile/${authUserID}`;
        return get(url);
    },
    getGifsForSearch(searchString) {

        return new Promise(function(resolve, reject) {
            const apiKey = "eSrUzEyD4PP4I0gv7jFebYv5x7iW24kN";
            const url = "//api.giphy.com/v1/gifs/search?q=" + searchString + "&api_key=" + apiKey;
            get(url).then(function(result) {
                const gifs = result["data"].map(function(element) {
                    return element["images"]["downsized"]["url"];
                });
                resolve(gifs);
            });
        });
    },
    getImagesForSearch(searchString) {
        searchString = searchString.split(' ').join("+");
        return new Promise(function(resolve, reject) {
            const apiKey = "9813357-8b0c5da381a974994abb6a8c9";
            const url = "https://pixabay.com/api/?key=" + apiKey + "&q=" + searchString;
            get(url).then(function(result) {
                const imageUrls = result["hits"].map(function(element) {
                    return element["webformatURL"];
                });
                resolve(imageUrls);
            });
        });
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
    postUserContentAccess(interactionData) {
        const token = getIdTokenFromStore()
        const url = `${BASE_URL}saveUserContentAccess/`
        //uid
        return post(url, token, interactionData)
    },
    postRating(ratingData) {
        const token = getIdTokenFromStore()

        //contentOwner, contentName, rating, userWhoRates,
        const url = `${BASE_URL}rate/`;
        ///${contentOwner}/${contentName}/${rating}/${userWhoRates}
        //uid
        return post(url, token, ratingData)
    },
    postNewUserName(userData) {
        const token = getIdTokenFromStore()

        const url = BASE_URL + "newUsername/" 
        return post(url, token, userData);
    },
    postWalletId(walletData) {
        const token = getIdTokenFromStore()

        const url = BASE_URL + "postWalletId/"
        return post(url, token, walletData);
    },
    /*Pass data in URL until we figure out how to refactor this one*/
    postTitlePic(username, contentId, data, uid) {
        const token = getIdTokenFromStore()

        const url = BASE_URL + "uploadTitle/" + username + "/" + contentId;
        return fetch(url, {
            method: 'POST',
            body: data,
            arrayKey: '',
            headers: new Headers({
                'Authorization': `${token}`,
            })
        })
    },
    /*Pass data in URL until we figure out how to refactor this one*/
    postProfilePic(uid, data) {
        const token = getIdTokenFromStore()

        const url = BASE_URL + "uploadProfilePic/" + uid;
        return fetch(url, {
            method: 'POST',
            body: data,
            arrayKey: '',
            headers: new Headers({
                'Authorization': `${token}`,
            })
        })
    },
    postComment(commentData) {
        const token = getIdTokenFromStore()

        const url = `${BASE_URL}comment/`;
        return post(url, token, commentData)
    },
    postContent(contentData){
        const token = getIdTokenFromStore()

        const url = `${BASE_URL}save/`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(contentData),
            headers:
                new Headers({
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            })
        })
    },
    deleteContent(data){
        const token = getIdTokenFromStore()

        const url = `${BASE_URL}remove`;
        return post(url, token, data);
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

const post = function (url, token, data = {}) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
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
            throw err
        })
};

export default api;
