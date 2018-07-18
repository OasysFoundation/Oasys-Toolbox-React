function generateSlideTimes(n) {
    let a = [];
    let i=0;
    while(true) {
        a.push({i: i, t: Math.random()*60}); // max 1 minute per slide
        if (i===n) { break; }
        else if (Math.random() > 0.9 && i > 0) { i--; }
        else {i++; }
    }
    if (Math.random() > 0.7) {
        let maxnr = Math.round(Math.random()*a.length);
        return a.slice(0,maxnr);
    } else {
        return a;
    }
}


function generateQuizAnswers(n) {
    let a = [];
    for (let i=0; i<n; i++) {
        if (Math.random() > 0.7) {
            a.push(false);
        } else {
            a.push(true);
        }
    }
    return a;
}

function genSynthData() {
    let contents = [];
    let comments = [];
    let ratings = [];
    for (let i=0;i<4;i++) {
        let nSlides = 20 - Math.round(Math.random() * 10);
        let nQuiz = 4 - Math.round(Math.random() * 3);
        let nUsers = 25 - Math.round(Math.random() * 10);
        for (let j=0;j<nUsers;j++) {
            let startTime = new Date();
            startTime.setTime(startTime.getTime() - Math.round(Math.random()*60*60*24*1000*30)); // startTime in interval [now-30 days, now]
            let endTime = new Date();
            endTime.setTime(startTime.getTime() + Math.round(Math.random()*60*24*1000)); 
            if (Math.random > 0.8) {
                endTime = null;
            }
            let slideTimings = generateSlideTimes(nSlides);
            //let quizAnswers = generateQuizAnswers(nQuiz);
            let contentId = "My Content " + (i + 1);
            let content = {contentId: contentId, startTime: startTime, endTime: endTime, accessTimes: slideTimings}
            contents.push(content);

            let nComments = Math.round(Math.random()*100);
            for (let k=0;k<nComments;k++) {
                let slideNumber = Math.round(Math.random()*nSlides).toString();
                if (Math.random>0.5) {
                    slideNumber = "end";
                }
                let time = null;
                let comment = {contentId: contentId, time: time, comment: "", slideNumber: slideNumber, userId: null, accessUser: null}
                comments.push(comment);
            }

            let nRatings = Math.round(Math.random()*200);
            for (let k=0;k<nRatings;k++) {
                let rating = {
                    contentId: contentId, 
                    rating: Math.round(5*Math.random()), 
                    accessUser: null, 
                    userId: null
                }
                ratings.push(rating);
            }
        }
    }
    let data = {
        contents: contents,
        comments: comments,
        ratings: ratings,
    }
    return data;
}

export {generateSlideTimes, generateQuizAnswers, genSynthData}