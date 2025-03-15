import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc, setDoc } from "firebase/firestore"; 

const db = getFirestore();

export const createUserPantry = async (userId) => {
    const pantryRef = doc(db,`users/${userId}/pantry`);
    const pantry = { items: [] };

    await setDoc(pantryRef, pantry);
    return { id: pantryRef.id, ...pantry };
};

const getUserPantry = async (userId) => {
    const pantryRef = doc(db, `users/${userId}/pantry`);
    const pantrySnapshot = await getDoc(pantryRef);
    
    if (!pantrySnapshot.exists()) {
        return null;
    }

    return { id: pantrySnapshot.id, ...pantrySnapshot.data() };
};

export const getPantryItems = async (userId) => {
    const pantry = await getUserPantry(userId);
    return pantry ? pantry.items : [];
};

export const addItemsToPantry = async (userId, items) => {
    for (const item of items) {
        await addItemToPantry(userId, item);
    }
};

export const addItemToPantry = async (userId, item) => {
    const pantry = await getUserPantry(userId);
    if (!pantry) return null;

    const pantryRef = doc(db, `users/${userId}/pantry`);
    const updatedItems = [...pantry.items, item];
    
    await updateDoc(pantryRef, { items: updatedItems });
    return { ...pantry, items: updatedItems };
};

export const removeItemFromPantry = async (userId, item) => {
    const pantry = await getUserPantry(userId);
    if (!pantry) return null;

    const pantryRef = doc(db, `users/${userId}/pantry`);
    const updatedItems = pantry.items.filter(i => i !== item);

    await updateDoc(pantryRef, { items: updatedItems });
    return { ...pantry, items: updatedItems };
};

export const deletePantry = async (userId) => {
    const pantryRef = doc(db, `users/${userId}/pantry`);
    await deleteDoc(pantryRef);
    return true;
};
