import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import { increment as _increment } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(import.meta.env.MODE);

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
if (!Firebase.apps.length) {
  Firebase.initializeApp(firebaseConfig);
}

export const firestore = Firebase.firestore();
export const storage = Firebase.storage();
export const FieldValue = Firebase.firestore.FieldValue;
export const increment = _increment;

// // Use FirestoreSettings.cache instead of enablePersistence
// firestore.settings({
//   cacheSizeBytes: Firebase.firestore.CACHE_SIZE_UNLIMITED,
//   merge: true,
//   // Remove experimentalForceLongPolling to avoid conflict
// });

// // Handle potential errors
// firestore
//   .enableNetwork()
//   .then(() => {
//     console.log('Network enabled');
//   })
//   .catch((err) => {
//     console.error('Error enabling network:', err);
//   });

export default Firebase;
