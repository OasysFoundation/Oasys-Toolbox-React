
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
    // find total number of slides. we should change this later by directly
    // importing the content, and looking up number of slides

    let uniqueContentIds = Array.from(new Set(rawdata.contents.map(o=>o.contentId)));
    let data = {
        contents: [],
    }
    for (let i=0; i<uniqueContentIds.length; i++) {
        let rawcontent = rawdata.contents.filter(content => content.contentId===uniqueContentIds[i]);

        // we have an array of objects, where attrib accessTimes is an array of objects 
        // from which we extract slide number i. Then we take the max across all of these slide numbers.
        let nSlides = Math.max(...rawcontent.map(o=>o.accessTimes).reduce((p,q)=>p.concat(q),[]).map(r=>r.i));

        let usersPerSlide = Array.apply(null, Array(nSlides)).map(Number.prototype.valueOf,0);
        let timingTemplate = Array.apply(null, Array(nSlides)).map(Number.prototype.valueOf,0);
        let timings = [];
        for (let i=0; i<rawcontent.length; i++) {
            let timing = wrapTiming(rawcontent[i].accessTimes).map(a => a.time);
            let tt = timingTemplate.slice();
            tt.splice(0, timing.length, ...timing);
            timings.push(tt);
            for (let j=0; j<timing.length; j++) {
                usersPerSlide[j]++;
            }
        }
        // need to transpose timings array
        // let timingsPerSlide = [...Array(nSlides)].map(e => Array(0));
        let timingsPerSlide = [...Array(nSlides+1)].map(e => Array(0)); // this is a hack!
        for (let i=0; i<timings.length; i++) {
            for (let j=0; j<timings[i].length; j++) {
                timingsPerSlide[j].push(timings[i][j])
            }
        }
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
        let content = {
            id: uniqueContentIds[i],
            nSlides: nSlides,
            usersPerSlide: usersPerSlide, 
            timingsPerSlide: timingsPerSlide,
            answers: [],
        };
        data.contents.push(content);
    }
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