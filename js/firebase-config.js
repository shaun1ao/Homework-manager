import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPWRcDLfrfHNHP25PBwi7hCDVB6Zx8bO4",
  authDomain: "homework-manager-933d7.firebaseapp.com",
  projectId: "homework-manager-933d7",
  storageBucket: "homework-manager-933d7.firebasestorage.app",
  messagingSenderId: "336456022537",
  appId: "1:336456022537:web:dc6fcaa95e672643b516d8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
