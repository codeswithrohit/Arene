import React, { useState, useEffect, useRef } from 'react';

const DeliveryorderLocation = "Argora ranchi, India";
const DeliveryBoyhouse = "meccon community hall ranchi,India";

const Test = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);

            // Initialize Google Map
            const mapInstance = new window.google.maps.Map(mapRef.current, {
              center: { lat, lng },
              zoom: 12,
            });
            setMap(mapInstance);

            // Add user's current location marker
            addMarker(mapInstance, { lat, lng }, "https://img.icons8.com/ios-filled/50/000000/delivery.png");

            // Fetch and add other locations
            fetchLocationAndAddMarker(mapInstance, DeliveryorderLocation);
            fetchLocationAndAddMarker(mapInstance, DeliveryBoyhouse);

            // Fetch location name using reverse geocoding
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`)
              .then(response => response.json())
              .then(data => {
                if (data.results && data.results.length > 0) {
                  const addressComponents = data.results[0].address_components;
                  const cityName = addressComponents.find(component => component.types.includes('locality'));
                  const stateName = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
                  const countryName = addressComponents.find(component => component.types.includes('country'));

                  const detailedLocation = [cityName, stateName, countryName]
                    .filter(component => component !== undefined)
                    .map(component => component.long_name)
                    .join(', ');

                  setDeliveryLocation(detailedLocation);
                } else {
                  setDeliveryLocation("Location not found");
                }
              })
              .catch(error => {
                console.error('Error fetching location:', error);
                setDeliveryLocation("Error fetching location");
              });
          },
          (error) => {
            console.error('Error getting geolocation:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const fetchLocationAndAddMarker = (map, address) => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`)
        .then(response => response.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            addMarker(map, location, "https://img.icons8.com/ios-filled/50/000000/marker.png");
          } else {
            console.error(`Geocode was not successful for the following reason: ${data.status}`);
          }
        })
        .catch(error => console.error('Error fetching geocode:', error));
    };

    const addMarker = (map, location, iconUrl) => {
      new window.google.maps.Marker({
        position: location,
        map,
        icon: {
          url: iconUrl,
          scaledSize: new window.google.maps.Size(50, 50),
        },
      });
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeMap();
    }
  }, []);

  return (
    <div className='min-h-screen bg-white mt-48'>
      <h1 className="text-xl lg:text-xl text-center font-extrabold py-2.5 text-[#10b981]">
        Your location: {deliveryLocation}
      </h1>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default Test;
