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

// Initialize Firebase and firestore
if (!Firebase.apps.length) {
  Firebase.initializeApp(firebaseConfig);
}

export const firestore = Firebase.firestore();

// // Use the new recommended caching configuration
// firestore.settings({
//   cacheSizeBytes: Firebase.firestore.CACHE_SIZE_UNLIMITED,
//   experimentalAutoDetectLongPolling: true,
//   merge: true,
// });

// // Initialize cache for frequently accessed collections
// const initializeCache = () => {
//   const collections = ['budget', 'budget_items'];

//   collections.forEach((collectionName) => {
//     const query = firestore
//       .collection(collectionName)
//       .where('deleted', '==', false)
//       .where('isActive', '==', true);

//     // Set up a listener to populate cache
//     const unsubscribe = query.onSnapshot(
//       { includeMetadataChanges: true },
//       (snapshot) => {
//         console.log(`Cache initialized for ${collectionName}`);
//         // You can unsubscribe after first server response if you want
//         if (!snapshot.metadata.fromCache) {
//           unsubscribe();
//         }
//       },
//       (error) => {
//         console.error(`Error initializing cache for ${collectionName}:`, error);
//       }
//     );
//   });
// };

// // Call this when your app starts
// initializeCache();

export const storage = Firebase.storage();
export const FieldValue = Firebase.firestore.FieldValue;
export const increment = _increment;

export default Firebase;
