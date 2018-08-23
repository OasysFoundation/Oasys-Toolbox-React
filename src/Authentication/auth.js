import { auth } from './firebase';
import firebase from 'firebase'


window.auth = auth;
// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const doSignInWithFacebook = function() {
  var provider = new firebase.auth.FacebookAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

export const doSignInWithGoogle = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

// Sign out
export const doSignOut = () =>
  auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password);

// get unique id
export const doGetIdToken= () =>
  auth.currentUser.getIdToken(true);

// get unique id
export const doGetUid= () =>
  auth.currentUser.uid;

// get unique id
export const doUpdateProfile= (username) =>
  auth.currentUser.updateProfile({displayName: username});

// check if logged in
export const doGetCurrentUser= () =>
  auth.currentUser
  
 // get display name
export const doGetUsername= () =>
  auth.currentUser.displayName;