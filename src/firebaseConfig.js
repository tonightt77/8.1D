import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyBW5wI--xChkrF2guhYXDTYQf4_BPsilgA",
  authDomain: "sit313-87ce1.firebaseapp.com",
  projectId: "sit313-87ce1",
  storageBucket: "sit313-87ce1.appspot.com",
  messagingSenderId: "832006075209",
  appId: "1:832006075209:web:e2821c2b8c6313a9d86098",
  measurementId: "G-SMZ33Z2M2T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);



export { app, analytics, auth, storage, db };
