import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { useRouter } from 'next/router';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheck, FaTimes, FaWifi, FaTint, FaTshirt, FaUtensils,FaBed, FaCar } from 'react-icons/fa';
import Slider from "react-slick";
import ListingDetailsRight from "../src/components/ListingDetailsRight";
import VideoPopup from "../src/components/VideoPopup";
import Layout from "../src/layouts/Layout";
import { GallerySlider2, reletedListingSlider2 } from "../src/sliderProps";
import Link from 'next/link';
const ListingDetails2 = ({bookNow}) => {
  const [video, setVideo] = useState(false);
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const {category } = router.query;
  const handleCallNow = () => {
    window.open("tel:7667411501");
  };
 
  const handleBookNow = (selectedProperty) => {
    setSelectedRoom(selectedProperty); // Update selected room
    // Redirect to Booking with query parameters
    router.push({
      pathname: '/booking',
      query: {
        Name: pgdetaildata.PGName,
        Agentid:pgdetaildata.AgentId,
        location: pgdetaildata.location,
        roomType: selectedProperty.type,
        roomprice: selectedProperty.price,
      },
    });
  };
  
  
  const [pgdetaildata, setPgdetaildata] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const db = firebase.firestore();
    const pgRef = db.collection('pgdetail').doc(id);

    pgRef.get().then((doc) => {
      if (doc.exists) {
        setPgdetaildata(doc.data());
      } else {
        console.log('Document not found!');
      }
      setIsLoading(false);
    });
  }, []);
