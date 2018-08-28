
function wrapTiming(x) {
    let a = [];
    for (let i=0; i<x.length; i++) {
        if (x[i].i < a.length) {
            a[x[i].i].time = a[x[i].i].time + x[i].t;
        } else {
            a.push({slide: x[i].i, time: x[i].t});
        }
    }
    return a;
}

function initData(options){
    let data = {
        contents: [],
        usersPerWeek: [],
        rewardsPerWeek: [],
        commentsPerWeek: [],
        users: 0,
        comments: 0,
        rating: 0,
    }
    for (let i=0; i<options.nWeeks; i++) {
        let t = new Date();
        t.setTime(options.now.getTime() - (options.nWeeks-i-1)*60*60*24*1000*7);
        data.usersPerWeek.push({week: t, users: 0});
        data.rewardsPerWeek.push({week: t, rewards: 0});
        data.commentsPerWeek.push({week: t, comments: 0});
    }
    return data;
}

function sanitize(rawdata) {
    if (rawdata.comments===undefined) {
        rawdata.comments = [];
    }
    if (rawdata.contents===undefined) {
        rawdata.contents = [];
    }
    if (rawdata.ratings===undefined) {
        rawdata.ratings = [];
    }
    return rawdata;
}

function rearrangeContent(uniqueContentId, rawdata, options){
    let usersPerWeek = [];
    let rewardsPerWeek = [];
    let commentsPerWeek = [];
    for (let j=0; j<options.nWeeks; j++) {
        let t = new Date();
        t.setTime(options.now.getTime() - (options.nWeeks-j-1)*60*60*24*1000*7);
        usersPerWeek.push({week: t, users: 0});
        rewardsPerWeek.push({week: t, rewards: 0});
        commentsPerWeek.push({week: t, comments: 0});
    }

    let rawcontent = rawdata.contents.filter(content => content.contentId===uniqueContentId);
    let rawcomment = rawdata.comments.filter(comment => comment.contentId===uniqueContentId);
    let rawrating = rawdata.ratings.filter(rating => rating.contentId===uniqueContentId);

    let startTimes = rawcontent.map(a=>Date.parse(a.startTime));
    for (let j=0; j<options.nWeeks; j++) {
        let t1 = options.now.getTime() - (options.nWeeks-j)*60*60*24*1000*7;
        let t2 = options.now.getTime() - (options.nWeeks-j-1)*60*60*24*1000*7;
        let n = startTimes.filter(t => t >= t1 && t < t2).length;
        usersPerWeek[j].users = n;
    }

    let nUsers = rawcontent.length;
    let nComments = rawcomment.length;
    let rating = rawrating.map(a=>a.rating);
    
    if (rating.length===0) {
        rating = NaN;
    } else {
        let sum = rating.reduce(function(a, b) { return a + b; });
        rating = Math.round(sum*10/rating.length)/10;
    }

    let content = {
        id: uniqueContentId,
        usersPerWeek: usersPerWeek,
        rewardsPerWeek: rewardsPerWeek,
        commentsPerWeek: commentsPerWeek,
        users: nUsers,
        comments: nComments,
        rating: rating,
    };
    return content;
}

function rearrangeData(rawdata) {
    let options = {
        nWeeks: 8,
        now: new Date(),
    }
    rawdata = sanitize(rawdata);
    let data = initData(options);

    let uniqueContentIds = Array.from(new Set(rawdata.contents.map(o=>o.contentId)));

    if (uniqueContentIds.length===0) { 
        return data;
    }

    for (let i=0; i<uniqueContentIds.length; i++) {
        let content = rearrangeContent(uniqueContentIds[i], rawdata, options);
        data.contents.push(content);
        for (let j=0; j<options.nWeeks; j++) {
            data.usersPerWeek[j].users += content.usersPerWeek[j].users;
        }
        if (!isNaN(content.rating)) { data.rating += content.rating; }
        data.users += content.users;
    }

    data.rating = Math.round(10 * data.rating / uniqueContentIds.length) / 10;

    return data;
}



function padNumber(x) {
    return x.toString().padStart(2,'0')
}

/*
function formatTime(time) {
    return padNumber(time.getHours()-1) + "h:" + padNumber(time.getMinutes()) + "m:" + padNumber(time.getSeconds()) + "s";
}
*/


function getLastAccess(content) {
    // input: {accessTime: Array of slide access times, startTime: DateTime, endTime: DateTime}
    let accessTime = null;
    if (content.endTime!==null) {
        accessTime = content.endTime;
    } else if (content.accessTimes !== []) {
        accessTime = content.accessTimes[-1].t;
    } else {
        accessTime = content.startTime;
    }
    return accessTime.toLocaleDateString("en-US") + ", " + padNumber(accessTime.getHours())+ ":" + padNumber(accessTime.getMinutes());
}

export {rearrangeData, getLastAccess};