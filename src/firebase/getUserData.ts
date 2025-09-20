import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

export const getUserData = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {

      return null;
    }
  } catch (error) {
    console.error("Error getting user data: ", error);
    return null;
  }
};