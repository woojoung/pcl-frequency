import firebasedb from "./firebasedb";
import { getFirestore } from "firebase/firestore";

const firestore = getFirestore(firebasedb);
export default firestore;