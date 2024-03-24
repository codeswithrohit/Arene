import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import { firebase } from '../Firebase/config';

const test = ({cart}) => {
  console.log("Cart",cart)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

const handleDateChange = (date) => {
  setSelectedDate(date);
};

  const loadScript = async (src) => {
      try {
          await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = src;
              script.onload = resolve;
              script.onerror = reject;
              document.body.appendChild(script);
          });
          return true;
      } catch (error) {
          console.error('Error loading script:', error);
          toast.error('Failed to load Razorpay SDK. Please try again later.');
          return false;
      }
  };

  

  const router = useRouter();
  const { Name,  roomType, roomprice, Agentid, location } = router.query;
  const generateOrderId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999
    const orderId = `ORDER-${randomNumber}`; // Append the random number to a prefix
    return orderId;
  };
  const submitBookingData = async (paymentAmount) => {
    try {
      // Get current date and time
      const currentDate = new Date().toISOString().slice(0, 10);
  
      // Prepare payment options based on selected option
      let oneday = paymentOption === 'oneday' ? true : false;
      let threeday = paymentOption === 'threeday' ? true : false;
      let allday = paymentOption === 'allday' ? true : false;
      const orderId = generateOrderId();
      await firebase.firestore().collection('bookings').add({
        firstName: firstName,
        orderId: orderId,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        Propertyname: Name,
        Location: location,
        roomType: roomType,
        roomprice: roomprice,
        Agentid: Agentid,
        Userid: user,
        OrderDate: currentDate,
        Payment: paymentAmount,
        oneday: oneday,
        threeday: threeday,
        allday: allday,
        bookingDate:selectedDate,
      });
      router.push(`/bookingdetails?orderId=${orderId}`);
      toast.success('Booking Successful!');
    } catch (error) {
      console.error('Error submitting booking data:', error);
      toast.error('Failed to submit booking data. Please try again later.');
    }
  };
  

  const initiatePayment = async () => {
    try {
      setLoading(true);
      let paymentAmount;
      if (paymentOption === 'oneday') {
        paymentAmount = 500;
      } else if (paymentOption === 'threeday') {
        paymentAmount = 1000;
      } else if (paymentOption === 'allday') {
        paymentAmount = roomprice; // Set payment amount to roomprice for "All Day" option
      } else {
        // Default to full payment if no option selected
        paymentAmount = roomprice; // Update payment amount to roomprice
      }
  
      // Pass paymentAmount to submitBookingData function
     

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Failed to load Razorpay SDK. Please try again later.');
        return;
      }

      const amountInPaise = paymentAmount * 100;

      const options = {
        key: 'rzp_test_td8CxckGpxFssp',
        currency: 'INR',
        amount: amountInPaise,
        name: 'Arene Services',
        description: 'Thanks for purchasing',
        image: 'https://www.areneservices.in/public/front/images/property-logo.png',
        handler: async function (response) {
          console.log('Payment Successful:', response);
         
          await submitBookingData(paymentAmount);
         
          await axios.post('/api/sendEmail', {
            Name,
            roomType,
            roomprice,
            location,
            email,
            firstName,
            lastName
          });
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div class="font-[sans-serif] bg-white mt-20 p-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-[#333] inline-block border-b-4 border-[#333] pb-1">Checkout</h2>
        </div>
        <div class="mt-12">
          <div class="grid md:grid-cols-3 gap-6">
            <div>
              <h3 class="text-xl font-bold text-[#333]">01</h3>
              <h3 class="text-xl font-bold text-[#333]">Personal Details</h3>
            </div>
            <div class="md:col-span-2">
            <form>
  <div class="grid sm:grid-cols-2 gap-5">
    <input 
      value={firstName} 
      onChange={(e) => setFirstName(e.target.value)} 
      type="text" 
      placeholder="First name"
      class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
    <input 
      value={lastName} 
      onChange={(e) => setLastName(e.target.value)} 
      type="text" 
      placeholder="Last name"
      class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
    <input 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      type="email" 
      placeholder="Email address"
      class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
    <input 
      value={mobilenumber} 
      onChange={(e) => setMobileNumber(e.target.value)} 
      type="number" 
      placeholder="Phone number"
      class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
    <textarea 
      value={address} 
      onChange={(e) => setAddress(e.target.value)} 
      placeholder="Address"
      class="px-4 py-3.5 bg-white text-[#333] w-full h-24 text-sm border-2 rounded-md focus:border-blue-500 outline-none resize-none"
    ></textarea>
    <input 
      type="date" 
      onChange={(e) => handleDateChange(e.target.value)} 
      placeholder="Select date"
      class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
  </div>
</form>

            </div>
          </div>
          <div class="grid md:grid-cols-3 gap-6 mt-12">
    <div class="col-span-1">
        <h3 class="text-xl font-bold text-[#333]">02</h3>
        <h3 class="text-xl font-bold text-[#333]">Booking Summary</h3>
    </div>
    <div class="col-span-2">
        <div class="flex flex-wrap items-start pb-4 mb-10 border-b border-gray-200 dark:border-gray-700">
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Name:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400">{Name}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Location:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400">{location}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Type:</p>
                <p class="text-base leading-6 text-blue-600 dark:text-gray-400">{roomType}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Price:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400">Rs.{roomprice}</p>
            </div>
        </div>
    </div>
</div>

          <div class="grid md:grid-cols-3 gap-6 mt-12">
            <div>
              <h3 class="text-xl font-bold text-[#333]">03</h3>
              <h3 class="text-xl font-bold text-[#333]">Payment method</h3>
            </div>
            <div class="md:col-span-2">
           
              <div class="grid gap-6 sm:grid-cols-2">
                <div class="flex items-center">
                  <input class="w-5 h-5 cursor-pointer"  type="radio" id="oneday" name="paymentOption" value="oneday" onChange={(e) => setPaymentOption(e.target.value)} />
                  <label for="card" class="ml-4 flex gap-2 cursor-pointer">
                  Pay only 500 for one day
                  </label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="threeday" name="paymentOption" value="threeday" onChange={(e) => setPaymentOption(e.target.value)}  class="w-5 h-5 cursor-pointer"  />
                  <label for="paypal" class="ml-4 flex gap-2 cursor-pointer">
                  Pay only 1000 for three days
                  </label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="allday" name="paymentOption" value="allday" onChange={(e) => setPaymentOption(e.target.value)}  class="w-5 h-5 cursor-pointer"  />
                  <label for="paypal" class="ml-4 flex gap-2 cursor-pointer">
                  Full Payment {roomprice}
                  </label>
                </div>
              </div>
            
            </div>
          </div>
          <div class="flex flex-wrap justify-end gap-4 mt-12">
          {/* <button type="button" class="px-6 py-3.5 text-sm bg-transparent border-2 text-[#333] rounded-md hover:bg-gray-100">
  Estimated Total : ₹ {paymentOption ? (paymentOption === 'oneday' ? 500 : (paymentOption === 'threeday' ? 1000 : roomprice)) : roomprice}
</button> */}

            <button onClick={initiatePayment} 
              class="px-6 py-3.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Pay now ₹ {paymentOption ? (paymentOption === 'oneday' ? 500 : (paymentOption === 'threeday' ? 1000 : roomprice)) : roomprice}</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default test