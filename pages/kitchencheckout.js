import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import { firebase } from '../Firebase/config';
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { error } from 'highcharts';
dayjs.extend(customParseFormat);

const test = () => {
  const [vendorData, setVendorData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ checkIn: null });

  const router = useRouter();
  const { thaliname, selectedTenure, Foodcharge,Foodname, Ingredients, noofthalli } = router.query;
  console.log("all detail",thaliname, selectedTenure, Foodcharge,Foodname, Ingredients, noofthalli)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const snapshot = await firebase.firestore().collection('AreneChefVendor').get();
        const data = snapshot.docs.map(doc => {
          const vendorData = doc.data();
          const foodTypesArray = Object.keys(vendorData.foodTypes).map(key => vendorData.foodTypes[key]);
          vendorData.foodTypes = foodTypesArray;
          return { id: doc.id, ...vendorData };
        });
        const filteredData = data.filter(vendor => vendor.foodTypes.includes(thaliname));
        setVendorData(filteredData);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    fetchVendors();
  }, [thaliname]);
  console.log("vendorData",vendorData)

  const handleCheckInChange = (date, dateString) => {
    setSelectedDate(prevState => ({
      ...prevState,
      checkIn: dateString
    }));
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

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        setUser(authUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  let foodChargeData = [];
  let foodChargePrice = 0;
  let foodChargeNoOfThalli = 0;

  if (Foodcharge) {
    try {
      foodChargeData = JSON.parse(Foodcharge);
      foodChargePrice = foodChargeData[0].price;
      foodChargeNoOfThalli = foodChargeData[0].noofthalli;
    } catch (error) {
      console.error('Error parsing Foodcharge:', error);
    }
  }

  const generateOrderId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const orderId = `ORDER-${randomNumber}`;
    return orderId;
  };
  const submitBookingData = async (paymentAmount) => {
    try {
      const currentDate = dayjs().format('YYYY-MM-DD');
      const bookingDateStr = selectedDate.checkIn; // Access the checkIn property
      const bookingDate = dayjs(bookingDateStr, 'YYYY-MM-DD'); // Ensure selectedDate is parsed correctly
  
      // Log selectedDate and bookingDate to debug date parsing issues
      console.log('Selected Date:', bookingDateStr);
      console.log('Parsed Booking Date:', bookingDate.format('YYYY-MM-DD'));
      console.log('Current Date:', currentDate);
  
      const noOfThalli = parseInt(foodChargeNoOfThalli, 10); // Assuming foodChargeNoOfThalli is a string
      const deliveryInfoArray = [];
  
      // Check if bookingDate is valid
      if (!bookingDate.isValid()) {
        throw new Error('Invalid booking date');
      }
  
      // Create Deliveryinfo array based on noofthalli and bookingDate
      for (let i = 0; i < noOfThalli; i++) {
        const deliveryDate = bookingDate.clone().add(i, 'day').format('YYYY-MM-DD'); // Clone the bookingDate before adding days
        deliveryInfoArray.push({
          thalliNo: i + 1,
          date: deliveryDate,
          todayconfirm: "yes",
          deliverystatus: 'Pending' // Assuming initial status is 'Pending'
        });
      }
  
      // Log the deliveryInfoArray to the console
      console.log('Deliveryinfo Array:', deliveryInfoArray);
  
      const orderId = generateOrderId();
  
      // Create the order object to log it before adding to Firestore
      const orderData = {
        firstName,
        orderId,
        lastName,
        address,
        phoneNumber: mobilenumber,
        email,
        confirmation: 'false',
        thaliname,
        Foodname,
        selectedTenure,
        Ingredients,
        Foodcharge: foodChargePrice,
        orderstatus: "Processing",
        totalpayment: foodChargePrice,
        Userid: user,
        OrderDate: currentDate,
        Payment: paymentAmount,
        bookingDate: bookingDateStr,
        noofthalli: foodChargeNoOfThalli,
        availablethalli: foodChargeNoOfThalli,
        pincode,
        Deliveryinfo: deliveryInfoArray // Add the Deliveryinfo array to the document
      };
  
      // Log the orderData object to the console
      console.log('Order Data:', orderData);
  
      await firebase.firestore().collection('kitchenorder').add(orderData);
      toast.success('Booking Successful!');
      router.push(`/arenechefdetails?orderId=${orderId}`);
  
    } catch (error) {
      console.error('Error submitting booking data:', error);
      toast.error('Failed to submit booking data. Please try again later.');
    }
  };
  
  
  
  

  const initiatePayment = async () => {
    if (!firstName || !lastName || !email || !mobilenumber || !address || !pincode ||!selectedDate.checkIn) {
      toast.error('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      let paymentAmount;
      if (paymentOption === 'oneday') {
        paymentAmount = 500;
      } else if (paymentOption === 'threeday') {
        paymentAmount = 1000;
      } else if (paymentOption === 'allday') {
        paymentAmount = Foodcharge && JSON.parse(Foodcharge)[0]?.price;
      } else {
        paymentAmount = Foodcharge && JSON.parse(Foodcharge)[0]?.price;
      }

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
            Foodcharge,
            location: Location,
            email,
            firstName,
            lastName,
            noofthalli
          });
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email
        }
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

  const checkAvailabilityAndInitiatePayment = async () => {
    if (!pincode) {
      toast.error('Please enter a valid pin code.');
      return;
    }
  
    let matchedVendor = null;
    if (vendorData) {
      for (const vendor of vendorData) {
        console.log('Vendor Pincode:', vendor.pincode);
        console.log('Pincode:', pincode);
        if (vendor.pincode === pincode) {
          matchedVendor = vendor;
          break;
        }
      }
    }
  
    if (matchedVendor) {
      initiatePayment();
    } else {
      toast.error('We do not provide service at this pin code.');
      console.log(error)
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
    <input 
      value={pincode} 
      onChange={(e) => setPincode(e.target.value)} 
      type="number" 
      placeholder="Pin Code"
      class="px-4 py-3.5 mb-2 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
   
    <div className=" mb-2 flex items-center">
        <DatePicker
          value={selectedDate.checkIn ? dayjs(selectedDate.checkIn) : null}
          onChange={handleCheckInChange}
          format="YYYY-MM-DD"
          placeholder="Delivery Date || Starting Date"
          style={{ marginRight: "10px" }}
          
        />
       
      </div>
  </div>
  <textarea 
      value={address} 
      onChange={(e) => setAddress(e.target.value)} 
      placeholder="Address"
      class="px-4 py-3.5 bg-white text-[#333] w-full h-24 text-sm border-2 rounded-md focus:border-blue-500 outline-none resize-none"
    ></textarea>
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
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Thaliname:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400 uppercase">{thaliname}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Foodname:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400 uppercase">{Foodname}</p>
            </div>
            {/* <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Location:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400">{address}</p>
            </div> */}
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Ingredients:</p>
                <p class="text-base leading-6 text-blue-600 dark:text-gray-400">{Ingredients}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
            <ul>
            {Foodcharge && JSON.parse(Foodcharge).map((food, index) => (
              <li key={index}>
                <p className='uppercase' >Tenure: {food.tenure}</p>
                <p className='uppercase' >Price: {food.price}</p>
                <p className='uppercase' >Thalli/Plate Qty: {food.noofthalli}</p>
              </li>
            ))}
          </ul>
            </div>
        </div>
    </div>
</div>

          {/* <div class="grid md:grid-cols-3 gap-6 mt-12">
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
                  Full Payment {Foodcharge && JSON.parse(Foodcharge)[0]?.price}
                  </label>
                </div>
              </div>
            
            </div>
          </div> */}
          <div class="flex flex-wrap justify-end gap-4 mt-12">
          {/* <button type="button" class="px-6 py-3.5 text-sm bg-transparent border-2 text-[#333] rounded-md hover:bg-gray-100">
  Estimated Total : ₹ {paymentOption ? (paymentOption === 'oneday' ? 500 : (paymentOption === 'threeday' ? 1000 : roomprice)) : roomprice}
</button> */}

            <button onClick={checkAvailabilityAndInitiatePayment} 
              class="px-6 py-3.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Pay now ₹ {paymentOption ? (paymentOption === 'oneday' ? 500 : (paymentOption === 'threeday' ? 1000 : Foodcharge && JSON.parse(Foodcharge)[0]?.price)) : Foodcharge && JSON.parse(Foodcharge)[0]?.price}</button>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer/>
    </div>
  )
}

export default test