console.log(pgdetaildata)
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const db = firebase.firestore();
      await db.collection('Contact').add(formData);
      toast.success('Enquiry submitted successfully!');
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast.error('Error submitting reservation. Please try again later.');
    }
  
    setIsLoading(false);
  };

  return (
    <div>

      {/*====== End breadcrumbs Section ======*/}
      {/*====== Start Listing Details Section ======*/}
      {isLoading ? (
        <div class="flex min-h-screen justify-center items-center">
        <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
    </div>
    
    ) : (
      <section className="listing-details-section pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="listing-details-wrapper listing-details-wrapper-two">
                <div className="listing-info-area mb-30 wow fadeInUp">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="listing-info-content">
                       
                        <h3 className="title">{pgdetaildata.PGName}</h3>
                        <div className="listing-meta">
                          <ul>
                            <li>
                              <span>
                                <i className="ti-location-pin" />
                                {item.location.split(',')[item.location.split(',').length - 4]},{item.location.split(',')[item.location.split(',').length - 3]}, {item.location.split(',')[item.location.split(',').length - 2]}, {item.location.split(',')[item.location.split(',').length - 1]}
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="ti-tablet" />
                                <a href="tel:+982653652-05">
                                  +98 (265) 3652 - 05
                                </a>
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="button">
                        <Link href="/listing-grid">
                          <a className="icon-btn">
                            <i className="ti-heart" />
                          </a>
                        </Link>
                        <Link href="/listing-grid">
                          <a className="icon-btn">
                            <i className="ti-share" />
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="listing-thumbnail mb-30 wow fadeInUp">
                <Carousel showThumbs={false} autoPlay>
                  {pgdetaildata.imgSrc.map((image, index) => (
                    <div key={index}>
                      <img className='h-96 w-96'  src={image} alt={`Image ${index}`} />
                    </div>
                  ))}
                </Carousel>
                </div>
                <div className="listing-content mb-30 wow fadeInUp">
                  <h3 className="title">{pgdetaildata.PGName}</h3>
                  <p>
                  {pgdetaildata.description}
                  </p>
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="icon-box icon-box-one">
                        <div className="icon">
                          <FaWifi className="ti-credit-card" />
                        </div>
                        <div className="flex info">
                          <h6>Wi-Fi</h6>
                          {pgdetaildata.wifi === 'Yes' ? <FaCheck className="text-green-500 ml-2" /> : <FaTimes className="text-red-500 ml-2" />}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="icon-box icon-box-one">
                        <div className="icon">
                        <FaTint  className="ti-drop" />
                        </div>
                        <div className="flex info">
                          <h6>Aquaguard</h6>
                          {pgdetaildata.Aquaguard === 'Yes' ? <FaCheck className="text-green-500 ml-2" /> : <FaTimes className="text-red-500 ml-2" />}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="icon-box icon-box-one">
                        <div className="icon">
                          <FaTshirt className="ti-rss-alt" />
                        </div>
                        <div className="flex info">
                          <h6>Laundry</h6>
                          {pgdetaildata.Laundry === 'Yes' ? <FaCheck className="text-green-500 ml-2" /> : <FaTimes className="text-red-500 ml-2" />}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="icon-box icon-box-one">
                        <div className="icon">
                          <FaUtensils className="ti-trash" />
                        </div>
                        <div className="flex info">
                          <h6>Food</h6>
                          {pgdetaildata.Food === 'Yes' ? <FaCheck className="text-green-500 ml-2" /> : <FaTimes className="text-red-500 ml-2" />}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="icon-box icon-box-one">
                        <div className="icon">
                          <i className="ti-car" />
                        </div>
                        <div className="info">
                          <h6>Parking Street</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="icon-box icon-box-one">
                        <div className="icon">
                          <i className="ti-credit-card" />
                        </div>
                        <div className="info">
                          <h6>Outdoor Seating</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                </div>
                <div className="listing-play-box mb-30 wow fadeInUp">
                  <h4 className="title">Video</h4>
                  <video controls>
                <source src={pgdetaildata.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
                </div>
                <div className="listing-tag-box mb-30 wow fadeInUp">
                  <h4 className="title">Nearby Places</h4>
                  <a href="#">Delivery</a>
                  <a href="#">Restaurant</a>
                  <a href="#">Free Internet</a>
                  <a href="#">Shopping</a>
                  <a href="#">Car Parking</a>
                </div>
              
              </div>
            </div>

            <div className="col-lg-4">
      <div className="sidebar-widget-area">
      <div className="widget business-hour-widget mb-30 wow fadeInUp">
          <h4 className="widget-title">Our Room</h4>
          <ul className="time-info">
          {pgdetaildata.roomTypes && Array.isArray(pgdetaildata.roomTypes) ? (
  pgdetaildata.roomTypes.map((property, index) => (
            <li key={property.id}>
              <span className="text-xs font-bold">{property.type} - ₹ {property.price}/month, Total Available-{property.availability} </span>
              <span
  style={{ marginLeft: 4 }}
  onClick={() => handleBookNow(property)}
  className="time st-close cursor-pointer"
>
  Book Now
</span>


            
            </li>
  ))
  ) : (
    <p>No flat types to display</p>
  )}
            
          </ul>
        </div>
        <div className="widget reservation-form-widget mb-30 wow fadeInUp">
      <h4 className="widget-title">Contact Us</h4>
      <form onSubmit={handleSubmit}>
        <div className="form_group">
          <input
            type="text"
            className="form_control"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <i className="ti-user" />
        </div>
        <div className="form_group">
          <input
            type="text"
            className="form_control"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <i className="ti-mobile" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh',padding:10,borderRadius:20 }}>
  <button type="submit" style={{ backgroundColor: '#10b981', fontSize: 24, color: 'white',padding:10,borderRadius:20 }} disabled={isLoading}>
    {isLoading ? 'Enquiry...' : 'Enquire Now'}
  </button>
</div>

      </form>
    </div>
        <div className="widget contact-info-widget mb-30 wow fadeInUp">
          <div className="contact-info-widget-wrap">
            <div className="contact-map">
            <iframe
  src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(item.location.split(',')[item.location.split(',').length - 4] + ',' + item.location.split(',')[item.location.split(',').length - 3] + ',' + item.location.split(',')[item.location.split(',').length - 2] + ',' + item.location.split(',')[item.location.split(',').length - 1])}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`}
  width="600"
  height="450"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
/>

              <a href="#" className="support-icon">
                <i className="flaticon-headphone" />
              </a>
            </div>
            <div className="contact-info-content">
              <h4 className="widget-title">Contact Info</h4>
              <div className="info-list">
                <p>
                  <i className="ti-tablet" />
                  <a href="tel:+98265365205">+98 (265) 3652 - 05</a>
                </p>
                <p>
                  <i className="ti-location-pin" />
                  {item.location.split(',')[item.location.split(',').length - 4]},{item.location.split(',')[item.location.split(',').length - 3]}, {item.location.split(',')[item.location.split(',').length - 2]}, {item.location.split(',')[item.location.split(',').length - 1]}
                </p>
                <p>
                  <i className="ti-email" />
                  <a href="mailto:contact@example.com">contact@example.com</a>
                </p>
                <p>
                  <i className="ti-world" />
                  <a href="www.fioxen.com">www.areneservices.com</a>
                </p>
              </div>
              <ul className="social-link">
                <li>
                  <a href="#">
                    <i className="ti-facebook" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="ti-twitter-alt" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="ti-pinterest" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="ti-dribbble" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
       
      </div>
    </div>
          </div>
        </div>
      </section>
    )}
    <ToastContainer/>
      {/*====== End Listing Details Section ======*/}
    </div>
  );
};
export default ListingDetails2;
