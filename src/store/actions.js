//TODO use my mongo functions to do upsert, insert, find for STATE etc
//use immutable
import update from 'immutability-helper'
import {moveEntry, withoutEntry} from "../utils/trickBox";
import {initContent} from "../tools";
import uuidv4 from 'uuid/v4'

const actions = function (store) { //store for async stuff
    return {
        //state variable gets inject into the action functions somehow through the connect(maptoprops, action)

        onChangeContent(state, id, value) {
            const clone = JSON.parse(JSON.stringify(state));
            let elements = clone.chapters[state.activeChapterIndex].elements;

            const elem = elements.find(el => el.id === id);
            elem.content = value;
            elem.timestamp = Date.now();

            clone.chapters[state.activeChapterIndex].elements = elements;

            return clone
        },
        onChangeActiveChapter(state, id) {
            console.log(state, "STAATE on active")
            const index = state.chapters.findIndex(chapter => chapter.id.toString() === id.toString());
            console.log("new active chapter idx:  ", index)
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
            const lastChapterId = state.chapters[state.chapters.length-1].id;

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
            const clone = JSON.parse(JSON.stringify(state));
            let elements = clone.chapters[state.activeChapterIndex].elements;
            const entryIdx = elements.findIndex(el => el.id === id);

            console.log(clone, 'state', state, state.activeChapterIndex, clone.activeChapterIndex)
            clone.chapters[clone.activeChapterIndex].elements = moveEntry(elements, entryIdx, direction)

            return clone;
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
                timestamp: Date.now()
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