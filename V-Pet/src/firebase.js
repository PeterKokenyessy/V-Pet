import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "",
  authDomain: "virtual-pet-caring.firebaseapp.com",
  databaseURL: "https://virtual-pet-caring-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "virtual-pet-caring",
  storageBucket: "virtual-pet-caring.appspot.com",
  messagingSenderId: "413002321395",
  appId: "1:413002321395:web:9adf2101b6fe30b5721686",
  measurementId: "G-9QN79LK8ND"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
