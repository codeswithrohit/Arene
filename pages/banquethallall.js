import React,{useState,useEffect,useRef} from 'react'
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone,FaMapMarkerAlt  } from 'react-icons/fa';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
const Filter1 = () => {
  const [showFilters, setShowfilters] = useState(false);
  const [check, setCheck] = useState({
    Appartment: false,
    BuilderFloor: false,
    Villas: false,
    Land: false,
    ShopShowroom: false,
    OfficeSpace: false,
    OtherProperties: false,
    fabric: false,
    crocodile: false,
    wool: false,
    SingleRoom: false,
    DoubleSharingRoom: false,
    TripleSharingRoom: false,
    SingleAcRoom: false,
    DoubleSharingAcRoom: false,
    TripleSharingAcRoom: false,
    luxesignatire: false,
    luxelondon: false,
  });

  const { Appartment, BuilderFloor,Villas,Land,OtherProperties,ShopShowroom,OfficeSpace, fabric, crocodile, wool, SingleRoom, DoubleSharingRoom, TripleSharingRoom, SingleAcRoom,DoubleSharingAcRoom,TripleSharingAcRoom, luxesignatire, luxelondon } = check;
  const changeHandler = (e) => {
    setCheck({
      ...check,
      [e.target.name]: e.target.checked,
    });
  };

  const applyFilters = (e) => {
    // Apply filters based on both distance, price range, and room type
    const filteredData = fetchedData.filter((item) => {
      // Filter based on distance
      const isWithinDistance = parseFloat(item.distance) < parseFloat("5000");
      const subCategoryFilter = (Boys && item.subcat === "Boys") || (Girls && item.subcat === "Girls");
  
  
      return isWithinDistance && subCategoryFilter;
    });
  
    setFilteredData(filteredData);
    setShowfilters(false); // Close filter section after applying filters
  };
  
  
  

  const [price, setPrice] = useState(500);

  const updatePrice = (value) => {
    setPrice(value);
  };

  const minPrice = 500; // Define min price
  const maxPrice = 60000; // Define max price

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [flatTypeFilter, setFlatTypeFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [fetchedData, setFetchedData] = useState([]);
    const [priceRangeFilter, setPriceRangeFilter] = useState('');
    // Extracting the parameters from the URL query
    const [buydata, setBuyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [location, setLocation] = useState(null);
  
  
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
    
                    setLocation(detailedLocation);
                  } else {
                    setLocation("Location not found");
                  }
                })
                .catch(error => {
                  console.error('Error fetching location:', error);
                  setLocation("Error fetching location");
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
  
  
    


  

  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Replace 'yourCollectionName' with the actual collection name
          const collectionRef = firebase.firestore().collection('Banqueethalldetail').where('Verfied', '==', 'true');
    
          // Get all documents from the collection
          const querySnapshot = await collectionRef.get();
    
          // Extract the data from the documents along with document IDs
          const data = querySnapshot.docs.map((doc) => {
            const userData = doc.data();
            return {
              id: doc.id, // Add document ID to the data
              ...userData,
              distance: null, // Initially set distance as null
            };
          });
    
          // Set the fetched data to the state
          setFetchedData(data);
    
          // Calculate distances for each item
          const distances = await Promise.all(
            data.map(async (item) => {
              const formattedDistance = await calculateDistance(location, item.location);
              console.log(formattedDistance);
              return formattedDistance;
            })
          );
    
          // Update the distances in fetchedData
          const updatedData = data.map((item, index) => ({
            ...item,
            distance: distances[index],
          }));
    
          // Set the updated fetched data to the state
          setFetchedData(updatedData);
          setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
          console.error('Error fetching data:', error);
        
          setLoading(false); // Set loading to false in case of error
        }
      };
    
      fetchData(); // Call the function to fetch data
    }, [location]);
    
    const calculateDistance = (location1, location2) => {
      return new Promise((resolve, reject) => {
        if (location1.trim() !== '' && location2.trim() !== '') {
          const service = new window.google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
            {
              origins: [location1],
              destinations: [location2],
              travelMode: 'DRIVING',
            },
            (response, status) => {
              if (status === 'OK' && response.rows && response.rows.length > 0 && response.rows[0].elements && response.rows[0].elements.length > 0) {
                const { distance } = response.rows[0].elements[0];
                if (distance) {
                  const distanceValue = distance.value; // Distance in meters
                  const distanceKm = distanceValue / 1000; // Convert distance to kilometers
                  const formattedDistance = `${distance.text}`; // Construct the desired format
                  console.log('Distance:', formattedDistance);
                  resolve(formattedDistance);
                }
              } else {
                console.log('Error:', status);
                reject(null);
              }
            }
          );
        } else {
          console.log('Please enter both locations.');
          reject(null);
        }
      });
    };
  
    // Filter fetchedData based on distances less than 15 km
    useEffect(() => {
      // Filter fetchedData based on distances less than 15 km
      const filteredData = fetchedData.filter(item => parseFloat(item.distance) < parseFloat("5000"));
  
      console.log(filteredData);
      setFilteredData(filteredData);
    }, [fetchedData]);
  
   console.log(filteredData)


   const TotalData=filteredData.length
    
   const onViewMapClick = (location) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
  };

    return (

      <div className="px-8 min-h-screen ">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ&libraries=places`}
          async
          defer
        ></script>
        
      </Head>
       

        <section className="listing-grid-area mt-35 pb-1">
        <div className="container">
         
        <div className="flex justify-center items-center min-h-screen">
  <div className="row">
    {loading ? ( // Show spinner while loading
      <div className="flex justify-center items-center">
        <img className="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
      </div>
    ) : (
      filteredData.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-2xl text-gray-600">No Data</p>
        </div>
      ) : (
        filteredData
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)) // Sort data based on distance
          .map((item, index) => (
            <div key={item.id} className="col-lg-8 col-md-12 col-sm-24">
            <div 
  className="listing-item listing-grid-one mb-45 wow fadeInUp"
  data-wow-delay="10ms"
>
                <div className="listing-thumbnail">
                    

                <Carousel showThumbs={false} autoPlay>
            {item.imgSrc.map((src, idx) => (
              <div key={idx}>
                <img
                  src={src}
                  className="w-full h-64 lg:object-cover rounded-md"
                  style={{ objectFit: 'cover' }}
                  alt={`Image ${idx}`}
                />
              </div>
            ))}
          </Carousel>
                  {/* <span className="featured-btn">{item.subcat} Property</span> */}
                
                </div>
                <div className="listing-content">
                  <h3 className="title">
                    <Link href={`/banqueetdetail?id=${item.id}`}>
                      <a>{item.BanqueethallName}</a>
                    </Link>
                  </h3>
                  <div className="ratings">
                    <ul className="ratings ratings-three">
                      <li className="star">
                        <i className="flaticon-star-1"></i>
                      </li>
                      <li className="star">
                        <i className="flaticon-star-1"></i>
                      </li>
                      <li className="star">
                        <i className="flaticon-star-1"></i>
                      </li>
                      <li className="star">
                        <i className="flaticon-star-1"></i>
                      </li>
                      <li className="star">
                        <i className="flaticon-star-1"></i>
                      </li>
                      <li>
                        <span>
                          <a href="#">(02 Reviews)</a>
                        </span>
                      </li>
                    </ul>
                  </div>
              
          

                  <div >
    <p className='text-emerald-500'>Veg Per Plate - {item.vegperplate}</p>
    <p className='text-emerald-500'>
        Non-Veg Per Plate - {item.nonvegperplate}</p>
  </div>

                  <span className="phone-meta">
                    <i className="ti-tablet"></i>
                    <a href="tel:+919871713129">+919871713129</a>
                  </span>
                  <div className="listing-meta">
                    <ul>
                      <li>
                      <span>
        <i className="ti-location-pin"></i>
        {item.location.split(',')[item.location.split(',').length - 4]},{item.location.split(',')[item.location.split(',').length - 3]}, {item.location.split(',')[item.location.split(',').length - 2]}, {item.location.split(',')[item.location.split(',').length - 1]}
      </span>
                      </li>
                      <li>
                        <span>
                        <p className="flex capitalize items-center text-sm text-emerald-500 font-bold"> {item.distance} <span className="relative inline-flex rounded-md shadow-sm ml-2"><span className="flex absolute h-2 w-2 top-0 right-0 -mt-1 -mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span></span></p>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              </div>
          ))
      )
    )}
  </div>
</div>


        </div>
        
      </section>
        </div>
    );
};

export default Filter1;

