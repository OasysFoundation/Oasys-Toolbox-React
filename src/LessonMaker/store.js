import createStore from "redux-zero";
// import DEFAULT from "state";


const testState = {
    people: [],
    currentPerson: {
        firstName: "",
        lastName: ""
    },
    extraSwag: {a:5}
};

const store = createStore(testState);

export default store;