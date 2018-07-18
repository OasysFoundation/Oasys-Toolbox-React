import glb from "./globals";


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
        const url = glb.OASYS_API_BASE + 'getAllContentsForCreator/' + user.displayName;
        return this.get(url, callback);
    },

    getCommentsForCreator: function (user, callback) {
        const url = glb.OASYS_API_BASE + 'getAllComments/' + user.displayName;
        return this.get(url, callback);
    },
    getRatingsForCreator: function (user, callback) {
        const url = glb.OASYS_API_BASE + 'getAllRatings/' + user.displayName;
        return this.get(url, callback);
    },
}

export default api;