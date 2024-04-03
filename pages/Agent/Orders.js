import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import AgentNav from '../../components/AgentNav';
import Link from 'next/link';

const AgentProfile = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState(null); // Moved here
    const [totalOrders, setTotalOrders] = useState(0);
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user.uid);
                fetchUserData(user);
            } else {
                setUser(null);
                setUserData(null);
                router.push('/Agent/Register'); // Redirect to the login page if the user is not authenticated
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const snapshot = await firebase.firestore().collection('bookings').where('Agentid', '==', user).get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                setBookings(data);
                setTotalOrders(data.length);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
    
        fetchBookings();
    }, [user]); // Dependency array is empty since it only needs to run once
     // Dependency array is empty since it only needs to run once
console.log(bookings)
    useEffect(() => {
        if (isLoading) {
            return; // No need to fetch user data while loading
        }
        // Fetch user data after authentication is done
        fetchUserData(user);
    }, [isLoading, user]);

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
console.log(userData)
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

    // Check if user data is available and if it is verified
    if (userData && userData.verified) {
        return (
            <div>
                 <div class="bg-gray-100 dark:bg-gray-900 dark:text-white text-gray-600 h-screen flex overflow-hidden text-sm">

<div class="flex-grow overflow-hidden h-full flex flex-col">
  
  <div class="flex-grow flex overflow-x-hidden">
   
    <div class="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
      <AgentNav/>
      <section class="px-6 pt-6">
                  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                      {/* <div class="flex items-center p-4 rounded-md shadow dark:bg-gray-900 bg-gray-50">
                          <div class="mr-4">
                              <span
                                  class="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      class="w-6 h-6 bi bi-currency-dollar" viewBox="0 0 16 16">
                                      <path
                                          d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z">
                                      </path>
                                  </svg>
                              </span>
                          </div>
                          <div>
                              <p class="mb-2 text-gray-700 dark:text-gray-400">Earnings Total</p>
                              <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                  $1,25,220</h2>
                          </div>
                      </div> */}
                      {/* <div class="flex items-center p-4 rounded-md shadow dark:bg-gray-900 bg-gray-50">
                          <div class="mr-4">
                              <span
                                  class="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      class="w-6 h-6 bi bi-bag-check" viewBox="0 0 16 16">
                                      <path fill-rule="evenodd"
                                          d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z">
                                      </path>
                                      <path
                                          d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z">
                                      </path>
                                  </svg>
                              </span>
                          </div>
                          <div>
                              <p class="mb-2 text-gray-700 dark:text-gray-400">Total Orders</p>
                              <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                  {totalOrders}</h2>
                          </div>
                      </div>
                      <div class="flex items-center p-4 rounded-md shadow dark:bg-gray-900 bg-gray-50">
                          <div class="mr-4">
                              <span
                                  class="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      class="w-6 h-6 bi bi-bag-check" viewBox="0 0 16 16">
                                      <path fill-rule="evenodd"
                                          d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z">
                                      </path>
                                      <path
                                          d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z">
                                      </path>
                                  </svg>
                              </span>
                          </div>
                          <div>
                              <p class="mb-2 text-gray-700 dark:text-gray-400">Today Orders</p>
                              <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                 {bookings.length}</h2>
                          </div>
                      </div> */}
                      {/* <div class="flex items-center p-4 rounded-md shadow dark:bg-gray-900 bg-gray-50">
                          <div class="mr-4">
                              <span
                                  class="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      class="w-6 h-6 bi bi-chat-text" viewBox="0 0 16 16">
                                      <path
                                          d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z">
                                      </path>
                                      <path
                                          d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z">
                                      </path>
                                  </svg>
                              </span>
                          </div>
                          <div>
                              <p class="mb-2 text-gray-700 dark:text-gray-400">Pending Order</p>
                              <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                  56</h2>
                          </div>
                      </div> */}
                  </div>
              </section>
              <section class="px-6 py-6">
                  <div class="grid lg:grid-cols-[100%,1fr]  grid-cols-1 gap-6 ">
                      <div class="pt-4 bg-white rounded shadow dark:text-gray-100 dark:bg-gray-900">
                          <div class="flex px-6 pb-4 border-b dark:border-gray-700">
                              <h2 class="text-xl font-bold dark:text-gray-400">Your Orders</h2>
                          </div>
                          <div class="p-4 overflow-x-auto">
                          <table className="w-full table-auto">
  <thead>
      <tr className="text-xs text-left text-gray-500 dark:text-gray-400">
          <th className="px-6 pb-3 font-medium">Customer Name</th>
          <th className="px-6 pb-3 font-medium">Order Details</th>
          <th className="px-6 pb-3 font-medium">Payment</th>
          <th className="px-6 pb-3 font-medium">Booking Date</th>
          <th className="px-6 pb-3 font-medium">Actions</th>

      </tr>
  </thead>
  <tbody>
      {bookings && bookings.map(booking => (
          <tr key={booking.id} className="text-xs dark:text-gray-400">
              <td className="px-6 py-5 font-medium">{booking.firstName} {booking.lastName}</td>
              <td className="px-6 py-5 font-medium">{booking.GarmentTypes ? (
            // If GarmentTypes available, show the data
            JSON.parse(booking.GarmentTypes).map((garment, index) => (
                <div key={index}>
                    <p>No. of Garments: {garment.noofgarments}</p>
                    <p>Tenure: {garment.tenure}</p>
                    <p>Price: {garment.price}</p>
                </div>
            ))
        ) : (
            // If GarmentTypes not available, show order details
            `${booking.Propertyname}-${booking.roomType}-${booking.roomprice}`
        )}</td>
              <td className="px-6 py-5 font-medium">{booking.Payment}</td>
              <td className="px-6 py-5 font-medium">{booking.bookingDate}</td>
              <td className="px-6 py-5 font-medium">
                                                                    {booking.GarmentTypes ? (
                                                                        <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                View Details
                                                                            </a>
                                                                        </Link>
                                                                    ) : (
                                                                        <Link href={`/bookingdetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                Booking Details
                                                                            </a>
                                                                        </Link>
                                                                    )}
                                                                </td>
          </tr>
      ))}
  </tbody>
</table>

                          </div>
                      </div>
                     
                  </div>
              </section>
     
    </div>
  </div>
</div>
</div>
            </div>
        );
    } else {
        return (
            <div className="flex justify-center items-center h-screen">
                {/* Show a message if user data is not verified */}
                <p>Your account verification is in process. Please wait.</p>
            </div>
        );
    }
}

export default AgentProfile;
