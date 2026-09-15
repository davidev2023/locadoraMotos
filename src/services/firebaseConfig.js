
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBEWdkn1-Sg5-3j2PtIvHIFGQ3Ae1dBpjM",
  authDomain: "locadora-motos01.firebaseapp.com",
  projectId: "locadora-motos01",
  storageBucket: "locadora-motos01.firebasestorage.app",
  messagingSenderId: "661789704863",
  appId: "1:661789704863:web:d8048a9de4f35ee179d8aa"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

