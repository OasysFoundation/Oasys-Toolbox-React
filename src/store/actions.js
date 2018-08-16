//TODO use my mongo functions to do upsert, insert, find for STATE etc
//use immutable
import update from 'immutability-helper'
import {moveEntry, withoutEntry, getObjectsByKey} from "../utils/trickBox";
import {initContent} from "../tools";
import uuidv4 from 'uuid/v4';
import globals from '../globals'

const actions = function (store) { //store for async stuff
    return {
        //state variable gets inject into the action functions somehow through the connect(maptoprops, action)
        onToggleEditMode(state){
            return update(state, {isEditMode: {$set: !state.isEditMode}})
        },

        mergeStoreWithSessionStorage(state) {
            const clone = JSON.parse(JSON.stringify(state));
            //deep searches data and returns 1D array with objects that have an ID property
            //by reference!
            const allWithID = getObjectsByKey([clone], 'id');
            const sessionKeys = Object.keys(sessionStorage).filter(key => key.includes(globals.SESSIONSTORAGE_KEY))
            //get
            sessionKeys.forEach(key => {
                const matchFromState = allWithID.find(el => globals.SESSIONSTORAGE_KEY + el['id'] === key)
                console.log(matchFromState, "FOUND in STATE!", key)
                if (matchFromState) {
                    const matchFromSession = JSON.parse(sessionStorage.getItem(key));
                    console.log(matchFromSession, "FOUND in SESSION!", key);

                    if (matchFromSession.timestamp >= matchFromState.timestamp) {
                        console.log('Compare two Items session - state', matchFromSession, matchFromState);

                        matchFromState.content = matchFromSession.content;

                    }
                }
            });

            console.log('new store version', clone)
            return clone;
        },


        onChangeProjectTitle(state, value) {
          return update(state, {title: {$set: value}})
        },

        onChangeProjectDescription(state, value) {
          return update(state, {description: {$set: value}})
        },

        onChangeProjectTags(state, tags) {
            return update(state, {tags: {$set: tags}})
        },

        onChangeContent(state, id, value, elementChapter) {

            console.log(value, id)
            //more verbose, but performant (instead of Json.stringify)
            const currentChapterIdx = state.chapters.findIndex(chapter => chapter.id === elementChapter);
            let elements = state.chapters[currentChapterIdx].elements;

            const elemIdx = elements.findIndex(el => el.id === id);
            if (!elements[elemIdx]) {
                console.log('no element found on change content -- maybe handlechange fired, but element in Chapter that is not active')
                return
            };

            return update(state, {
                chapters: {
                    [currentChapterIdx]: {
                        elements: {
                            [elemIdx]: {
                                content: {$set: value},
                                timestamp: {$set: Date.now()}
                            }
                        }
                    }
                }
            })
        },


        // onChangeContent_old(state, id, value, elementChapter) {
        //     const clone = JSON.parse(JSON.stringify(state));
        //     const currentChapter = clone.chapters.find(chapter => chapter.id === elementChapter);
        //     let elements = currentChapter.elements;
        //
        //     const elem = elements.find(el => el.id === id);
        //     if (!elem) {
        //         console.log('no element found on change content -- maybe handlechange fired, but element in Chapter that is not active')
        //         return
        //     };
        //
        //     elem.content = value;
        //     elem.timestamp = Date.now();
        //
        //     currentChapter.elements = elements;
        //     return clone
        // },

        onChangeActiveChapter(state, id) {
            const index = state.chapters.findIndex(chapter => chapter.id.toString() === id.toString());
            // console.log("new active chapter idx:  ", index)
            return update(state, {activeChapterIndex: {$set: index}})
        },

        onChangeChapterTitle(state, value, id) {
            const clone = JSON.parse(JSON.stringify(state));
            let chap = clone.chapters[state.activeChapterIndex];
            chap.title = value;
            chap.timestamp = Date.now();
            return clone
        },

        onAddChapter(state, uid, title) {
            const clone = JSON.parse(JSON.stringify(state));

            const activeChapter = clone.chapters[state.activeChapterIndex];
            activeChapter.links.push({
                eventId: uuidv4(),
                chapterId: uid
            });
            clone.chapters[state.activeChapterIndex] = activeChapter;

            clone.chapters.push(
                {
                    id: uid,
                    title: title || `|| Untitled Chapter ||`,
                    elements: [],
                    // linkIdx: [1],
                    links: [],
                    timestamp: Date.now()
                }
            );

            return clone
        },

        onMoveElement(state, id, direction) {
            let elements = state.chapters[state.activeChapterIndex].elements;
            const entryIdx = elements.findIndex(el => el.id === id);

            return update(state, {
                chapters:{
                    [state.activeChapterIndex]: {
                        elements:{ $set: moveEntry(elements, entryIdx, direction)}
                    }

                }
            })
        },

        onDeleteElement(state, id) {
            const clone = JSON.parse(JSON.stringify(state));
            let elements = clone.chapters[state.activeChapterIndex].elements;
            const entryIdx = elements.findIndex(el => el.id === id.toString());

            if (entryIdx < 0) {
                console.log("NO ID FOUND @ DELETE")
                return state
            }
            clone.chapters[state.activeChapterIndex].elements = withoutEntry(elements, entryIdx);

            return clone
        },

        onAddElement(state, typeSelected, atIdx) {
            const clone = JSON.parse(JSON.stringify(state));
            let elements = clone.chapters[state.activeChapterIndex].elements;
            const newElem = {
                id: uuidv4(),
                type: typeSelected,
                content: initContent(typeSelected),
                timestamp: Date.now(),
                parentChapterID: clone.chapters[state.activeChapterIndex].id
            };

            clone.chapters[state.activeChapterIndex].elements = [
                ...elements.slice(0, atIdx + 1),
                newElem,
                ...elements.slice(atIdx + 1)
            ];
            console.log("ELEME", clone.chapters[state.activeChapterIndex].elements)
            return clone
        }
    }
}

export default actions