import createStore from "redux-zero";
import globals from "../globals";
// import DEFAULT from "state";


const data = {
    title: "Physics101",
    id: 'project_1245',
    isEditMode: true,
    description: 'LASDIADALAIDA',
    tags: [], //has categories
    activeChapterIndex: 0,
    chapters: [
        {
            title: "Heat and Motion",
            id: "chapter_124552",
            links: [
                {
                    eventId: "ASDASDAS",
                    chapterId: "chapter_99852"
                },
            ],
            // linkIdx: ["chapter_99852"],
            elements: [
                {
                    id: "embed678",
                    type: globals.EDIT_EMBED,
                    content: {
                        provider: 'concord',
                        url: "http://lab.concord.org/embeddable.html#interactives/sam/intermolecular-attractions/3-1-oil-and-water.json"
                    }
                },{
                    id: "schnuckeldi",
                    type: globals.EDIT_VIDEO,
                    content: {
                        url: 'https://www.youtube.com/watch?v=gcS04BI2sbk',
                        cropStart: 100.0,
                        cropEnd: 105.0,
                    }
                },
                {
                    id: "d6363cb1-a398-4637-8528-5b28bf88c5a2",
                    type: globals.EDIT_QUILL,
                    content: "oisdhkashdkajsdhasjkdaksdhaskdaskdhaskdhasldlkashdalskdhalskdhasldhasdkhaskldhasldhaskldASDSASADSaSSD"
                },
                {
                    id: "aaaaaa2222222",
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
                                "action": null,
                                "isSelected": false
                            },
                            {
                                "title": "2 ladi do dari",
                                "image": "",
                                "correct": false,
                                "feedback": "wrong, sorry try again",
                                "action": null,
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
                    id: "aaaaaa222",
                    type: 6,
                    content: "2*2=5"
                },
                {
                    id: "asdwasd2",
                    type: 5,
                    content: {
                        imageUrl: "https://media0.giphy.com/media/l0NwFIAW8xo5VmDQc/giphy.gif"
                    }
                },
            ]

        },
        {
            title: "Feet and Cotion",

            id: "chapter_99852",
            elements: [
                {
                    id: 'wodpsadasdasd',
                    type: 0,
                    content: "YOLO DOLO JOIHSADIOHOAISDHO SAIOHDOIAHSDOI ASHDOIAHD  BAAEMM JAYJAY WOOOHIIII"
                },
                {
                    id: 'OKOOKOOOKOKOK',
                    type: 6,
                    content: "2*5=10"
                },
                {
                    id: 'uiuiiuriuiu',
                    type: 0,
                    content: "NEXT ELEMETE ER E E E "
                }
            ],
            links: [
                {
                    eventId: "jhhoawjdoaw",
                    chapterId: "chapter_100"
                },
            ],
        },
        {
            title: "3rd ! CHAPT",
            id: "chapter_100",
            elements: [
                {
                    id: 'wdadaaaappp',
                    type: 0,
                    content: "Chapter 333 JAMEAS BROWN ASHDOIAHD  BAAEMM JAYJAY WOOOHIIII"
                }
            ],
            links: [
            ],
        }
    ]
}

const store = createStore(data);

export default store;