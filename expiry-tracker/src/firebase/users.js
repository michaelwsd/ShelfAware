import { getFirestore, doc, setDoc } from "firebase/firestore"; 

const db = getFirestore();

export const createUser = async (userId, email, password, name) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {userId, name, email, password, itemCardinality: 0, itemList: [], createdAt: new Date()});
    return {userId, email, name};
}