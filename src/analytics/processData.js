
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

function rearrangeData(contents) {
    // find total number of slides. we should change this later by directly
    // importing the content, and looking up number of slides
    let nSlides = 0;
    for (let i=0; i<contents.length; i++) {
        nSlides = Math.max(nSlides, wrapTiming(contents[i].accessTimes).length);
    }
    let nQuiz = 0;
    for (let i=0; i<contents.length; i++) {
        nQuiz = Math.max(nQuiz, wrapTiming(contents[i].quizAnswers).length);
    }

    let usersPerSlide = Array.apply(null, Array(nSlides)).map(Number.prototype.valueOf,0);
    let timingTemplate = Array.apply(null, Array(nSlides)).map(Number.prototype.valueOf,0);
    let timings = []
    for (let i=0; i<contents.length; i++) {
        let timing = wrapTiming(contents[i].accessTimes).map(a => a.time);
        let tt = timingTemplate.slice();
        tt.splice(0, timing.length, ...timing);
        timings.push(tt);
        for (let j=0; j<timing.length; j++) {
            usersPerSlide[j]++;
        }
    }
    let timingsPerSlide = [...Array(nSlides)].map(e => Array(0));
    for (let i=0; i<timings.length; i++) {
        for (let j=0; j<timings[i].length; j++) {
            timingsPerSlide[j].push(timings[i][j])
        }
    }
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
    console.log(answers)
    let data = {
        usersPerSlide: usersPerSlide, 
        timings: timings, 
        nSlides: nSlides, 
        timingsPerSlide: timingsPerSlide,
        answers: answers,
    }
    return data
}

export {rearrangeData};