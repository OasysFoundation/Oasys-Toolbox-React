function generateSlideTimes(n) {
    let a = [];
    let i=0;
    while(true) {
        a.push({i: i, t: Math.random()*60}); // max 1 minute per slide
        if (i==n) { break; }
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

 function generateSynthData(){
    let allContentsForUser = [];
    for (let i=0;i<4;i++) {
        let oneContentForUser = [];
        let nSlides = 20 - Math.round(Math.random() * 10);
        let nQuiz = 4 - Math.round(Math.random() * 3);
        let nUsers = 25 - Math.round(Math.random() * 10);
        for (let j=0;j<nUsers;j++) {
            let startTime = new Date();
            startTime.setTime(startTime.getTime() - Math.round(Math.random()*60*60*24*1000*30)); // startTime in interval [now-30 days, now]
            let endTime = new Date();
            endTime.setTime(startTime.getTime() + Math.round(Math.random()*60*24*1000)); 
            let slideTimings = generateSlideTimes(nSlides);
            let quizAnswers = generateQuizAnswers(nQuiz);
            let contentId = "content " + (i + 1);
            let duration = new Date();
            duration.setTime(endTime.getTime() - startTime.getTime());
            let content = {contentId: contentId, startTime: startTime, endTime: endTime, accessTimes: slideTimings, quizAnswers: quizAnswers, duration: duration}
            oneContentForUser.push(content);
        }
        allContentsForUser.push(oneContentForUser);
    }
    return allContentsForUser;
}


export {generateSlideTimes, generateQuizAnswers, generateSynthData}