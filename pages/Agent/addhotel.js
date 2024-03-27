import React, { useState,useEffect,useRef } from 'react';
import { firebase } from '../../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone } from 'react-icons/fa';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import AgentNav from '../../components/AgentNav'
import { useRouter } from 'next/router';
import { City, Country, State } from "country-state-city";
import AddHotel from './Hotel/AddHotel';
const Index = () => {
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
          const userDocRef = doc(db, 'users', user.uid); // Update the path to the user document
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
    
   
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState({
    imgSrc: [],
    videoSrc: null,
    description: '',
    Owner: '',
    category: '',
    location: '',
    HotelName: '',
    wifi: '',
    Aquaguard: '',
    Laundry: '',
    Food: '',
    roomTypes: [],
  });


  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };

  const [Hoteldata, setHoteldata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const db = firebase.firestore();
          const galleryRef = db.collection('Hoteldetail').where('AgentId', '==', user.uid);
          const snapshot = await galleryRef.get();
          const data = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setHoteldata(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      }
    };
  
    fetchData();
  }, [user]);
  

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleEditImageChange = (e) => {
    const images = Array.from(e.target.files);
    setEditData({ ...editData, imgSrc: [...editData.imgSrc, ...images] });
  };

  const handleEditVideoChange = (e) => {
    const video = e.target.files[0];
    setEditData({ ...editData, videoSrc: video });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditRoomTypeChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRoomTypes = [...editData.roomTypes];
    updatedRoomTypes[index][name] = value;
    setEditData({ ...editData, roomTypes: updatedRoomTypes });
  };

  const handleEditAddRoomType = () => {
    const updatedRoomTypes = [...editData.roomTypes, { type: '', availability: '', price: '' }];
    setEditData({ ...editData, roomTypes: updatedRoomTypes });
  };

  const handleEdit = (id) => {
    const selectedData = Hoteldata.find((item) => item.id === id);
    setEditData({
      imgSrc: selectedData.imgSrc,
      videoSrc: selectedData.videoSrc,
      description: selectedData.description,
      Owner: selectedData.Owner,
      category: selectedData.category,
      HotelName: selectedData.HotelName,
      wifi: selectedData.wifi,
      Aquaguard: selectedData.Aquaguard,
      Laundry: selectedData.Laundry,
      Food: selectedData.Food,
      roomTypes: selectedData.roomTypes,
    });
    setIsEditing(true);
    setEditId(id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storageRef = firebase.storage().ref();

      // Uploading images
      const imageUrls = [];
      for (const image of editData.imgSrc) {
        if (typeof image === 'object') {
          const imageRef = storageRef.child(image.name);
          await imageRef.put(image);
          const url = await imageRef.getDownloadURL();
          imageUrls.push(url);
        } else {
          imageUrls.push(image);
        }
      }

      // Uploading video
      let videoUrl = editData.videoSrc;
      if (typeof editData.videoSrc === 'object') {
        const videoRef = storageRef.child(editData.videoSrc.name);
        await videoRef.put(editData.videoSrc);
        videoUrl = await videoRef.getDownloadURL();
      }

      const dataWithImageUrls = { ...editData, imgSrc: imageUrls, videoSrc: videoUrl };

      const db = firebase.firestore();
      await db.collection('Hoteldetail').doc(editId).update(dataWithImageUrls);

      toast.success('Update successful!', {
        position: toast.POSITION.TOP_CENTER,
      });
      window.location.reload();
      setEditData({
        imgSrc: [],
        videoSrc: null,
        description: '',
        Owner: '',
        category: '',
        HotelName: '',
        wifi: '',
        Aquaguard: '',
        Laundry: '',
        Food: '',
        roomTypes: [],
      });
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Update failed. Please try again.', {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
      setEditId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('Hoteldetail').doc(id).delete();
      const updatedData = Hoteldata.filter((item) => item.id !== id);
      setHoteldata(updatedData);
      toast.success('Deletion successful!', {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Deletion failed. Please try again.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };



  return (
    <div className='bg-white'>
       <AgentNav/>
       <div className="">
        {isLoading ? ( // Display loading message while isLoading is true
          <div className=" text-center p-8 bg-white dark:bg-white ">
          <div className="">
            <div className="bg-white  py-12">
              <div className="relative">
                <svg
                  width={180}
                  height={180}
                  viewBox="0 0 180 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M173.25 90C176.978 90 180.026 86.9733 179.747 83.2559C178.409 65.4488 171.797 48.3849 160.679 34.2815C148.163 18.4058 130.667 7.20597 111.01 2.48671C91.3529 -2.23255 70.6794 -0.196388 52.3206 8.26711C33.9619 16.7306 18.9872 31.1285 9.80942 49.1408C0.631678 67.1532 -2.21456 87.7309 1.72932 107.558C5.67321 127.385 16.1775 145.307 31.5497 158.437C46.9218 171.566 66.2665 179.137 86.4666 179.931C104.412 180.636 122.103 175.955 137.296 166.571C140.468 164.612 141.124 160.367 138.933 157.351C136.742 154.335 132.534 153.695 129.337 155.612C116.619 163.237 101.911 167.027 86.9966 166.441C69.8265 165.766 53.3835 159.331 40.3172 148.171C27.2509 137.011 18.3222 121.778 14.9699 104.924C11.6176 88.0712 14.0369 70.5802 21.838 55.2697C29.6391 39.9592 42.3676 27.721 57.9725 20.527C73.5775 13.3331 91.15 11.6023 107.859 15.6137C124.567 19.6251 139.439 29.1449 150.077 42.6393C159.317 54.3606 164.896 68.4875 166.202 83.2585C166.531 86.9719 169.522 90 173.25 90Z"
                    fill="#C7D2FE"
                  />
                </svg>
                <div className="absolute top-7 left-8 animate-spin">
                  <svg
                    width={119}
                    height={119}
                    viewBox="0 0 119 119"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.95 59.5C2.66391 59.5 -0.0308354 62.1706 0.297206 65.4402C1.34582 75.8918 5.14785 85.9181 11.3635 94.4732C18.7491 104.639 29.1633 112.205 41.1135 116.088C53.0637 119.971 65.9363 119.971 77.8865 116.088C89.8367 112.205 100.251 104.639 107.637 94.4732C115.022 84.3078 119 72.0652 119 59.5C119 46.9348 115.022 34.6922 107.636 24.5268C100.251 14.3613 89.8367 6.79498 77.8865 2.91213C67.8294 -0.355617 57.1189 -0.873278 46.8548 1.35917C43.6438 2.05756 41.9367 5.44566 42.9521 8.57092C43.9676 11.6962 47.3223 13.3669 50.5498 12.749C58.4035 11.2454 66.5436 11.739 74.2092 14.2297C83.7693 17.336 92.1007 23.3891 98.0092 31.5214C103.918 39.6538 107.1 49.4479 107.1 59.5C107.1 69.5521 103.918 79.3462 98.0092 87.4786C92.1007 95.6109 83.7694 101.664 74.2092 104.77C64.6491 107.877 54.3509 107.877 44.7908 104.77C35.2307 101.664 26.8993 95.6109 20.9908 87.4786C16.2532 80.9578 13.2683 73.3686 12.2714 65.4347C11.8617 62.1743 9.23609 59.5 5.95 59.5Z"
                      fill="#4338CA"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        ) : (
    <div className=" text-center p-8 bg-white dark:bg-white ">
        {isEditing ? (
        // Display the edit form when isEditing is true
<div>
        <form onSubmit={handleUpdate} className="flex flex-wrap justify-center gap-4">
          <button onClick={() => setIsEditing(false)} className="w-full p-2 bg-red-500 text-white rounded-md">
            Cancel
          </button>
          {/* Rest of the form */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
          <div className="flex flex-wrap justify-center gap-4 w-full">
  <div className="flex w-full gap-4">
    <div className="w-1/2">
      <label className="w-full">
        Upload Hostel Photos:
        <input type="file" accept="image/*" multiple onChange={handleEditImageChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
    <div className="w-1/2">
      <label className="w-full">
        Upload Hostel Video:
        <input type="file" accept="video/*" onChange={handleEditVideoChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
  </div>
</div>
           
{/* {userData && userData.userType === "Agent" ? (
                <div className="w-full">
                  <select
                    name="subcat"
                    value={editData.subcat}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Hostel Type</option>
                    <option value={userData.selectedHotelType}>
                      {userData.selectedHotelType}
                    </option>
                  </select>
                </div>
              ) : userData && userData.userType === "Individual" ? (
                <div className="w-full">
                  <select
                    name="subcat"
                    value={editData.subcat}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Hostel Type</option>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              ) : null} */}
        <input
          type="text"
          name="description"
          value={editData.description}
          onChange={handleEditChange}
          placeholder="Description"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
       
        <input
          type="text"
          name="Owner"
          value={editData.Owner}
          onChange={handleEditChange}
          placeholder="Room Owner Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        <div className="w-full">
          <select
            name="category"
            value={editData.category}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            
            <option value="Hotel">Hotel</option>
          </select>
        </div>
       
          
        <input
          type="text"
          name="HotelName"
          value={editData.HotelName}
          onChange={handleEditChange}
          placeholder="Hotel Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
     
      <div className="w-full">
          <select
            name="wifi"
            value={editData.wifi}
            onChange={handleEditChange}
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
            value={editData.Aquaguard}
            onChange={handleEditChange}
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
            value={editData.Laundry}
            onChange={handleEditChange}
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
            value={editData.Food}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Food Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        {editData.roomTypes.map((roomType, index) => (
          <div key={index} className="flex flex-wrap justify-center gap-4 w-full">
            <select
  name="type"
  value={roomType.type}
  onChange={(e) => handleEditRoomTypeChange(index, e)}
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
              onChange={(e) => handleEditRoomTypeChange(index, e)}
              placeholder="Availability"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="price"
              value={roomType.price}
              onChange={(e) => handleEditRoomTypeChange(index, e)}
              placeholder="Price"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
     
        <button type="button" onClick={handleEditAddRoomType} className="w-full p-2 bg-blue-500 text-white rounded-md">
          Add Room Type
        </button>
            {/* Add similar input fields for other data */}
          </div>
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div> 
    ) : showAllInputFormats ? (
    <div>
        <AddHotel handleCloseAllInputFormats={handleCloseAllInputFormats}/>
        </div>
      ) : (
        // Display the add Hotel Detail button when isEditing is false and showAllInputFormats is false
        <button onClick={handleShowAllInputFormats} className="w-full p-2 bg-blue-500 text-white rounded-md">
          Add Hotel Detail
        </button>
      )}
      <div>
      {Hoteldata.length > 0 ? (
      <div className="flex flex-wrap justify-center">
        <div className=" p-16 bg-white grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Hoteldata
            .map((item, index) => (
              <div key={item.id} className="relative mx-auto w-full">
                <Link
                   href={`/Hoteldetail?id=${item.id}`}
                  className="relative inline-block w-full transform transition-transform duration-300 ease-in-out hover:-translate-y-2"
                >
                  <div className="rounded-lg bg-white p-4 shadow">
                    <div className="relative flex justify-center overflow-hidden rounded-lg">
                      <Carousel showThumbs={false} autoPlay>
                        {item.imgSrc.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image}
                              alt={`Image ${index}`}
                             className='h-48 w-196'
                            />
                          </div>
                        ))}
                      </Carousel>
                    </div>

                    <div className="mt-4 text-start">
                      <h2 className="line-clamp-1   text-xl font-medium text-gray-800 md:text-sm" >
                        {item.location}
                      </h2>

                      <p className="text-primary  mt-2  rounded-xl font-semibold ">
                        <span className="text-xs">{item.HotelName}</span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="line-clamp-1 mt-2 text-lg text-gray-800">{item.description}</p>
                    </div>
                    <div className="justify-center">
                      <div className="mt-4 flex space-x-3 overflow-hidden rounded-lg px-1 py-1">
                        <p className="flex items-center font-medium text-gray-800">
                          <FaBed className="mr-2 text-blue-900" />
                          {item.bed}
                        </p>
                        <p className="flex items-center font-medium text-gray-800">
                          <FaPersonCircleCheck className="mr-2 text-blue-900" />
                          {item.bed}
                        </p>
                        <p className="flex items-center font-medium text-gray-800">
                          <FaHome className="mr-2 text-blue-900" />
                          {item.bed}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="h-6 w-6 rounded-full bg-gray-200 md:h-8 md:w-8"></div>
                          <span className="bg-primary-red absolute top-0 right-0 inline-block h-3 w-3 rounded-full"></span>
                        </div>

                        <p className="line-clamp-1 ml-2 text-gray-800">{item.Owner}</p>
                      </div>

                      <div className="flex justify-end">
                        <button>
                          <FaSms className="mr-2 text-2xl text-red-300" />
                        </button>
                        <button>
                          <FaPhone className="ml-4 text-2xl text-red-300" />
                        </button>
                      </div>
                  
                    </div>
                  </div>
                </Link>
                 <div className="flex items-center justify-between mt-4">
                
                      <button onClick={() => handleEdit(item.id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Edit
            </button>
               
           
                 <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Delete
            </button>
              
              </div>
              </div>
            ))}
        </div>
      </div>
    ) : (
      <div className="bg-gray-100">
        <div className="px-4 py-12">
          <div className="rounded relative">
            <div>
              <div className="flex justify-center items-center bg-white py-12">
               
        <div>
          <p className="text-indigo-700 font-semibold text-6xl text-center tracking-wide">
           No Data Please Upload
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
    )}
      </div>
     <ToastContainer />
    </div>
        )}
        </div>
    </div>
  );
};

export default Index;
