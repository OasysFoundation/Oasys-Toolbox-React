
import firebase from 'firebase/app';
import 'firebase/auth'


const config = {
    apiKey: "AIzaSyBbyPM-pBWaV_MVGqUm7C-F0BFyEMYBuKY",
    authDomain: "oasys-create.firebaseapp.com",
    databaseURL: "https://oasys-create.firebaseio.com",
    projectId: "oasys-create",
    storageBucket: "oasys-create.appspot.com",
    messagingSenderId: "1087055758389"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
  auth,
};

