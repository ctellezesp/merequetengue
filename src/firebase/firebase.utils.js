import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAEBjuOEqHapkgE_XXggQ_UAEO2XLJz610",
    authDomain: "tecmerequetengue.firebaseapp.com",
    projectId: "tecmerequetengue",
    storageBucket: "tecmerequetengue.appspot.com",
    messagingSenderId: "462136311957",
    appId: "1:462136311957:web:9425c48653142d1ac61b9c"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;