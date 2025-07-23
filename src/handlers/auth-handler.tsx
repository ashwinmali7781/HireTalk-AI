import { db } from "@/config/firebase.config";
import { LoaderPage } from "@/routes/loader-page";

import { useAuth, useUser } from "@clerk/clerk-react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ Firebase config (you can move this to a separate file if needed)
const firebaseConfig = {
  apiKey: "your-key",
  authDomain: "your-domain",
  // ... other config values
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


type FirestoreUser = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  createdAt: any; 
  updateAt: any;
};

const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storeUserData = async () => {
      if (isSignedIn && user) {
        setLoading(true);
        try {
          const userRef = doc(db, "users", user.id);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            const userData: FirestoreUser = {
              id: user.id,
              name: user.fullName || user.firstName || "Anonymous",
              email: user.primaryEmailAddress?.emailAddress || "N/A",
              imageUrl: user.imageUrl,
              createdAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            };

            await setDoc(userRef, userData);
          }
        } catch (error) {
          console.error("Error storing user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    storeUserData();
  }, [isSignedIn, user, pathname, navigate]);

  if (loading) {
    return <LoaderPage />;
  }

  return null;
};

export default AuthHandler;
