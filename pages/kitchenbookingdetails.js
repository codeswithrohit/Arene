import { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { useRouter } from 'next/router';
const test = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { orderId } = router.query;
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const db = firebase.firestore();
        const bookingRef = db.collection('kichenorder').where('orderId', '==', orderId);
        const snapshot = await bookingRef.get();

        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach((doc) => {
          setBookingData(doc.data());
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [orderId]);
console.log(bookingData)

  if (loading) {
    return <div class="flex min-h-screen justify-center items-center">
    <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
</div>;
  }

  if (!bookingData) {
    return <div>No booking found for orderId: {orderId}</div>;
  }

  // Render booking details using bookingData
  const foodTypes = bookingData.foodTypes ? JSON.parse(bookingData.foodTypes) : [];
  return (
    <div>
      <section class="flex md:mt-0 mt-12 items-center py-16 bg-gray-100 md:py-20 font-poppins dark:bg-gray-800 ">
<div class="justify-center flex-1 max-w-6xl px-4 py-4 mx-auto bg-white border rounded-md dark:border-gray-900 dark:bg-gray-900 md:py-10 md:px-10">
<div>
<h1 class="px-4 mb-8 text-2xl font-semibold tracking-wide text-gray-700 dark:text-gray-300 ">
Thank you. Your order has been received. </h1>
<div class="flex border-b border-gray-200 dark:border-gray-700  items-stretch justify-start w-full h-full px-4 mb-8 md:flex-row xl:flex-col md:space-x-6 lg:space-x-8 xl:space-x-0">
<div class="flex items-start justify-start flex-shrink-0">
<div class="flex items-center justify-center w-full pb-6 space-x-4 md:justify-start">
{/* <img src="https://i.postimg.cc/RhQYkKYk/pexels-italo-melo-2379005.jpg" class="object-cover w-16 h-16 rounded-md" alt="avatar"> */}
<div class="flex flex-col items-start justify-start space-y-2">
<p class="text-lg font-semibold leading-4 text-left text-gray-800 dark:text-gray-400">
{bookingData.firstName} {bookingData.lastName}</p>
{/* <p class="text-sm leading-4 text-gray-600 dark:text-gray-400">16 Previous Orders</p> */}
<p class="text-sm leading-4 cursor-pointer dark:text-gray-400">{bookingData.email}</p>
</div>
</div>
</div>
</div>
<div class="flex flex-wrap items-center pb-4 mb-10 border-b border-gray-200 dark:border-gray-700">
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
Order Number: </p>
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">
{bookingData.orderId}</p>
</div>
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
Booking Date: </p>
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">
{bookingData.bookingDate}</p>
</div>
{/* <div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm font-medium leading-5 text-gray-800 dark:text-gray-400 ">
Tenure: </p>
<p class="text-base font-semibold leading-4 text-blue-600 dark:text-gray-400">
</p>
</div>
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm font-medium leading-5 text-gray-800 dark:text-gray-400 ">
No. of foods: </p>
<p class="text-base font-semibold leading-4 text-blue-600 dark:text-gray-400">
</p>
</div>
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm font-medium leading-5 text-gray-800 dark:text-gray-400 ">
 Price: </p>
<p class="text-base font-semibold leading-4 text-blue-600 dark:text-gray-400">
</p>
</div> */}
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
Payment Done: </p>
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400 ">
{bookingData.Payment} </p>
</div>
</div>
<div class="px-4 mb-10">
<div class="flex flex-col items-stretch justify-center w-full space-y-4 md:flex-row md:space-y-0 md:space-x-8">
<div class="flex flex-col w-full space-y-6 ">
<h2 class="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Order details</h2>
<div class="flex flex-col items-center justify-center w-full pb-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
<div class="flex justify-between w-full">
  <p class="text-base leading-4 text-gray-800 dark:text-gray-400">Name</p>
  <div>
    {bookingData.Foodcharge.map((food, index) => (
      <div key={index}>
        <p>Tenure: {food.tenure}</p>
        <p>Price: {food.price}</p>
      </div>
    ))}
  </div>
</div>

<div class="flex items-center justify-between w-full">
<p class="text-base leading-4 text-gray-800 dark:text-gray-400">Location
</p>
<p class="text-xs font-bold leading-4 text-gray-600 dark:text-gray-400">{bookingData.address}</p>
</div>
{/* <div class="flex items-center justify-between w-full">
<p class="text-base leading-4 text-gray-800 dark:text-gray-400">Shipping</p>
<p class="text-base leading-4 text-gray-600 dark:text-gray-400">Rs.100</p>
</div> */}
</div>
{/* <div class="flex items-center justify-between w-full">
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">Total</p>
<p class="text-base font-semibold leading-4 text-gray-600 dark:text-gray-400">Rs.700</p>
</div> */}
</div>
{/* <div class="flex flex-col w-full px-2 space-y-4 md:px-8 ">
<h2 class="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Shipping</h2>
<div class="flex items-start justify-between w-full">
<div class="flex items-center justify-center space-x-2">
<div class="w-8 h-8">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-400 bi bi-truck" viewBox="0 0 16 16">
<path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z">
</path>
</svg>
</div>
<div class="flex flex-col items-center justify-start">
<p class="text-lg font-semibold leading-6 text-gray-800 dark:text-gray-400">
Delivery<br/><span class="text-sm font-normal">Delivery with 24 Hours</span>
</p>
</div>
</div>
<p class="text-lg font-semibold leading-6 text-gray-800 dark:text-gray-400">Rs.50</p>
</div>
</div> */}
</div>
</div>
{/* <div class="flex flex-wrap items-center justify-start gap-4 px-4 mt-6 ">
<button class="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-md md:w-auto hover:text-gray-100 hover:bg-blue-600 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300">
Go back shopping
</button>
<button class="w-full px-4 py-2 bg-blue-500 rounded-md text-gray-50 md:w-auto dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-gray-700 dark:bg-gray-800">
View career details
</button>
</div> */}
</div>
</div>
</section>
    </div>
  )
}

export default test