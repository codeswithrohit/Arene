import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const Test = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
   
    
    // Set up Firebase auth state listener
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        console.log('User logged in:', user);
      } else {
        console.log('No user logged in');
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);
console.log("current user",currentUser)
  return (
    <div>test</div>
  );
}

export default Test;
