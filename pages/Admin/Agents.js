import React, { useState, useEffect } from "react";
import { firebase } from "../../Firebase/config";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../components/AdminNavbar";

const User = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show more entries per page
  const router = useRouter();
  const [selectedAadharUrl, setSelectedAadharUrl] = useState("");
  const [selectedPanUrl, setSelectedPanUrl] = useState("");
  const [showAadharPopup, setShowAadharPopup] = useState(false);
  const [showPanPopup, setShowPanPopup] = useState(false);

  useEffect(() => {
    const db = firebase.firestore();
    const RegistrationRef = db.collection("AgentOwner");

    RegistrationRef.get()
      .then((RegistrationSnapshot) => {
        const RegistrationData = [];
        RegistrationSnapshot.forEach((doc) => {
          RegistrationData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        RegistrationData.sort(
          (a, b) => new Date(b.currentDate) - new Date(a.currentDate)
        );

        setRegistration(RegistrationData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setIsLoading(false);
      });
  }, []);

  const deleteUser = (userId) => {
    const db = firebase.firestore();

    const deleteFirestoreUser = async () => {
      try {
        return await db.collection("AgentOwner").doc(userId).delete();
      } catch (error) {
        throw new Error(`Error deleting user from Firestore: ${error}`);
      }
    };

    const deleteAuthUser = async () => {
      const userToDelete = firebase.auth().currentUser;
      if (userToDelete) {
        try {
          return await userToDelete.delete();
        } catch (error) {
          throw new Error(`Error deleting user from Authentication: ${error}`);
        }
      } else {
        return Promise.resolve();
      }
    };

    deleteFirestoreUser()
      .then(() => {
        console.log("User deleted from Firestore successfully!");
        return deleteAuthUser();
      })
      .then(() => {
        console.log("User deleted from Authentication successfully!");
        toast.success("User deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting user:", error.message);
        toast.error("Error deleting user");
      });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistration = registration.slice(startIndex, endIndex);

  const totalPages = Math.ceil(registration.length / itemsPerPage);

  const viewAadhar = (aadharUrl) => {
    setSelectedAadharUrl(aadharUrl);
    setShowAadharPopup(true);
  };

  const viewPan = (panUrl) => {
    setSelectedPanUrl(panUrl);
    setShowPanPopup(true);
  };

  const handleVerify = (userId) => {
    const db = firebase.firestore();
    const userRef = db.collection("AgentOwner").doc(userId);

    userRef
      .update({
        verified: true,
      })
      .then(() => {
        console.log("User verified successfully!");
        toast.success("User verified successfully!");
      })
      .catch((error) => {
        console.error("Error verifying user:", error.message);
        toast.error("Error verifying user");
      });
  };

  const handleUnverify = (userId) => {
    const db = firebase.firestore();
    const userRef = db.collection("AgentOwner").doc(userId);

    userRef
      .update({
        verified: false,
      })
      .then(() => {
        console.log("User unverified successfully!");
        toast.success("User unverified successfully!");
      })
      .catch((error) => {
        console.error("Error unverifying user:", error.message);
        toast.error("Error unverifying user");
      });
  };

  return (
    <div className="min-h-screen bg-white dark:white">
      <AdminNavbar />
      <>
        <div className="w-full lg:ml-56 sm:px-6">
          <div className="px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg">
            <div className="sm:flex items-center justify-between">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-black">
               Agent Data
              </p>
            </div>
          </div>

          {isLoading ? (
            <div class="flex min-h-screen justify-center items-center">
            <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
        </div>
          ) : (
            <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 font-[sans-serif]">
    <thead class="bg-gray-100 whitespace-nowrap">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Name
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
       Email
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Mobile Number
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Address
        </th>
      
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
    {currentRegistration.map((data, index) => (
      <tr key={data.id} >
        <td class="px-6 py-4 text-sm text-[#333]">
        {data.name}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {data.email}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {data.mobileNumber}
        </td>
      
        <td class="px-6 py-4 text-sm text-[#333]">
        <button
                          onClick={() => viewAadhar(data.aadharCardUrl)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Aadhar
                        </button>
                        <button
                          onClick={() => viewPan(data.panCardUrl)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          PAN
                        </button>
                        <select
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onChange={(e) => {
                            if (e.target.value === "verify") {
                              handleVerify(data.id);
                            } else if (e.target.value === "unverify") {
                              handleUnverify(data.id);
                            }
                          }}
                          value={data.verified ? "verify" : "unverify"} // Assuming `data.verified` represents the verification status
                        >
                          <option value="verify">Verify</option>
                          <option value="unverify">Unverify</option>
                        </select>
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {data.address}
        </td>
      </tr>
    ))}
    </tbody>
  </table>
            </div>
          )}
          <div className="flex items-center justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </>
      <div
        className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${
          showAadharPopup || showPanPopup ? "visible" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-lg">
          {showAadharPopup && (
            <img
              src={selectedAadharUrl}
              alt="Aadhar Card"
              className="h-96 w-96"
            />
          )}
          {showPanPopup && (
            <img src={selectedPanUrl} alt="PAN Card" className="h-96 w-96" />
          )}
          <button
            onClick={() => {
              setShowAadharPopup(false);
              setShowPanPopup(false);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default User;
