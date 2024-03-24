import React from 'react'
import { useEffect, useState } from 'react';
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
        const userDocRef = doc(db, 'users', user.uid); // Update the path to the user document
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
        router.push('/Admin/Register.html');
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
      
    
  console.log(userData)
  const verificationMessage = userData && userData.verified
    ? "You are verified"
    : "Your verification is in process";
  return (
    <div>
        <div class="bg-gray-100 dark:bg-gray-900 dark:text-white text-gray-600  flex overflow-hidden text-sm">

  <div class="flex-grow overflow-hidden h-full flex flex-col">
    
    <div class="flex-grow flex overflow-x-hidden">
     
      <div class="flex-grow bg-white mt-10 dark:bg-gray-900 overflow-y-auto">
        <div class="sm:px-7 sm:pt-7 px-4 pt-4 mt-36 lg:mt-0 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
        <span className='text-green-700' >{verificationMessage}</span>
          <div class="flex w-full items-center">
         
            <div class="flex items-center text-3xl text-gray-900 dark:text-white">
              {/* <img src="https://assets.codepen.io/344846/internal/avatars/users/default.png?fit=crop&format=auto&height=512&version=1582611188&width=512" class="w-12 mr-4 rounded-full" alt="profile" /> */}
              {userData ? (
        <span>Welcome, {userData.name}</span>
       
    ) : (
        <span>Loading...</span>
    )}
            </div>
            {/* <div class="ml-auto sm:flex hidden items-center justify-end">
              <div class="text-right">
                <div class="text-xs text-gray-400 dark:text-gray-400">Account balance:</div>
                <div class="text-gray-900 text-lg dark:text-white">$2,794.00</div>
              </div>
              <button class="w-8 h-8 ml-4 text-gray-400 shadow dark:text-gray-400 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <svg viewBox="0 0 24 24" class="w-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div> */}
          </div>
          <div class="overflow-x-auto">
          <div className="flex items-center space-x-3 sm:mt-7 mt-4">
        <a href="/Agent/dashboard.html" className={`px-3 border-b-2 ${activePage === '/Agent/dashboard.html' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Dashboard</a>
        <a href="/Agent/Orders.html" className={`px-3 border-b-2 ${activePage === '/Agent/Order.html' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Order</a>
        <a href="/Agent/addbuydata.html" className={`px-3 border-b-2 ${activePage === '/Agent/addbuydata.html' ? 'border-emerald-600 text-emerald-600 dark:text-white dark:border-white pb-1.5' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5'}`}>Buy</a>
        <a href="/Agent/addrent.html" className={`px-3 border-b-2 ${activePage === '/Agent/addrent.html' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Rent</a>
        <a href="/Agent/addpg.html" className={`px-3 border-b-2 ${activePage === '/Agent/addpg.html' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>PG</a>
        <a href="/Agent/addhotel.html" className={`px-3 border-b-2 ${activePage === '/Agent/addhotel.html' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Hotel</a>
        <a href="/Agent/addbanqueethall.html" className={`px-3 border-b-2 ${activePage === '/Agent/addbanqueethall.html' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Banqueet Hall</a>
        <a href="/Agent/addresort.html" className={`px-3 border-b-2 ${activePage === '/Agent/addresort.html' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Resort</a>
        <a href="/Agent/Laundry.html" className={`px-3 border-b-2 ${activePage === '/Agent/Laundry.html' ? 'border-emerald-500 text-emerald-500 dark:text-white dark:border-white pb-1.5 sm:block hidden' : 'border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden'}`}>Laundry</a>
      </div>
</div>

        </div>
       
       
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default AgentNav