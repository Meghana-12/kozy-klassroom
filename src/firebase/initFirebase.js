import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAYIPbrwGqNniT9bSfD0d28Q6RDDn2j1kM',
  authDomain: 'kozy-klassroom.firebaseapp.com',
  projectId: 'kozy-klassroom',
  storageBucket: 'gs://kozy-klassroom.appspot.com/',
  messagingSenderId: '619989557575',
  appId: '1:619989557575:web:f739d31fa04872400f6c62'
};
console.log(firebaseConfig);

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
