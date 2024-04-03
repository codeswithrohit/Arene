import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';

const AgentNav = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activePage, setActivePage] = useState('');

  useEffect(() => {
    setActivePage(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user);
      } else {
        setUser(null);
        setUserData(null);
        router.push('/Agent/Register'); // Redirect to the login page if the user is not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'AgentOwner', user.uid); // Update the path to the user document
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.isVendor) {
          setUserData(userData);
        } else {
          router.push('/Agent/Register'); // Redirect to the login page if the user is not an admin
        }
      } else {
        // Handle case where user data doesn't exist in Firestore
        // You can create a new user profile or handle it based on your app's logic
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push('/Admin/Register');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  console.log(userData);

  const verificationMessage = userData && userData.verified
    ? "You are verified"
    : "Your verification is in process";

  const renderLinksBasedOnUserType = () => {
    if (userData && userData.userType === "Agent") {
      return (
        <div className="flex items-center space-x-3 sm:mt-7 mt-4">
          <a href="/Agent/dashboard" className={`px-3 border-b-2 ${activePage === '/Agent/dashboard' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Dashboard</a>
          <a href="/Agent/Orders" className={`px-3 border-b-2 ${activePage === '/Agent/Order' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Order</a>
          <a href="/Agent/addbuydata" className={`px-3 border-b-2 ${activePage === '/Agent/addbuydata' ? 'border-emerald-600 text-emerald-600 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Sell Property</a>
        </div>
      );
    } else if (userData && userData.userType === "Individual") {
      // Render all links for Individual type
      return (
        <div className="flex items-center space-x-3 sm:mt-7 mt-4">
                <a href="/Agent/dashboard" className={`px-3 border-b-2 ${activePage === '/Agent/dashboard' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Dashboard</a>
        <a href="/Agent/Orders" className={`px-3 border-b-2 ${activePage === '/Agent/Order' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Order</a>
        <a href="/Agent/addbuydata" className={`px-3 border-b-2 ${activePage === '/Agent/addbuydata' ? 'border-emerald-600 text-emerald-600 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Buy</a>
        <a href="/Agent/addrent" className={`px-3 border-b-2 ${activePage === '/Agent/addrent' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Rent</a>
        <a href="/Agent/addpg" className={`px-3 border-b-2 ${activePage === '/Agent/addpg' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>PG</a>
        <a href="/Agent/addhotel" className={`px-3 border-b-2 ${activePage === '/Agent/addhotel' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Hotel</a>
        <a href="/Agent/addbanqueethall" className={`px-3 border-b-2 ${activePage === '/Agent/addbanqueethall' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Banqueet Hall</a>
        <a href="/Agent/addresort" className={`px-3 border-b-2 ${activePage === '/Agent/addresort' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Resort</a>
        <a href="/Agent/Laundry" className={`px-3 border-b-2 ${activePage === '/Agent/Laundry' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Laundry</a>
        </div>
      );
    }
    // You can add more conditions for other user types
  };

  return (
    <div>
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-white text-gray-600  flex overflow-hidden text-sm">
        <div className="flex-grow overflow-hidden h-full flex flex-col">
          <div className="flex-grow flex overflow-x-hidden">
            <div className="flex-grow bg-white mt-10 dark:bg-gray-900 overflow-y-auto">
              <div className="sm:px-7 sm:pt-7 px-4 pt-4 mt-36 lg:mt-0 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
                <span className='text-green-700'>{verificationMessage}</span>
                <div className="flex w-full items-center">
                  <div className="flex items-center text-3xl text-gray-900 dark:text-white">
                    {userData ? (
                      <span>Welcome, {userData.name}</span>
                    ) : (
                      <span>Loading...</span>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {renderLinksBasedOnUserType()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentNav;
