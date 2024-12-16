import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios"; // For making HTTP requests
import { auth } from "./pages/components/firebase/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state while fetching user data
  const [newAccountCreationPending,  setNewAccountCreationPending] = useState(false); // Loading state while fetching user data

  useEffect(() => {
    const auth = getAuth();

    // Check if user data is stored in localStorage
    /* const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Restore user from localStorage
    } */

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        
      if (currentUser) {
        try {
          // Fetch custom claims or other Firebase-related user data
          const tokenResult = await currentUser.getIdTokenResult();
          const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            role: tokenResult.claims.role || "user", // Default to 'user' if no role
          };

          // Fetch additional user data from your backend
          
          if(!newAccountCreationPending){
            const backendUserData = await fetchUserDataFromBackend(currentUser.uid);
            // Merge Firebase data with backend data
            const mergedUserData = { ...userData, ...backendUserData };
            localStorage.setItem("user", JSON.stringify(mergedUserData));
            setUser(mergedUserData);
          }else{
            setUser(userData)
          }
          
          
        } catch (error) {
          console.error("Error fetching or creating user data:", error);
          setUser(null); // Set to null in case of error
        }
      } else {
        setUser(null); // Clear user state when logged out
      }
      setLoading(false); // Set loading to false once the user data is loaded
    });

    return unsubscribe; // Clean up listener on unmount
   
  }, [newAccountCreationPending]);

  const fetchUserDataFromBackend = async (uid) => {
    try {
      // Make a request to your backend to fetch user data based on the UID
      const response = await axios.get(`http://localhost:3000/api/v1/user/uid/${uid}`);
      return response.data; // Assume response contains user data
    } catch (error) {
      console.error("Error fetching backend user data:", error);
      return {}; // Return an empty object if there was an error fetching backend data
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setNewAccountCreationPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
