import { getAuth } from "firebase/auth";

export const getFirebaseToken = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    try {
      const token = await currentUser.getIdToken();
      return token;
    } catch (error) {
      console.error("Error fetching Firebase token:", error);
      throw new Error("Unable to fetch token");
    }
  } else {
    throw new Error("User not authenticated");
  }
};
