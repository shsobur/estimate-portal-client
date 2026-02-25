// File path__
import auth from "../Firebase/firebase.config";
import { AuthContext } from "../Context/AuthContext";

// From react__
import { useEffect, useState } from "react";

// Package(FIREBASE AUTH, SWEET ALERT)__
import {
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import Swal from "sweetalert2";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();
  // console.log(user);

  // Sign in use with google__
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      Swal.fire({
        title: "Successfully Signed In",
        icon: "success",
        draggable: true,
      });

      return result;
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        Swal.fire({
          title: "Google Sign-In Cancelled",
          text: "You closed the sign-in popup. If you don’t want to use Google, try creating an account with email instead.",
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "Google Sign-In Failed",
          text: "There was an issue signing in. Please try again.",
        });
      }
    }
  };

  // log out user__
  const logOut = () => {
    return signOut(auth);
  };

  // Monitor the current authenticated user__
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setUserLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    userLoading,
    handleGoogleSignIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
