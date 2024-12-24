import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state while fetching user data
  const [fetchedUser, setFetchedUser] = useState(null);
  //const [newAccountCreationPending,  setNewAccountCreationPending] = useState(false); // Loading state while fetching user data

  useEffect(() => {
    const auth = getAuth();
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
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("Error fetching or creating user data:", error);
          setUser(null); // Set to null in case of error
          localStorage.removeItem("user");
        }
      } else {
        setUser(null); // Clear user state when logged out
        localStorage.removeItem("user");
      }
      setLoading(false); // Set loading to false once the user data is loaded
    });

    return unsubscribe; // Clean up listener on unmount
   
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchedUser, setFetchedUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
