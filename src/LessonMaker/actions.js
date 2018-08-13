//TODO use my mongo functions to do upsert, insert, find for STATE etc


export const actions = function (store) { //store for async stuff
    return {
        //state variable gets inject into the action functions somehow through the connect(maptoprops, action)
        setFirstName(state, value){
            console.log('setFirstName state', state, "spread", {...state.currentPerson, firstName:value});
            const newCurrentPerson = {...state.currentPerson, firstName: value};
            return {currentPerson :newCurrentPerson};
        },
        setLastName: (state, event) => ({
            currentPerson: {...state.currentPerson, lastName: event.target.value}
        }),
        asyncTest: async () => {
            // const people = await api.getPeople(5);
            // store.setState({ people });
        }
    }
};

export default actions;