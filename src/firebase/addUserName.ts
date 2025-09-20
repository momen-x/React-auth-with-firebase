// firebase/addUserName.js - FIXED VERSION
import { doc, setDoc } from "firebase/firestore";
import { db } from "./config";

export const addUserName = async (userId: string, email: string, username: string) => {
  try {
    // Use the user's UID as the document ID (recommended approach)
    const userRef = doc(db, "users", userId);
    
    // Set the document data with the username and other info
    await setDoc(userRef, {
      username: username,
      email: email,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error adding username: ", error);
    return false;
  }
};

// Alternative: If you want to use email as ID, sanitize it first
export const addUserNameWithEmail = async (email: string, username: string) => {
  try {
    // Sanitize email to use as document ID
    const sanitizedEmail = email.replace(/[.@]/g, '_');
    const userRef = doc(db, "users", sanitizedEmail);
    
    await setDoc(userRef, {
      username: username,
      email: email,
      createdAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error adding username: ", error);
    return false;
  }
};