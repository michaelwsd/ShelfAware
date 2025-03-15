import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc, setDoc } from "firebase/firestore"; 

const db = getFirestore();

const getUserPantry = async (userId) => {
    const pantryRef = doc(db, `users/${userId}/itemList`);
    const pantrySnapshot = await getDoc(pantryRef);
    
    if (!pantrySnapshot.exists()) {
        return null;
    }

    return { ...pantrySnapshot.data() };
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

const addItemToPantry = async (userId, item) => {
    const pantry = await getUserPantry(userId);
    if (!pantry) return null;

    // update user's itemCardinality
    const itemId = doc(db, `users/${userId}`).nextItemId;
    updateDoc(doc(db, `users/${userId}`), { itemCardinality: itemCardinality + 1, nextItemId: itemId + 1 });

    const pantryRef = doc(db, `users/${userId}/itemList`);
    const updatedItems = [...pantry.items, { ...item, id: itemId }];
    
    await updateDoc(pantryRef, { items: updatedItems });
};

export const updatePantryItem = async (userId, item) => {
    const pantry = await getUserPantry(userId);
    if (!pantry) return null;

    const pantryRef = doc(db, `users/${userId}/itemList`);
    const updatedItems = pantry.items.map(i => i.id === item.id ? item : i);

    await updateDoc(pantryRef, { items: updatedItems });
    return { ...pantry, items: updatedItems };
};

export const removeItemFromPantry = async (userId, item) => {
    const pantry = await getUserPantry(userId);
    if (!pantry) return null;

    updateDoc(doc(db, `users/${userId}`), { itemCardinality: itemCardinality - 1 });

    const pantryRef = doc(db, `users/${userId}/itemList`);
    const updatedItems = pantry.items.filter(i => i !== item);

    await updateDoc(pantryRef, { items: updatedItems });
    return { ...pantry, items: updatedItems };
};
