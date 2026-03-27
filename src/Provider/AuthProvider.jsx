// File path__
import auth from "../Firebase/firebase.config";
import { AuthContext } from "../Context/AuthContext";
import { jhError, jhToastSuccess, jhWarning } from "../utils";

// From react__
import { useEffect, useState } from "react";

// Package(FIREBASE AUTH, SWEET ALERT)__
import {
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [firebaseLoading, setFirebaseLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();
  // console.log(user);

  // Creates a new user with email and password__
  const handleCreateUser = async (email, password) => {
    setFirebaseLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return result;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        jhError({
          title: "Invalid email address",
          text: "Email already in exist. Use another email to sign up!",
        });
      } else {
        jhError({
          title: "Sign Up Failed",
          text: "There might be some issue, Please try again!",
        });
      }

      throw error;
    } finally {
      setFirebaseLoading(false);
    }
  };

  // Sign in use with google__
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      jhToastSuccess("Sign In successfully");

      return result;
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        jhWarning({
          title: "Google Sign-In Cancelled",
          text: "You closed the sign-in popup. If you don’t want to use Google, try creating an account with email instead.",
        });
      } else {
        jhError({
          title: "Google Sign-In Failed",
          text: "There was an issue signing in. Please try again.",
        });
      }
    }
  };

  // Login user with email and password__
  const handleLoginUser = async (email, password) => {
    setFirebaseLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        jhError({
          title: "Invalid Credential!",
          text: "Invalid email or password. Try again with valid email and password",
        });
      } else {
        jhError({
          title: "Sign In Failed",
          text: "There might be some issue, Please try again!",
        });
      }

      throw error;
    } finally {
      setFirebaseLoading(false);
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
    firebaseLoading,
    handleCreateUser,
    handleLoginUser,
    handleGoogleSignIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
