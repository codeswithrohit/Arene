import React, { useState, useEffect } from 'react';
import { Map, Marker, Circle, Polyline, GoogleApiWrapper } from 'google-maps-react';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

const DeliveryLocation = "kargahar, Sasaram, Bihar, India,821107";
const DeliveryBoyLocation = "silari, Sasaram, Bihar, India,821111";

const Header = ({ google }) => {
  const [location, setLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [directionCoordinates, setDirectionCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const userLocation = await getCurrentLocation();
        setLocation(userLocation);
        
        const deliveryLoc = await fetchGeocode(DeliveryLocation);
        setDeliveryLocation(deliveryLoc);

        const deliveryBoyLoc = await fetchGeocode(DeliveryBoyLocation);
        setDeliveryBoyLocation(deliveryBoyLoc);

        const directions = await fetchDirections(userLocation, deliveryLoc);
        setDirectionCoordinates(decodePolyline(directions.polyline));
        setDistance(directions.distance);
        setDuration(directions.duration);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
          error => reject(new Error('Error fetching current location'))
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser'));
      }
    });
  };

  const fetchGeocode = async (address) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: 'YOUR_API_KEY',
      },
    });
    if (response.data.status === 'OK') {
      return response.data.results[0].geometry.location;
    } else {
      throw new Error('Error fetching geocode data');
    }
  };

  const fetchDirections = async (origin, destination) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: 'YOUR_API_KEY',
      },
    });
    if (response.data.status === 'OK') {
      const route = response.data.routes[0].legs[0];
      return {
        polyline: response.data.routes[0].overview_polyline.points,
        distance: route.distance.text,
        duration: route.duration.text,
      };
    } else {
      throw new Error('Error fetching directions');
    }
  };

  const decodePolyline = (encoded) => {
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    const coordinates = [];
    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return coordinates;
  };

  if (loading) {
    return (
      <div style={styles.spinnerContainer}>
        <ClipLoader loading={loading} size={150} color={'#123abc'} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Map google={google} initialCenter={location} zoom={14} style={styles.map}>
        <Circle center={location} radius={50} fillColor={'rgba(0, 255, 0, 0.3)'} />
        <Marker position={location} title="Your Location" label="Y" />
        <Marker position={deliveryLocation} title="Delivery Location" label="L" />
        <Marker position={deliveryBoyLocation} title="Delivery Boy Location" label="D" />
        <Polyline path={directionCoordinates} strokeColor="red" strokeOpacity={0.8} strokeWeight={2} />
      </Map>
      <div style={styles.infoContainer}>
        {/* <p style={styles.userInfoText}>Distance: {distance}</p>
        <p style={styles.userInfoText}>Duration: {duration}</p> */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ'
})(Header);
