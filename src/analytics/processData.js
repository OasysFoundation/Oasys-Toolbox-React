
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

function rearrangeData(rawdata) {

    let nWeeks = 8;
    let uniqueContentIds = Array.from(new Set(rawdata.contents.map(o=>o.contentId)));
    let data = {
        contents: [],
        usersPerWeek: [],
        rewardsPerWeek: [],
        commentsPerWeek: [],
        users: 0,
        comments: 0,
        rating: 0,
    }

    let now = new Date();
    for (let i=0; i<nWeeks; i++) {
        let t = new Date();
        t.setTime(now.getTime() - (nWeeks-i-1)*60*60*24*1000*7);
        data.usersPerWeek.push({week: t, users: 0});
        data.rewardsPerWeek.push({week: t, rewards: 0});
        data.commentsPerWeek.push({week: t, comments: 0});
    }

    for (let i=0; i<uniqueContentIds.length; i++) {
        let usersPerWeek = [];
        let rewardsPerWeek = [];
        let commentsPerWeek = [];
        for (let j=0; j<nWeeks; j++) {
            let t = new Date();
            t.setTime(now.getTime() - (nWeeks-j-1)*60*60*24*1000*7);
            usersPerWeek.push({week: t, users: 0});
            rewardsPerWeek.push({week: t, rewards: 0});
            commentsPerWeek.push({week: t, comments: 0});
        }

        let rawcontent = rawdata.contents.filter(content => content.contentId===uniqueContentIds[i]);
        let rawcomment = rawdata.comments.filter(comment => comment.contentId===uniqueContentIds[i]);

        // we have an array of objects, where attrib accessTimes is an array of objects 
        // from which we extract slide number i. Then we take the max across all of these slide numbers.
        let nSlides = Math.max(...rawcontent.map(o=>o.accessTimes).reduce((p,q)=>p.concat(q),[]).map(r=>r.i));

        let usersPerSlide = [];
        for (let j=0; j<nSlides+1; j++) { // hack + 1
            usersPerSlide.push({slide: j+1, users: 0, comments: 0});
        }

        let timingTemplate = Array.apply(null, Array(nSlides)).map(Number.prototype.valueOf,0);
        let timings = [];

        for (let j=0; j<rawcontent.length; j++) {
            let timing = wrapTiming(rawcontent[j].accessTimes).map(a => a.time);
            let tt = timingTemplate.slice();
            tt.splice(0, timing.length, ...timing);
            timings.push(tt);
            for (let k=0; k<timing.length; k++) {
                usersPerSlide[k].users++;
            }
        }

        for (let k=0; k<nSlides; k++) {
            let slideNum = k + 1;
            usersPerSlide[k].comments += rawcomment.map(a=>a.slideNumber).filter(a=>a===slideNum.toString()).length;
        }
        
        // need to transpose timings array here
        //let timingsPerSlide = [...Array(nSlides)].map(e => Array(0));
        let timingsPerSlide = [...Array(nSlides+1)].map(e => Array(0)); // this is a hack!
        for (let j=0; j<timings.length; j++) {
            for (let k=0; k<timings[j].length; k++) {
                timingsPerSlide[k].push(timings[j][k]);
            }
        }

        let startTimes = rawcontent.map(a=>Date.parse(a.startTime));
        let commentTimes = rawcomment.map(a=>Date.parse(a.time));

        /*
        let before = now.getTime() - nWeeks*60*60*24*1000*7;
        console.log("times:")
        console.log(before);
        console.log(now.getTime());
        console.log(startTimes.map(t=>t.getTime()));
        */
        for (let j=0; j<nWeeks; j++) {
            let t1 = now.getTime() - (nWeeks-j)*60*60*24*1000*7;
            let t2 = now.getTime() - (nWeeks-j-1)*60*60*24*1000*7;
            let n = startTimes.filter(t => t >= t1 && t < t2).length;
            let m = commentTimes.filter(t => t >= t1 && t < t2).length;
            usersPerWeek[j].users = n;
            data.usersPerWeek[j].users += n;
            commentsPerWeek[j].comments = m;
            data.commentsPerWeek[j].comments += m;
        }

        let rawrating = rawdata.ratings.filter(rating => rating.contentId===uniqueContentIds[i]);

        /*
        let answers = Array.apply(null, Array(nQuiz)).map(Number.prototype.valueOf,0);
        for (let i=0; i<contents.length; i++) {
            for (let j=0; j<contents[i].quizAnswers.length; j++) {
                if (contents[i].quizAnswers[j]) {
                    // TODO: this is inccorectly divided by the number of users that accessed the content.
                    // instead, it should be divided by the number of users who answered this quiz question.
                    answers[j] += 1 / contents.length;
                }
            }
        }
        */

        let nUsers = rawcontent.length;
        let nComments = rawcomment.length;
        let rating = rawrating.map(a=>a.rating);
        let sum = rating.reduce(function(a, b) { return a + b; });
        rating = Math.round(sum*10/rating.length)/10;

        data.users += nUsers;
        data.comments += nComments;
        data.rating += rating;

        let content = {
            id: uniqueContentIds[i],
            nSlides: nSlides,
            usersPerSlide: usersPerSlide, 
            timingsPerSlide: timingsPerSlide,
            answers: [],
            usersPerWeek: usersPerWeek,
            rewardsPerWeek: rewardsPerWeek,
            commentsPerWeek: commentsPerWeek,
            users: nUsers,
            comments: nComments,
            rating: rating,
        };
        data.contents.push(content);
    }

    data.rating = Math.round(10 * data.rating / uniqueContentIds.length) / 10;

    return data;
}



function padNumber(x) {
    return x.toString().padStart(2,'0')
}

function formatTime(time) {
    return padNumber(time.getHours()-1) + "h:" + padNumber(time.getMinutes()) + "m:" + padNumber(time.getSeconds()) + "s";
}


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