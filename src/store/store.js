import createStore from "redux-zero";
import {initData} from "../utils/types";

const store = createStore(initData);

window.store = store;


export default store;