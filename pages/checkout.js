import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { firebase } from '../Firebase/config';
import { useRouter } from 'next/router';
import Layout from '../src/layouts/Layout';

const Checkout = ({ cart, clearCart, subTotal, }) => {
  console.log(cart)
  const router = useRouter(); 
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [disabled, setDisabled] = useState(true)
  const [user, setUser] = useState({value: null})

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false); // Set loading to false if user is not authenticated
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase.firestore().collection('Users').doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserData(userData);
        setMobileNumber(userData?.mobileNumber || '');
        setAddress(userData?.address || '');
      }
      setLoading(false); // Set loading to false after user data is fetched
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false); // Set loading to false if an error occurs
    }
  };

  


  useEffect(() => {
    // ... (existing code)

    // Fetching user data and setting input fields with user data
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhone(userData.mobileNumber || '');
      setAddress(userData.address || '');
    }
  }, [userData]);

  
  useEffect(() => {
    if (name.length>3 && email.length>3 && phone.length>3 && address.length>3 ) {
      setDisabled(false)
    }
    else{
      setDisabled(true)

    }
    

  }, [name, email, address, phone,])



  const handleChange = (e) => {


    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name == 'address') {
      setAddress(e.target.value)
    }
    else if (e.target.name == 'phone') {
      setPhone(e.target.value)
    }
 
    if (name && email && phone && address ) {
      setDisabled(false)
    }
  }


  const initiatePayment = async () => {
    setIsLoading(true)
    let oid = Math.floor(Math.random() * Date.now());

    // Get a transaction token
    const data = { cart, subTotal, oid, email: email, name, address, phone };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let txnRes = await a.json()
    if (txnRes.success) {
      //console.log(txnRes)
      let txnToken = txnRes.txnToken

      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": oid, /* update order id */
          "token": txnToken, /* update token value */
          "tokenType": "TXN_TOKEN",
          "amount": subTotal /* update amount */
        },
        "handler": {
          "notifyMerchant": function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          }
        }
      };

      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {

        // after successfully updating configuration, invoke JS Checkout
        window.Paytm.CheckoutJS.invoke();
        setIsLoading(false) 
      }).catch(function onError(error) {
        setIsLoading(false) 
      });
    }
    else {
      setIsLoading(false)
      if(txnRes.cartClear){
      clearCart()
      }
      toast.error(txnRes.error, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }


  }
  
  return (
   <div>
    <div class="relative min-h-screen mx-auto w-full bg-white">
            <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
     
      <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} />
  <div class="grid py-12  grid-cols-10">
    <div class="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
      <div class="mx-auto w-full max-w-lg">
        <h1 class="relative text-2xl font-medium text-gray-700 sm:text-3xl">Secure Checkout<span class="mt-2 block h-1 w-10 bg-orange-600 sm:w-20"></span></h1>
        <form action="" class="mt-10 flex flex-col space-y-4">
          <div><label  for="name" class="text-xs font-semibold text-gray-500">Name</label><input onChange={handleChange} value={name} type="text" id="name" name="name" placeholder="Enter Your Name" 
          class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500" /></div>
          <div><label for="email" class="text-xs font-semibold text-gray-500">Email</label>     {user && user.token ? <input value={user.email} type="email" id="email" name="email" placeholder="Enter Your Email"  className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500" readOnly /> : <input onChange={handleChange} value={email} type="email" id="email" name="email "  placeholder="Enter Your Email"
          className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500" />}</div>
          <div><label for="phone" class="text-xs font-semibold text-gray-500">Mobile Number</label><input onChange={handleChange} value={phone} type="phone" id="phone" name="phone" placeholder="Enter Your 10 Digit Phone Number" class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500" /></div>
          <div><label for="address" class="text-xs font-semibold text-gray-500">Address</label><textarea onChange={handleChange} value={address} name="address" id="address" cols="30" row="2" placeholder="Enter Your Address" class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500" ></textarea></div>
       
         

        </form>
        <p class="mt-10 text-center text-sm font-semibold text-gray-500">By placing this order you agree to the <a href="#" class="whitespace-nowrap text-orange-400 underline hover:text-orange-600">Terms and Conditions</a></p>
        {isLoading ? (
          <div className='mx-4'>
          <button class="mt-4 inline-flex w-full items-center justify-center rounded bg-orange-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-orange-500 sm:text-lg">Loading...</button>
        </div>
        ) : (
        <Link href={'/checkout'}><button disabled={disabled} onClick={initiatePayment}  class="mt-4 inline-flex w-full items-center justify-center rounded bg-orange-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-orange-500 sm:text-lg">Pay ₹{subTotal}</button></Link>
        )}
      </div>
    </div>


      <div class="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
    <div class="px-4 pt-8">
    <p class="text-xl font-medium">Order Summary</p>
    <div class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
  {Object.keys(cart).length === 0 && (
    <div className="my-4 font-semibold">Your Cart is Empty!</div>
  )}
  <div>
    {Object.keys(cart).map((k) => (
      <div key={k} className="flex flex-col rounded-lg bg-white sm:flex-row">
       
        <div className="flex w-full flex-col px-4 py-4">
          <span className="font-semibold text-center">{cart[k].service}-{cart[k].subservice}-{cart[k].productname}</span>
          <p className="text-lg font-bold text-center">₹ {cart[k].price}</p>
          {cart[k].selectedDate && ( // Display the selected date if it exists
            <p className="text-center text-sm text-gray-500">
              Booking Date: {cart[k].selectedDate}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
</div>


    
  </div>
    </div>
  </div>
</div>
</div>

  )
}

export default Checkout