import createStore from "redux-zero";
import globals from "../utils/globals";
// import DEFAULT from "state";


const data = {
    //status 0 = unknown, 1 = loggedout, 2 = logged in
    user: {
        name: null,
        uid: null,
        idToken: null,
        status:0,
    },
    title: "Physics101",
    author: 'markus123',
    contentId: "6d7324c6-50ca-458e-ad46-cc9df4ee23e3",
    // id: 'project_1245',
    iconName: "001-cells.svg",
    // id: 'project_1245',
    isEditMode: true,
    description: 'LASDIADALAIDA',
    tags: ["physics", "quantumstrangeness"], //has categories
    activeChapterIndex: 0,
    chapters: [
        {
            title: "Heat and Motion",
            id: "chapter_124552",
            links: [
                // {
                //     eventId: "ASDASDAS",
                //     chapterId: "chapter_99852"
                // },
                // {
                //     eventId: "ASDAdddSDAS",
                //     chapterId: "chapter_100"
                // },
            ],
            elements: [
                {
                    parentChapterID: "chapter_124552",
                    id: "embed11",
                    type: 2,
                    content: {
                        id: ''
                    }
                },
                {
                    id: "continue12",
                    type: globals.EDIT_CONTINUE_ELEMENT,
                    content: {
                        action: 'chapter_100'
                    }
                },
                {
                    id: "video13",
                    type: globals.EDIT_VIDEO,
                    content: {
                        url: 'https://www.youtube.com/watch?v=gcS04BI2sbk',
                        cropStart: 100.0,
                        cropEnd: 105.0,
                    }
                },
                {
                    parentChapterID: "chapter_124552",

                    id: "text14",
                    type: globals.EDIT_QUILL,
                    content: "<p>HALLO 1</p>"
                },
                {
                    parentChapterID: "chapter_124552",

                    id: "quiz15",
                    type: globals.EDIT_QUIZ,
                    content: {
                        question: {
                            "title": "how you do i asked???",
                            "image": ""
                        },
                        quizType: "single-choice",
                        answers: [
                            {
                                "title": "1 dudeldi dumm da da",
                                "image": "",
                                "correct": true,
                                "feedback": "correct, your cool",
                                "action": "chapter_100",
                                "isSelected": false
                            },
                            {
                                "title": "2 ladi do dari",
                                "image": "",
                                "correct": false,
                                "feedback": "wrong, sorry try again",
                                "action": "chapter_99852",
                                "isSelected": false
                            },
                            {
                                "title": "3 schub di dubidu",
                                "image": "",
                                "correct": false,
                                "feedback": "wrong, sorry try again",
                                "action": null,
                                "isSelected": false
                            },
                            {
                                "title": "4 nudelholz – Dies ist die Geschichte von Albrecht, dem kleinen Gecko.",
                                "image": "",
                                "correct": false,
                                "feedback": "wrong, sorry try again",
                                "action": null,
                                "isSelected": false
                            }
                        ]
                    }
                },
                {
                    parentChapterID: "chapter_124552",
                    id: "text16",
                    type: 0,
                    content: "HALLO 2"
                },
            ]

        },
        {
            title: "Feet and Cotion",

            id: "chapter_99852",
            elements: [
                {
                    id: 'text21',
                    type: 0,
                    content: "Muffensausen"
                },
                {
                    id: 'formula22',
                    type: 6,
                    content: ""
                },
                {
                    id: 'text22',
                    type: 0,
                    content: "Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgendein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?"
                },
                {
                    id: "text23",
                    type: 0,
                    content: "HALLO"
                },
            ],
            links: [

            ],
        },
        {
            title: "3rd ! CHAPT",
            id: "chapter_100",
            elements: [
                {
                    id: 'text31',
                    type: 0,
                    content: "Chapter 333 JAMEAS BROWN"
                }
            ],
            links: [
            ],
        }
    ]
}

//elements evolved from reptiles to mammals and know their father now
data.chapters.forEach(chapter => chapter.elements.forEach(el => el.parentChapterID = chapter.id));
data.chapters.forEach(chapter => chapter.elements.forEach(el => el.timestamp = 50000));
data.chapters.forEach(chapter => chapter.timestamp = 50000);

const store = createStore(data);

window.store = store;

export default store;