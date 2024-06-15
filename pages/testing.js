import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaBell, FaCheckCircle } from 'react-icons/fa';

const Test = () => {
  const [mainactiveTab, setMainActiveTab] = useState('orderAlert'); // State to track active tab
  const [activeTab, setActiveTab] = useState("ongoingOrders");
  // Function to handle tab change
  const handleTabChange = (tab) => {
    setMainActiveTab(tab);
  };


  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Loading state for user authentication
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [deliverybookings, setDeliveryBookings] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true); // Loading state for fetching bookings
 

  const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
  };

  const currentUser = firebase.auth().currentUser;
  useEffect(() => {
    const fetchBookings = async () => {
        try {
            if (userData) {
                const snapshot = await firebase.firestore().collection('laundryorders').where('pincode', '==', userData.pincode).get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
                setBookings(data);
                setIsLoadingData(false); // Set loading state to false after fetching bookings
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    fetchBookings();
}, [userData,currentUser]); // Add userData to the dependency array
  useEffect(() => {
    const fetchBookings = async () => {
        try {
            if (userData) {
                const snapshot = await firebase.firestore().collection('laundryorders').where('pincode', '==', userData.pincode).where('deliveryconfirmation', '==', "false").get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
                setDeliveryBookings(data);
                setIsLoadingData(false); // Set loading state to false after fetching bookings
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    fetchBookings();
}, [userData,currentUser]); // Add userData to the dependency array

  
  console.log("orders",bookings)
console.log("userdata",userData)

  

 
  


const ongoingOrders = bookings 
  ? bookings.filter(booking => 
      booking.availablegarments > 0 && 
      booking.orderstatus === "Confirm" && 
      booking.deliveryboyid === currentUser.uid
    ) 
  : [];

const currentDate = new Date().toISOString().split('T')[0];

const completedOrders = bookings 
  ? bookings.filter(booking => 
      booking.availablegarments === 0 && 
      booking.deliveryboyid === currentUser.uid
    ) 
  : [];

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(); // This will give the date and time in a readable format
  };
  
  const handleStatusChange = async (bookingId, deliveryIndex, newStatus,garmentCount) => {
    try {
      const bookingRef = firebase.firestore().collection('laundryorders').doc(bookingId);
      const bookingDoc = await bookingRef.get();
      if (bookingDoc.exists) {
        const bookingData = bookingDoc.data();
        const orderHistory = bookingData.orderHistory;
        orderHistory[deliveryIndex].deliverystatus = newStatus;
        orderHistory[deliveryIndex].deliverydatetime = getCurrentDateTime();
        orderHistory[deliveryIndex].todayconfirm = newStatus;
  
        if (newStatus === "Out of Delivery") {
          // Update the deliveryboylocation with current location
          await bookingRef.update({
            orderHistory: orderHistory,
            deliveryboylocation: locations,
          });
          toast.success('Status updated to Out of Delivery');
        } else if (newStatus === "Delivered") {
          // Update the orderHistory and decrease availablegarments by 1
          console.log("garmentcount",garmentCount)
          const updatedavailablegarments = bookingData.availablegarments - garmentCount;
          console.log("updatedavialablegarments",updatedavailablegarments)
          await bookingRef.update({
            orderHistory: orderHistory,
            availablegarments: updatedavailablegarments,
          });
          toast.success('Status updated to Delivered');
        } else {
          await bookingRef.update({
            orderHistory: orderHistory,
          });
          toast.success('Status updated successfully');
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Reload the page after 2 seconds to give time for the toast to show
      } else {
        console.log('No such document!');
        toast.error('No such document!');
      }
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Error updating document');
    }
  };



if (userData && userData.verified) {
  return (
    <div>
    <section className="px-6 lg:py-4 py-4 font-mono">
    {isLoadingAuth || isLoadingData ? ( // Check if either authentication or data loading is in progress
            <div className="text-center mt-4">
                Loading...
            </div>
        ) : (
<div>

        <h1 className='text-red-600 text-center font-bold text-4xl'>Our Orders</h1>
        
         {/* Data display based on active tab */}
    <div className="bg-gray-100 p-4 rounded-md">
    
{mainactiveTab === 'confirmedOrders' && (
                <div>
                  
                  {activeTab === "ongoingOrders" && (
                     <div>
                     {!isLoadingData && ongoingOrders && ongoingOrders.length > 0 ? (
                       <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                         <div className="w-full overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                             <thead className="bg-gray-100">
                               <tr>
                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                               </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
      {ongoingOrders.map((booking, index) => (
        <React.Fragment key={booking.id}>
          <tr>
            <td className="px-6 py-4 text-sm text-gray-800">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center font-bold rounded-full bg-gray-200 text-gray-800 mr-3">
                  {index + 1}.
                </div>
                {booking.firstName} {booking.lastName}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-[#333]">{booking.Service}</td>
            <td className="px-6 py-4 text-sm text-[#333]">
                                  <div>
                                    <p>No. of Garments: {booking.availablegarments}</p>
                                    <p>Delivery In: {booking.selectedTenure}</p>
                                    <p>Price: {booking.Payment}</p>
                                  </div>
                                </td>
            <td className="px-6 py-4 text-sm text-gray-800">{booking.Payment}</td>
            <td className="px-6 py-4 text-sm text-[#333]">
                                 
                                 <p>{booking.OrderDate}</p>
                              
                             </td>
            <td className="px-6 py-4 text-sm text-gray-800">
             
               
            <Link href={`/Admin/adminarenelaundrydetails?orderId=${booking.orderId}`}>
                  <a className="bg-blue-500 text-white px-2 py-1 rounded">Booking Details</a>
                </Link>
            </td>
          </tr>
          {booking.orderHistory && booking.orderHistory.length > 0 && (
            <tr>
              <td colSpan="7">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pickup Date</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Garment Count</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {booking.orderHistory.map((delivery, deliveryIndex) => (
                        delivery.pickupDate === currentDate && (
                          <tr key={deliveryIndex} className={delivery.deliverystatus === "cancel" ? "border-b-2 border-red-500" : ""}>
                                                       <td className="px-3 py-1 text-sm font-medium text-gray-900">{delivery.pickupDate}</td>
                                                       <td className="px-3 py-1 text-sm text-gray-500">{delivery.garmentCount}</td>

                            <td className="px-3 py-1 text-sm text-gray-500">
                              <select
                                value={delivery.deliverystatus}
                                onChange={(e) => handleStatusChange(booking.id, deliveryIndex, e.target.value,booking.garmentCount)}
                                className="border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="">Change Status</option>
                                <option value="Out of Delivery">Out of Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              {delivery.deliverystatus}
                              {delivery.deliverystatus === "Out of Delivery" && (
                  <div>
                    <a href={`/Deliveryboy/viewmaplaundry?orderId=${booking.orderId}`} className="text-green-500 cursor-pointer font-bold p-2 rounded">
                    Track Order
                    </a>
                  </div>
                )}
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
                           </table>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center mt-4">No ongoing orders</div>
                     )}
                   </div>
                  )}

                
                </div>
              )}
    </div>

    
        </div>
        )}
    </section>
    
 



    <ToastContainer />
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

};

export default Test;
