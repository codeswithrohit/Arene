import { useState, useEffect, useRef } from "react";
import { firebase } from "../../../Firebase/config";
import { About, Blog, Contact, Home, Listing, Pages,CloudKitchen,LaundryService } from "../Menu";
import { FaUser, FaShoppingCart } from "react-icons/fa"; // Import the cart icon
import Link from "next/link";
const Header1 = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid); // Fetch user data based on UID
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);
  

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData && userData.photoURL) {
          setUserData(userData);
        } else {
          // If photoURL is missing or undefined, set it to a default value or null
          setUserData({ ...userData, photoURL: null }); // You can set a default value or handle it as per your requirement
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };



  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true); // Set state to indicate logout is in progress
      await firebase.auth().signOut(); // Perform the logout action using Firebase Auth
      // Additional cleanup or state resetting if needed after logout

      setLoggingOut(false); // Reset state after successful logout
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      setLoggingOut(false); // Reset state in case of an error during logout
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };
  return (
    <header className="header-area header-area-one d-none d-xl-block">
      
      <div className="header-navigation">
        <div className="container-fluid">
          <div className="primary-menu">
            <div className="row">
              <div className="col-lg-2 col-5">
                <div className="site-branding">
                  <Link href="/">
                  <a
  className="custom-link" // Replace with your desired class name
  style={{
    padding: "21px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    // Other styles if needed
  }}
>
  <img
    src="https://www.areneservices.in/public/front/images/property-logo.png"
    alt="Brand Logo"
  />
</a>

                  </Link>
                </div>
              </div>
              <div className="col-lg-6 col-2">
                <div className="nav-menu">
                  <div className="navbar-close">
                    <i className="ti-close"></i>
                  </div>
                  <nav className="main-menu">
                    <ul>
                     
                        
                         
                    
                     
                      <li className="menu-item has-children">
                        <a href="#">PG</a>
                        <ul className="sub-menu">
                          <Listing/>
                        </ul>
                      </li>
                      <li className="menu-item has-children">
                        <a href="#">Buy</a>
                        <ul className="sub-menu">
                          <Pages />
                        </ul>
                      </li>
                      <li className="menu-item has-children">
                        <a href="#">Rent</a>
                        <ul className="sub-menu">
                          <Blog />
                        </ul>
                      </li>
                      <li className="menu-item ">
                        <a href="/hotelall">Hotel</a>
                        
                      </li>
                     
                    
                      <LaundryService/>
                      <CloudKitchen/>
                      <Contact />
                      <li className="nav-btn">
                        <Link href="/Admin/Register">
                          <a className="main-btn icon-btn">Add Listing</a>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-lg-4 col-5">
                <div className="header-right-nav">
                  <ul className="d-flex align-items-center">
                  <div className="nav-right-item">
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {user && userData ? (
                  <div className="flex items-center space-x-3  relative hover:cursor-pointer">
                    <div className="flex items-center">
                      {userData.photoURL ? (
                        <img
                          src={userData.photoURL}
                          alt="User Profile"
                          style={{width:24,height:24}}
                          className="md:w-8 md:h-8 w-8 h-8 rounded-full cursor-pointer"
                        />
                      ) : (
                        <FaUser style={{width:24,height:24}} className="" />
                      )}
                    </div>

                    {showDropdown && (
                      <div class="absolute  right-0 w-48 top-4   bg-white shadow-lg rounded-2xl dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div
                          class="py-1 border-b border-gray-200 dark:border-gray-600"
                          role="none"
                        >
                          <p class="px-4 pt-2 mb-1 font-normal text-black dark:text-black">
                            Signed in as:
                          </p>
                          <a
                            href="/Profile"
                            class="flex px-4 py-2 text-sm font-semibold text-black border-l-2 border-transparent hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600 dark:hover:text-red-600"
                          >
                            <span class="mr-2">
                              {userData.photoURL ? (
                                <img
                                  src={userData.photoURL}
                                  alt="User Profile"
                                  className="w-4 h-4 rounded-full cursor-pointer"
                                />
                              ) : (
                                <FaUser className="w-4 h-4 text-black cursor-pointer" />
                              )}
                            </span>
                            {userData.name}
                          </a>
                        </div>

                        <div class="py-1" role="none">
                          <a
                            href="/Our-history"
                            class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span class="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="w-4 h-4 hover:text-red-600 bi bi-bag"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm7-6a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2zm4 0a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2z"
                                ></path>
                              </svg>
                            </span>
                            Our Order
                          </a>
                        </div>

                        <div class="py-1" role="none">
                          <button
                            onClick={handleLogout}
                            class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span class="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="w-4 h-4 hover:text-red-600 bi bi-box-arrow-right"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                                />
                              </svg>
                            </span>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="menu-button ">
                    <Link href="/signin">
                      <div class="flex rounded  hover:border-red-600 overflow-hidden">
                      <li className="hero-nav-btn">
                      <Link href="/signin">
                        <a className="main-btn ">Login</a>
                      </Link>
                    </li>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              {/* <div class=" mr-4 md:ml-6  text-white flex justify-center items-center">
                <a href="/Cart" class="relative py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="file: md:w-8 md:h-8 w-8 h-8 ml-4 text-white hover:text-red-600 "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </a>
              </div> */}
              {/* <div className="navbar-toggler">
                <span />
                <span />
                <span />
              </div> */}
            </div>
                   
                    {/* <li className="user-btn">
                      <Link href="/Cart">
                        <a className="icon">
                        <FaShoppingCart />
                        </a>
                      </Link>
                    </li> */}
                    <li className="hero-nav-btn">
                      <Link href="/Agent/Register">
                        <a className="main-btn icon-btn">Add Listing</a>
                      </Link>
                    </li>
                    <li className="nav-toggle-btn">
                      <div className="navbar-toggler">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </li> 
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header1;
