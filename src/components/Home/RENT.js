import React,{useState,useEffect} from 'react'
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone,FaMapMarkerAlt  } from 'react-icons/fa';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { firebase } from '../../../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
const RENT = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [flatTypeFilter, setFlatTypeFilter] = useState('');
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
        const collectionRef = firebase.firestore().collection('rentdetail').where('Verified', '==', 'true');
  
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
  const filteredData = fetchedData.filter(item => parseFloat(item.distance) < parseFloat("5000"));

 console.log(filteredData)
  
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
    <section className="listing-grid-area pb-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="section-title text-center mb-25 wow fadeInUp">
                <span className="sub-title">Nearest Rent Property</span>
              </div>
            </div>
          </div>
          <div className="row">
           
            {loading ? ( // Show spinner while loading
    <div class="flex min-h-screen justify-center items-center">
    <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
</div>

) : (
    filteredData
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)) // Sort data based on distance
      .slice(0, 3) // Take only the first three items after sorting
      .map((item, index) => (
        <div key={item.id} className="col-lg-4 col-md-6 col-sm-12">
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
                  <span className="featured-btn">{item.subcat} Property</span>
                
                </div>
                <div className="listing-content">
                  <h3 className="title">
                    <Link href={`/rentdetail?id=${item.id}`}>
                      <a>{item.Propertyname}</a>
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
              
            {item.propertytypes.map((property, i) => (
                    <div key={i}>
                         <span className="price text-xs">{i + 1}. {property.type} - {property.price}/Month</span>
                    </div>
                  ))}

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
      
)}
           
           
          </div>
        </div>
      </section>
      <div
    class="fter:h-px  flex items-center before:h-px before:flex-1  before:bg-gray-300 before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">
    <a href='/Allrent'
        class="flex items-center rounded-full border border-gray-300 bg-secondary-50 px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="mr-1 h-4 w-4">
            <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd" />
        </svg>
        View More Rent Property
    </a>
</div>
  </div>
  )
}

export default RENT