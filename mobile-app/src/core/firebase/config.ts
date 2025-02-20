import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDWjeCw5q57XQBAv61N5aJEL2HpPelNOQk',
  authDomain: 'task-pilot-daa45.firebaseapp.com',
  projectId: 'task-pilot-daa45',
  storageBucket: 'task-pilot-daa45.firebasestorage.app',
  messagingSenderId: '188961593738',
  appId: '1:188961593738:web:771e4d49f9c86824161073',
  databaseURL: 'https://task-pilot-daa45.firebaseio.com',
};

function initializeFirebase() {
  try {
    if (!firebase.apps.length) {
      return firebase.initializeApp(firebaseConfig);
    }
    return firebase.app();
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

// Firebase'i başlat
initializeFirebase();

export { auth, firestore };
export default firebase;