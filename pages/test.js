import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import Head from 'next/head';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const Filter1 = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [pgDetailData, setPgDetailData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = firebase.firestore().collection('pgdetail').where('Verified', '==', 'true');
        const querySnapshot = await collectionRef.get();
        const data = querySnapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            id: doc.id,
            ...userData,
            distance: null,
          };
        });

        // Calculate distances for each item
        const distances = await Promise.all(
          data.map(async (item) => {
            const formattedDistance = await calculateDistance(selectedLocation, item.location);
            return formattedDistance;
          })
        );

        // Update the distances in pgDetailData
        const updatedData = data.map((item, index) => ({
          ...item,
          distance: distances[index],
        }));

        setPgDetailData(updatedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (selectedLocation) {
      fetchData();
    }
  }, [selectedLocation]);

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


  const handlePlaceSelect = (place) => {
    setSelectedLocation({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.formatted_address,
    });
  };

  return (
    <div className="px-8 min-h-screen">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ&libraries=places`}
          async
          defer
        ></script>
      </Head>

      <section className="listing-grid-area pt-15 pb-1">
        <div className="container">
          <LoadScript googleMapsApiKey="AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ">
            <Autocomplete onLoad={(autocomplete) => (autocomplete ? null : null)} onPlaceChanged={() => null}>
              <input
                type="text"
                placeholder="Enter Location"
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `240px`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-120px',
                }}
              />
            </Autocomplete>
          </LoadScript>

          {loading ? (
            <div>Loading...</div>
          ) : (
            pgDetailData.map((item) => (
              <div key={item.id}>
                {/* Render your pg detail data here */}
                <p>{item.PGName}</p>
                <p>{item.distance}</p>
                {/* Add more details as needed */}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Filter1;
