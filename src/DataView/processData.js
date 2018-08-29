
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

function rearrangeContent(uniqueContentId, title, rawdata, options){
    let learnerPerWeek = [];
    let rewardsPerWeek = [];
    let commentsPerWeek = [];
    for (let j=0; j<options.nWeeks; j++) {
        let t = new Date();
        t.setTime(options.now.getTime() - (options.nWeeks-j-1)*60*60*24*1000*7);
        learnerPerWeek.push({week: t, learner: 0});
        rewardsPerWeek.push({week: t, rewards: 0});
        commentsPerWeek.push({week: t, comments: 0});
    }

    let rawcontent = rawdata.contents.filter(content => content.contentId===uniqueContentId);
    let rawcomment = rawdata.comments.filter(comment => comment.contentId===uniqueContentId);
    let rawrating = rawdata.ratings.filter(rating => rating.contentId===title);

    let startTimes = rawcontent.map(a=>Date.parse(a.startTime));
    for (let j=0; j<options.nWeeks; j++) {
        let t1 = options.now.getTime() - (options.nWeeks-j)*60*60*24*1000*7;
        let t2 = options.now.getTime() - (options.nWeeks-j-1)*60*60*24*1000*7;
        let n = startTimes.filter(t => t >= t1 && t < t2).length;
        learnerPerWeek[j].learner = n;
    }

    let nRewards = 0;
    let nLearner = rawcontent.length;
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
        learner: nLearner,
        learnerPerWeek: learnerPerWeek,
        rewards: nRewards,
        rewardsPerWeek: rewardsPerWeek,
        comments: nComments,
        commentsPerWeek: commentsPerWeek,
        rating: rating,
    };
    return content;
}

function rearrangeData(rawdata, lessons, summary, options) {

    rawdata = sanitize(rawdata);

    let uniqueContentIds = Array.from(new Set(rawdata.contents.map(o=>o.contentId)));
    if (uniqueContentIds.length===0) { 
        return {summary, lessons};
    }

    for (let i=0; i<uniqueContentIds.length; i++) {
        const lessonIdx = lessons.findIndex(lesson=>lesson.id===uniqueContentIds[i]);
        const title = lessons[lessonIdx].title;
        let content = rearrangeContent(uniqueContentIds[i], title, rawdata, options);
        for (let j=0; j<options.nWeeks; j++) {
            summary.learnerPerWeek[j].learner += content.learnerPerWeek[j].learner;
        }
        if (!isNaN(content.rating)) { summary.rating += content.rating; }
        summary.learner += content.learner;

        lessons[lessonIdx].rating = content.rating;
        lessons[lessonIdx].learner = content.learner;
        lessons[lessonIdx].learnerPerWeek = content.learnerPerWeek;
        lessons[lessonIdx].token = content.rewards;
        lessons[lessonIdx].tokenPerWeek = content.rewardsPerWeek;
    }
    summary.rating = Math.round(10 * summary.rating / uniqueContentIds.length) / 10;

    return {summary, lessons};
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