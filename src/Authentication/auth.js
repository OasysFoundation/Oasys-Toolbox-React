import { auth } from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

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

export const doCheckLoggedIn= () =>
  auth.currentUser
  