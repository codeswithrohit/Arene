import React, { useState,useEffect,useRef } from 'react';
import { firebase } from '../../../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { City, Country, State } from "country-state-city";
import Selector from "../../../src/components/Selector";
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
const AddPG = ({handleCloseAllInputFormats}) => {
   
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    const [Location, setLocation] = useState('');
    const router = useRouter();
    const [user, setUser] = useState(null);
      const [userData, setUserData] = useState(null);
    
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
              router.push('/Agent/Register'); // Redirect to the login page if the user is not an Agent
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
    
    useEffect(() => {
      // ... (Previous code)
  
      if (userData) {
        if (userData.userType === 'Agent') {
          if (!userData.selectedPgType) {
            router.push('/Agent'); // Navigate to the login page if selectedBuyOption is not available
          }
        }
      }
  
      // ... (Previous code)
    }, [userData]);
    const [formData, setFormData] = useState({
      imgSrc: [],
      videoSrc: null,
      subcat: '',
      description: '',
      Owner: '',
      category: 'PG',
      PGName: '',
      wifi: '',
      Aquaguard: '',
      Laundry: '',
      Food: '',
      Verified: 'false',
      roomTypes: [],
      createdAt: new Date().toISOString(), // Add createdAt field with current date
  });
  
      const handleImageChange = (e) => {
        const images = Array.from(e.target.files);
        setFormData({ ...formData, imgSrc: [...formData.imgSrc, ...images] });
      };
    
      const handleVideoChange = (e) => {
        const video = e.target.files[0];
        setFormData({ ...formData, videoSrc: video });
      };
    
    
    
    // Fetch all countries
    let countryData = Country.getAllCountries();
      
    // Find the country object for India and set it as the default selected value
    const indiaCountry = countryData.find((country) => country.name === 'India');
    
    const [stateData, setStateData] = useState();
    const [cityData, setCityData] = useState();
    
    // Use India as the default selected country
    const [country, setCountry] = useState(indiaCountry);
    const [state, setState] = useState();
    const [city, setCity] = useState();
    useEffect(() => {
      setStateData(State.getStatesOfCountry(country?.isoCode));
    }, [country]);
    
    useEffect(() => {
      setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    }, [state]);
    
    useEffect(() => {
      stateData && setState(stateData.find((s) => s.name === 'Delhi'));
    }, [stateData]);
    
    useEffect(() => {
      cityData && setCity(cityData[0]);
    }, [cityData]);

    useEffect(() => {
        console.log('Selected State:', state?.name);
      }, [state]);
      
      useEffect(() => {
        console.log('Selected City:', city?.name);
      }, [city]);


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


      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleRoomTypeChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRoomTypes = [...formData.roomTypes];
        updatedRoomTypes[index][name] = value;
        setFormData({ ...formData, roomTypes: updatedRoomTypes });
      };
    
      const handleAddRoomType = () => {
        const updatedRoomTypes = [...formData.roomTypes, { type: '', availability: '', price: '' }];
        setFormData({ ...formData, roomTypes: updatedRoomTypes });
      };
    
    
      
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        for (const key in formData) {
          if (!formData[key]) {
            toast.error(`${key} cannot be empty. Please fill in all fields.`, {
              position: toast.POSITION.TOP_CENTER
            });
            return; // Stop submission if any field is empty
          }
        }
        setIsSubmitting(true);
    
        try {
          const storageRef = firebase.storage().ref();
    
          // Uploading images
          const imageUrls = [];
          for (const image of formData.imgSrc) {
            const imageRef = storageRef.child(image.name);
            await imageRef.put(image);
            const url = await imageRef.getDownloadURL();
            imageUrls.push(url);
          }
    
          // Uploading video
          const videoRef = storageRef.child(formData.videoSrc.name);
          await videoRef.put(formData.videoSrc);
          const videoUrl = await videoRef.getDownloadURL();
    
          const dataWithImageUrls = {
            ...formData,
            imgSrc: imageUrls,
            videoSrc: videoUrl,
            AgentId: user.uid,
            // state: state?.name || '',
            // city: city?.name || '',
            location: Location,
            Verified:'false'
          };
      
          // Log the data just before Firestore submission
          console.log('Data with Image URLs:', dataWithImageUrls);
    
    
          const db = firebase.firestore();
          const docRef = await db.collection('pgdetail').add(dataWithImageUrls);
          console.log('Document written with ID: ', docRef.id);
    
          toast.success('Submission successful!', {
            position: toast.POSITION.TOP_CENTER
          });
          setFormData({
            imgSrc: [],
            videoSrc: null,
            subcat: '',
            description: '',
            Owner: '',
            category: '',
            PGName: '',
            wifi: '',
            Aquaguard: '',
            Laundry: '',
            Food: '',
            roomTypes: [],
          });
        } catch (error) {
          console.error('Error adding document: ', error);
          toast.error('Submission failed. Please try again.', {
            position: toast.POSITION.TOP_CENTER
          });
        }
        finally {
          setIsSubmitting(false);
        }
      };   
      
      
      if (!isLoaded) {
        return (
          <div className='flex min-h-screen justify-center item-center'>
           <h1>Loading ....</h1>
          </div>
        );
      }
      
  return (
    <div>
      <button onClick={handleCloseAllInputFormats} className="w-full p-2 bg-red-500 text-white rounded-md">
            Close Form
          </button>
          <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-4">
         
      <div className="flex flex-wrap justify-center gap-4 w-full">
  <div className="flex w-full gap-4">
    <div className="w-1/2">
      <label className="w-full">
        Upload Hostel Photos:
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
    <div className="w-1/2">
      <label className="w-full">
        Upload Hostel Video:
        <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
  </div>
</div>

     
{userData && userData.userType === "Agent" ? (
                <div className="w-full">
                  <select
                    name="subcat"
                    value={formData.subcat}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Hostel Type</option>
                    <option value={userData.selectedPgType}>
                      {userData.selectedPgType}
                    </option>
                  </select>
                </div>
              ) : userData && userData.userType === "Individual" ? (
                <div className="w-full">
                  <select
                    name="subcat"
                    value={formData.subcat}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Hostel Type</option>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              ) : null}
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        
        <input
          type="text"
          name="Owner"
          value={formData.Owner}
          onChange={handleChange}
          placeholder="Room Owner Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
       {/* <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        /> */}
        {/* <div>
        <div className="lg:flex gap-8">
  {state && (
    <div className="">
      <p className="text-teal-800 font-semibold"> Select State </p>
      <Selector
        data={stateData}
        selected={state}
        setSelected={setState}
      />
    </div>
  )}
  {city && (
    <div>
      <p className="text-teal-800 font-semibold">Select City </p>
      <Selector data={cityData} selected={city} setSelected={setCity} />
    </div>
  )}
</div>

        </div> */}

<div style={{ width: '100%' }}> {/* Ensure the parent container spans the full width */}
  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
    <input
      name="Location"
      type="Location"
      value={Location}
      onChange={(e) => setLocation(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
      style={{ width: '100%' }} 
      placeholder="Enter Your location"
    />
  </Autocomplete>
</div>
    
        <input
          type="text"
          name="PGName"
          value={formData.PGName}
          onChange={handleChange}
          placeholder="PG Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
      
      <div className="w-full">
          <select
            name="wifi"
            value={formData.wifi}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Wi-Fi Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="w-full">
          <select
            name="Aquaguard"
            value={formData.Aquaguard}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Aquaguard Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
       <div className="w-full">
          <select
            name="Laundry"
            value={formData.Laundry}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Laundry Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
       <div className="w-full">
          <select
            name="Food"
            value={formData.Food}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Food Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
         {formData.roomTypes.map((roomType, index) => (
          <div key={index} className="flex flex-wrap justify-center gap-4 w-full">
           <select
  name="type"
  value={roomType.type}
  onChange={(e) => handleRoomTypeChange(index, e)}
  className="w-full p-2 border border-gray-300 rounded-md"
>
  <option value="">Select Type</option>
  <option value="Single Room">Single Room</option>
  <option value="Double Sharing Room">Double Sharing Room</option>
  <option value="Triple Sharing Room">Triple Sharing Room</option>
  <option value="Single Ac Room">Single Ac Room</option>
  <option value="Double Sharing Ac Room">Double Sharing Ac Room</option>
  <option value="Triple Sharing Ac Room">Triple Sharing Ac Room</option>
  {/* Add more options as needed */}
</select>
            <input
              type="number"
              name="availability"
              value={roomType.availability}
              onChange={(e) => handleRoomTypeChange(index, e)}
              placeholder="Availability"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="price"
              value={roomType.price}
              onChange={(e) => handleRoomTypeChange(index, e)}
              placeholder="Price"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddRoomType} className="w-full p-2 bg-blue-500 text-white rounded-md">
          Add Room Type
        </button>
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default AddPG