import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
const HomePage = () => {
  const router = useRouter();
  const [Location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('pg');
  const [category, setCategory] = useState('');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);

          // Fetch location name using reverse geocoding
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                // Extracting more specific address components
                const addressComponents = data.results[0].address_components;
                const cityName = addressComponents.find(component => component.types.includes('locality'));
                const stateName = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
                const countryName = addressComponents.find(component => component.types.includes('country'));

                // Constructing a more detailed location name
                const detailedLocation = [cityName, stateName, countryName]
                  .filter(component => component !== undefined)
                  .map(component => component.long_name)
                  .join(', ');

                setLocations(detailedLocation);
              } else {
                setLocations("Location not found");
              }
            })
            .catch(error => {
              console.error('Error fetching location:', error);
              setLocations("Error fetching location");
            });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);
  const [nearestLocation, setNearestLocation] = useState('');
  const [services, setServices] = useState('');
  const [subservices, setSubservices] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); 
  const images = [
    "https://www.easiui.com/hero-section/image/hero17.png",
  ];

  // Function to handle automatic image slider
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(intervalId);
  }, [images.length]);
  const handleNearestLocationChange = (e) => {
   setNearestLocation(e.target.value);
 };
  const handleServiceChange = (e) => {
   setServices(e.target.value);
 };
  const handleSubsevicesChange = (e) => {
   setSubservices(e.target.value);
 };
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    console.log('Selected Category:', selectedCategory);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ',
    libraries: placesLibrary,
  });
 

  const autocompleteRef = useRef();



  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };
  




  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
  
    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();
  
      if (place && place.formatted_address) {
        setLocation(place.formatted_address); // Update to set the full formatted address
      }
    }
  };
  if (!isLoaded) {
    return (
      <div className='flex min-h-screen justify-center item-center'>
      <h1>Loading...</h1>
      </div>
    );
  }

  const buyData = ['Buy Category', 'Appartment', 'Builder Floor','Villas',,'Land','Shop/Showroom','Office Space','Other Properties'];
  const handleBuySearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Buy?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const pgData = ['PG Category', 'Boys', 'Girls'];
  const handlePGSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/pg?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const rentData = ['Rent Category', 'Appartment', 'Builder Floor','Shop/Showroom','Office Space','Other Properties'];
  const handleRentSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Rent?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const handleHotelSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Hotel?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleBanqueetHallSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/BanqueetHall?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleResortSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Resort?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleLaundrySearch = () => {
    const nearestLocation = 10; // Setting nearestLocation to 10
    // Redirect to the detail page with the parameters
    router.push(`/Laundry?location=${Location}&nearestLocation=${nearestLocation}&services=${services}`);
  };
  const handleCloudKitchenSearch = () => {
    const nearestLocation = 10; // Setting nearestLocation to 10
    // Redirect to the detail page with the parameters
    router.push(`/CloudKitchen?location=${Location}&nearestLocation=${nearestLocation}&services=${services}`);
  };

  
  return (
    <div className='min-h-screen' >
      <section className="relative w-full h-full min-h-screen bg-neutral-50 pb-10">


<main className=" w-full h-full relative dark:bg-slate-950  ">
<div className="flex flex-col-reverse lg:flex-row">

<section className="w-full lg:w-[60%] flex flex-col lg:translate-x-10 @md:px-2 lg:px-0 ">
<div className="w-full h-auto  lg:pt-16 ">

<h1 className="text-3xl lg:text-4xl lg:text-5xl font-extrabold py-1.5 text-[#10b981]  ">PERIMIUM SERVICES!</h1>
<h1 className="text-3xl lg:text-4xl lg:text-5xl font-extrabold py-1.5 text-[#10b981]   ">IN<span className="text-black font-bold text-xs"></span> YOUR AREA</h1>
<h1 className="text-3xl lg:text-4xl lg:text-5xl font-extrabold py-1.5 text-[#10b981]   ">WAITING FOR YOU</h1>
{/* <p className="max-w-sm py-5 text-gray-600 lg:text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem magnam quod sunt doloremque odit deserun</p> */}
<div className="w-full h-32 rounded-5xl  ">
      <div className="h-8 grid grid-cols-8 w-full">
        
        <button
          className={`flex rounded-lg items-center gap-2 justify-center text-sm ${
            activeTab === 'pg' ? 'bg-emerald-500  text-white font-bold text-xs' : 'font-semibold text-xs bg-neutral-100'
          }`}
          onClick={() => handleTabClick('pg')}
        >
           PG
        </button>
        <button
          className={`flex rounded-lg items-center gap-2 justify-center text-sm ${
            activeTab === 'buy' ? 'bg-emerald-500 text-white font-bold text-xs' : 'font-semibold text-xs bg-neutral-100'
          }`}
          onClick={() => handleTabClick('buy')}
        >
           Buy
        </button>
        <button
          className={`flex rounded-lg items-center gap-2 justify-center text-sm ${
            activeTab === 'rent' ? 'bg-emerald-500 text-white font-bold text-xs' : 'font-semibold text-xs bg-neutral-100'
          }`}
          onClick={() => handleTabClick('rent')}
        >
           Rent
        </button>
        <button
          className={`flex rounded-lg items-center gap-2 justify-center text-sm ${
            activeTab === 'hotel' ? 'bg-emerald-500 text-white font-bold text-xs' : 'font-semibold text-xs bg-neutral-100'
          }`}
          onClick={() => handleTabClick('hotel')}
        >
           Hotel
        </button>
        <button
          className={`flex rounded-lg items-center gap-2 justify-center text-sm ${
            activeTab === 'BanqueetHall' ? 'bg-emerald-500 text-white font-bold text-xs' : 'font-semibold text-xs bg-neutral-100'
          }`}
          onClick={() => handleTabClick('BanqueetHall')}
        >
           Banqueet Hall
        </button>
        <button
          className={`flex rounded-lg items-center gap-2 justify-center text-sm ${
            activeTab === 'Resort' ? 'bg-emerald-500 text-white font-bold text-xs' : 'font-semibold text-xs bg-neutral-100'
          }`}
          onClick={() => handleTabClick('Resort')}
        >
           Resort
        </button>
        <button
          className={`flex rounded-lg items-center gap-2 justify-center text-sm ${
            activeTab === 'Laundry' ? 'bg-emerald-500 text-white font-bold text-xs' : 'font-semibold text-xs bg-neutral-100'
          }`}
          onClick={() => handleTabClick('Laundry')}
        >
           Laundry
        </button>
        <button
          className={`flex rounded-lg items-center gap-2 justify-center text-sm ${
            activeTab === 'CloudKitchen' ? 'bg-emerald-500 text-white font-bold text-xs' : 'font-semibold text-xs bg-neutral-100'
          }`}
          onClick={() => handleTabClick('CloudKitchen')}
        >
           Cloud Kitchen
        </button>
       
      </div>
      <div className="h-20 bg-white rounded-b-3xl shadow-md lg:px-5 py-3 grid grid-cols-3 gap-5">
     
        {activeTab === 'pg' && (
         <>
         <div className="h-full w-full">
           <select value={category} onChange={handleCategoryChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
           {pgData.map((categoryOption, index) => (
             <option key={index} value={categoryOption}>
             {categoryOption}
             </option>
           ))}
           </select>
         </div>
         <div className="h-full w-full">
           <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
           <input   value={Location} name="Location" placeholder="Search location"
 onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
           </Autocomplete>
         </div>
         <div className="h-full w-full">
           <select  value={nearestLocation}
       onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
          <option value="" disabled selected>
         Nearest location
       </option>
            <option value="2">Nearest 2 Km</option>
       <option value="4">Nearest 4 Km</option>
       <option value="6">Nearest 6 Km</option>
       <option value="8">Nearest 8 Km</option>
       <option value="10">Nearest 10 Km</option>
           </select>
         </div>
         <button  onClick={handlePGSearch} className="text-white bg-emerald-500 font-bold text-xs rounded-lg px-5 py-1 h-10 col-span-3">Search</button>
       </>
        )}
        {activeTab === 'buy' && (
          <>
            <div className="h-full w-full">
              <select value={category} onChange={handleCategoryChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
              {buyData.map((categoryOption, index) => (
                <option key={index} value={categoryOption}>
                {categoryOption}
                </option>
              ))}
              </select>
            </div>
            <div className="h-full w-full">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input   value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
              </Autocomplete>
            </div>
            <div className="h-full w-full">
              <select  value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
             <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
              </select>
            </div>
            <button  onClick={handleBuySearch} className="text-white  bg-emerald-500 font-bold text-xs rounded-lg px-5 py-1 h-10 col-span-3">Search</button>
          </>
        )}
        {activeTab === 'rent' && (
          <>
          <div className="h-full w-full">
            <select value={category} onChange={handleCategoryChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
            {rentData.map((categoryOption, index) => (
              <option key={index} value={categoryOption}>
              {categoryOption}
              </option>
            ))}
            </select>
          </div>
          <div className="h-full w-full">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input   value={Location} name="Location" placeholder="Search location"
  onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
            </Autocomplete>
          </div>
          <div className="h-full w-full">
            <select  value={nearestLocation}
        onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
           <option value="" disabled selected>
          Nearest location
        </option>
             <option value="2">Nearest 2 Km</option>
        <option value="4">Nearest 4 Km</option>
        <option value="6">Nearest 6 Km</option>
        <option value="8">Nearest 8 Km</option>
        <option value="10">Nearest 10 Km</option>
            </select>
          </div>
          <button  onClick={handleRentSearch} className="text-white  bg-emerald-500 font-bold text-xs rounded-lg px-5 py-1 h-10 col-span-3">Search</button>
        </>
        )}
        {activeTab === 'hotel' && (
            <>
           
            <div className="h-full w-full">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input   value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
              </Autocomplete>
            </div>
            <div className="h-full w-full">
              <select  value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
             <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
              </select>
            </div>
            <div className="h-full w-full" >
            <button  onClick={handleHotelSearch} className="text-white  bg-emerald-500 font-bold text-xs rounded-lg px-5 py-1 h-10 col-span-3">Search</button>
            </div>

          </>
        )}
        {activeTab === 'BanqueetHall' && (
            <>
           
            <div className="h-full w-full">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input   value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
              </Autocomplete>
            </div>
            <div className="h-full w-full">
              <select  value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
             <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
              </select>
            </div>
            <div className="h-full w-full" >
            <button  onClick={handleBanqueetHallSearch} className="text-white bg-emerald-500 font-bold text-xs rounded-lg px-5 py-1 h-10 col-span-3">Search</button>
            </div>

          </>
        )}
        {activeTab === 'Resort' && (
            <>
           
            <div className="h-full w-full">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input   value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
              </Autocomplete>
            </div>
            <div className="h-full w-full">
              <select  value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
             <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
              </select>
            </div>
            <div className="h-full w-full" >
            <button  onClick={handleResortSearch} className="text-white bg-emerald-500 font-bold text-xs rounded-lg px-5 py-1 h-10 col-span-3">Search</button>
            </div>

          </>
        )}
        

        {activeTab === 'Laundry' && (
          <>
          <div className="h-full w-full">
            <select
        name="service"
        value={services}
       onChange={handleServiceChange}
        required
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
      >
        <option value="">Select Service</option>
        {/* Replace this with your list of services */}
        <option value="Iron and Fold">Iron & Fold</option>
        <option value="Wash and Iron">Wash & Iron</option>
        <option value="Wash and Fold">Wash & Fold</option>
        <option value="Dry Cleaning">Dry Cleaning</option>
        <option value="Emergency Service">Emergency Service</option>
        <option value="Subscription Based">Subscription Based</option>
        {/* Add more options as needed */}
      </select>
          </div>
          
          <div className="h-full w-full">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input   value={Location} name="Location" placeholder="Search location"
  onChange={(e) => setLocation(e.target.value)} className="appearance-none text-xs border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
            </Autocomplete>
          </div>
          <div className="h-full w-full">
          <button  onClick={handleLaundrySearch} className="text-white bg-emerald-500 font-bold text-xs rounded-lg px-4 py-1 h-10 col-span-3">Search</button>
          </div>
        </>
        )}
        {activeTab === 'CloudKitchen' && (
          <>
          <div className="h-full w-full">
            <select
        name="service"
        value={services}
       onChange={handleServiceChange}
        required
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
      >
        <option value="">Select Service</option>
        {/* Replace this with your list of services */}
        <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
        {/* Add more options as needed */}
      </select>
          </div>
          
          <div className="h-full w-full">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input   value={Location} name="Location" placeholder="Search location"
  onChange={(e) => setLocation(e.target.value)} className="appearance-none text-xs border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
            </Autocomplete>
          </div>
          <div className="h-full w-full">
          <button  onClick={handleCloudKitchenSearch} className="text-white bg-emerald-500 font-bold text-xs rounded-lg px-4 py-1 h-10 col-span-3">Search</button>
          </div>
        </>
        )}

      </div>
    </div>
</div>
</section>
<section className="relative md:mt-0 mt-20 w-full lg:w-[70%] flex ju items-center ">
              <img src={images[currentIndex]} alt="Hero Image" className="h-full w-full object-contain" />
<div className="hidden lg:absolute top-32 left-10 h-12 w-40 p-2 lg:flex items-center justify-center bg-white rounded-md shadow-lg text-black font-bold text-xs gap-2 text-sm">
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M560 64c8.84 0 16-7.16 16-16V16c0-8.84-7.16-16-16-16H16C7.16 0 0 7.16 0 16v32c0 8.84 7.16 16 16 16h15.98v384H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h240v-80c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v80h240c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16h-16V64h16zm-304 44.8c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm0 96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm-128-96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zM179.2 256h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8zM192 384c0-53.02 42.98-96 96-96s96 42.98 96 96H192zm256-140.8c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-96c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4z">
</path>
</svg>
<p className="text-gray-500">Hotel Booking</p>
</div>
<div className="hidden lg:absolute bottom-20 left-16 h-12 w-40 p-2 lg:flex items-center justify-center bg-white rounded-md shadow-lg text-black font-bold text-xs gap-2 text-sm">
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M560 64c8.84 0 16-7.16 16-16V16c0-8.84-7.16-16-16-16H16C7.16 0 0 7.16 0 16v32c0 8.84 7.16 16 16 16h15.98v384H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h240v-80c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v80h240c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16h-16V64h16zm-304 44.8c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm0 96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm-128-96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zM179.2 256h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8zM192 384c0-53.02 42.98-96 96-96s96 42.98 96 96H192zm256-140.8c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-96c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4z">
</path>
</svg>
<p className="text-gray-500">PG Booking</p>
</div>
<div className="hidden lg:absolute top-28 right-10 h-12 w-40 p-2 lg:flex items-center justify-center bg-white rounded-md shadow-lg text-black font-bold text-xs gap-2 text-sm">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-map">
<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21">
</polygon>
<line x1="9" x2="9" y1="3" y2="18">
</line>
<line x1="15" x2="15" y1="6" y2="21">
</line>
</svg>
<p className="text-gray-500">Laundry Booking</p>
</div>
<div className="hidden lg:absolute bottom-28 right-5 h-12 w-40 p-2 lg:flex items-center justify-center bg-white rounded-md shadow-lg text-black font-bold text-xs gap-2 text-sm">
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M560 64c8.84 0 16-7.16 16-16V16c0-8.84-7.16-16-16-16H16C7.16 0 0 7.16 0 16v32c0 8.84 7.16 16 16 16h15.98v384H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h240v-80c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v80h240c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16h-16V64h16zm-304 44.8c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm0 96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm-128-96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zM179.2 256h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8zM192 384c0-53.02 42.98-96 96-96s96 42.98 96 96H192zm256-140.8c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-96c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4z">
</path>
</svg>
<p className="text-gray-500">Banqueet Hall Booking</p>
</div>
<div className="hidden lg:absolute -bottom-5 left-52 h-16 w-48 p-2 lg:flex items-center justify-center bg-white rounded-md shadow-lg text-black font-bold text-xs gap-2 text-sm">
<p className="h-10 w-10 bg-black font-bold text-xs rounded-full flex items-center justify-center text-white">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-phone">
<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
</path>
</svg>
</p>
<div>
<p className="text-sm text-gray-500">Customer Service</p>
<p className="text-sm text-gray-500">+12-12345 12345</p>
</div>
</div>
</section>
</div>
</main>
<h1 className="text-xl lg:text-xl lg:text-xl text-center font-extrabold py-2.5 text-[#10b981]  ">Your location found in  {locations}</h1>
</section>
    </div>
  )
}

export default HomePage