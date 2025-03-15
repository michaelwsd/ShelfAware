import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc } from "firebase/firestore"; 

const db = getFirestore();

export const createUserPantry = async (userId) => {
    const pantry = { userId, items: [] };
    const pantryRef = await addDoc(collection(db, "pantries"), pantry);
    return { id: pantryRef.id, ...pantry };
};

export const getUserPantry = async (userId) => {
    const pantryQuery = query(collection(db, "pantries"), where("userId", "==", userId));
    const pantrySnapshot = await getDocs(pantryQuery);
    
    if (pantrySnapshot.empty) {
        return null;
    }

    const pantryDoc = pantrySnapshot.docs[0];
    return { id: pantryDoc.id, ...pantryDoc.data() };
};

export const addItemToPantry = async (userId, item) => {
    const pantry = await getUserPantry(userId);
    if (!pantry) return null;

    const pantryRef = doc(db, "pantries", pantry.id);
    const updatedItems = [...pantry.items, item];
    
    await updateDoc(pantryRef, { items: updatedItems });
    return { ...pantry, items: updatedItems };
};

export const removeItemFromPantry = async (userId, item) => {
    const pantry = await getUserPantry(userId);
    if (!pantry) return null;

    const pantryRef = doc(db, "pantries", pantry.id);
    const updatedItems = pantry.items.filter(i => i !== item);

    await updateDoc(pantryRef, { items: updatedItems });
    return { ...pantry, items: updatedItems };
};

export const deletePantry = async (userId) => {
    const pantry = await getUserPantry(userId);
    if (!pantry) return null;

    await deleteDoc(doc(db, "pantries", pantry.id));
    return true;
};
