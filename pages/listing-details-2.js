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
const ListingDetails2 = () => {
  const [video, setVideo] = useState(false);
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const {category } = router.query;
  const handleCallNow = () => {
    window.open("tel:7667411501");
  };
  const handleBookNow = (selectedProperty) => {
    setSelectedRoom(selectedProperty); // Update selected room
    // Redirect to Booking.html with query parameters
    router.push({
      pathname: '/booking.html',
      query: {
        Name: Buydetaildata.BuyName,
        State: Buydetaildata.state,
        City:Buydetaildata.city,
        roomType: selectedProperty.type,
        roomprice: selectedProperty.price,
      },
    });
  };
  
  
  const [Buydetaildata, setBuydetaildata] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const db = firebase.firestore();
    const BuyRef = db.collection('buydetail').doc(id);

    BuyRef.get().then((doc) => {
      if (doc.exists) {
        setBuydetaildata(doc.data());
      } else {
        console.log('Document not found!');
      }
      setIsLoading(false);
    });
  }, []);

console.log(Buydetaildata)


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
                       
                        <h3 className="title">{Buydetaildata.Propertyname}</h3>
                        <div className="listing-meta">
                          <ul>
                            <li>
                              <span>
                                <i className="ti-location-pin" />
                                {Buydetaildata.location}
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
                {Buydetaildata.imgSrc && (
  <Carousel showThumbs={false} autoPlay>
    {Buydetaildata.imgSrc.map((image, index) => (
      <div key={index}>
        <img className='w-96 h-96' src={image} alt={`Image ${index}`} />
      </div>
    ))}
  </Carousel>
)}

                </div>
                <div className="listing-content mb-30 wow fadeInUp">
                  <h3 className="title">{Buydetaildata.BuyName}</h3>
                  <p>
                  {Buydetaildata.description}
                  </p>
                  {/* <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="icon-box icon-box-one">
                        <div className="icon">
                          <FaWifi className="ti-credit-card" />
                        </div>
                        <div className="flex info">
                          <h6>Wi-Fi</h6>
                          {Buydetaildata.wifi === 'Yes' ? <FaCheck className="text-green-500 ml-2" /> : <FaTimes className="text-red-500 ml-2" />}
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
                          {Buydetaildata.Aquaguard === 'Yes' ? <FaCheck className="text-green-500 ml-2" /> : <FaTimes className="text-red-500 ml-2" />}
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
                          {Buydetaildata.Laundry === 'Yes' ? <FaCheck className="text-green-500 ml-2" /> : <FaTimes className="text-red-500 ml-2" />}
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
                          {Buydetaildata.Food === 'Yes' ? <FaCheck className="text-green-500 ml-2" /> : <FaTimes className="text-red-500 ml-2" />}
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
                  </div> */}
                 
                </div>
                <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Details:</div>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontWeight: 'bold' }}>Property Process:</span>
      <span>{Buydetaildata.Propertyprocess}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontWeight: 'bold' }}>Kitchen:</span>
      <span>{Buydetaildata.kitchenaccessories}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontWeight: 'bold' }}>Nearby Locality:</span>
      <span>{Buydetaildata.nearbylocality}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontWeight: 'bold' }}>Locality:</span>
      <span>{Buydetaildata.locality}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontWeight: 'bold' }}>Parking Space:</span>
      <span>{Buydetaildata.parkingspcae} Sq.feet</span>
    </div>
  </div>
</div>
                <div className="listing-play-box mb-30 wow fadeInUp">
                  <h4 className="title">Video</h4>
                  <video controls>
                <source src={Buydetaildata.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
                </div>
            

              
              </div>
            </div>

            <div className="col-lg-4">
      <div className="sidebar-widget-area">
      <div className="widget business-hour-widget mb-30 wow fadeInUp">
          <h4 className="widget-title">Our {Buydetaildata.subcat}</h4>
          <ul className="time-info">
          {Buydetaildata.propertytypes && Array.isArray(Buydetaildata.propertytypes) ? (
  Buydetaildata.propertytypes.map((property, index) => (
            <li key={property.id}>
              <span className="day">{property.type} - {property.price} </span>
              {/* <span onClick={() => handleBookNow(property)} className="time st-close cursor-pointer">
  Book Now
</span> */}

            
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
  src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(Buydetaildata.location)}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`}
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
                 {Buydetaildata.location}
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
