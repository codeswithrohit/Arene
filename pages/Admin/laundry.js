import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../../Firebase/config";
import "firebase/firestore";
import AdminNavbar from "../../components/AdminNavbar";
const Laundry = () => {
    const [productdata, setProductdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [approvedCount, setApprovedCount] = useState(0);
    const [unapprovedCount, setUnapprovedCount] = useState(0);
    const [filter, setFilter] = useState('all'); // 'all', 'approved', 'unapproved'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = firebase.firestore();
                const galleryRef = db.collection('Laundry');
                const snapshot = await galleryRef.get();
                const data = [];
                let approved = 0;
                let unapproved = 0;
                snapshot.forEach((doc) => {
                    const item = { id: doc.id, ...doc.data() };
                    // Convert Verified field to boolean
                    item.Verified = item.Verified === "true"; // Convert "true" to true, "false" to false
                    data.push(item);
                    if (item.Verified) {
                        approved++;
                    } else {
                        unapproved++;
                    }
                });
                // Sort the data based on createdAt timestamp in descending order
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setProductdata(data);
                setApprovedCount(approved);
                setUnapprovedCount(unapproved);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setIsLoading(false); // Update isLoading to false even if there's an error
            }
        };
      
        fetchData();
    }, []);

    const handleVerificationChange = async (id, Verified) => {
        try {
            const db = firebase.firestore();
            const RentRef = db.collection('Laundry').doc(id);
            await RentRef.update({ Verified: Verified });
            // Update the local state to reflect the change immediately
            setProductdata(prevState => prevState.map(item => item.id === id ? { ...item, Verified: Verified === 'true' } : item));
            if (Verified === 'true') {
                setApprovedCount(prevCount => prevCount + 1);
                setUnapprovedCount(prevCount => prevCount - 1);
            } else {
                setApprovedCount(prevCount => prevCount - 1);
                setUnapprovedCount(prevCount => prevCount + 1);
            }
            console.log(`Verification status for Laundry with ID ${id} changed to ${Verified}`);
            
            // Show toast notification
            toast.success(`Verification status for Laundry with ID ${id} changed to ${Verified === 'true' ? 'Approved' : 'Unapproved'}`);
        } catch (error) {
            console.error('Error updating verification status: ', error);
            toast.error('Error updating verification status');
        }
    };

    // Get current items
    const filteredData = filter === 'approved' ? productdata.filter(item => item.Verified) :
                        filter === 'unapproved' ? productdata.filter(item => !item.Verified) :
                        productdata;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='min-h-screen  bg-white dark:bg-white'>
      <AdminNavbar/>
      <div className=" lg:ml-64 text-center p-8 bg-white dark:bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Laundry Data</h1>
                <div className="flex mb-4">
                    <button className={`mr-4 ${filter === 'all' ? 'bg-gray-500 rounded-sm px-2 text-white' : 'text-blue-500'}`} onClick={() => setFilter('all')}>All ({approvedCount + unapprovedCount})</button>
                    <button className={`mr-4 ${filter === 'approved' ? 'bg-gray-500 rounded-sm px-2 text-white' : 'text-blue-500'}`} onClick={() => setFilter('approved')}>Approved ({approvedCount})</button>
                    <button className={`${filter === 'unapproved' ? 'bg-gray-500 rounded-sm px-2 text-white' : 'text-blue-500'}`} onClick={() => setFilter('unapproved')}>Unapproved ({unapprovedCount})</button>
                </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white font-[sans-serif]">
            <thead class="bg-gray-100 whitespace-nowrap">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Vendor Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Services
                </th>

                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Loaction
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  GarmentTypes
                </th>
                <th className="py-3 px-4 text-left">Verification</th>

               
              </tr>
            </thead>
            <tbody class="whitespace-nowrap">
              {productdata
                .map((item, index) => (
                  <tr key={item.id} class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-base">
                      {item.vendor}
                    </td>
                    <td class="px-6 py-4 text-base">
                      {item.service}
                    </td>

                    <td class="px-6 py-4 text-base">
                      {item.location}
                    </td>
                    <td class="px-6 py-4 text-base">
                      {item.GarmentTypes && item.GarmentTypes.map((type, idx) => (
                        <div key={idx}>
                          <span>{type.tenure}</span> - <span>{type.noofgarments}</span> - <span>{type.price}</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4">
                                            <select
                                                className="border rounded p-1"
                                                value={item.Verified ? "true" : "false"}
                                                onChange={(e) => handleVerificationChange(item.id, e.target.value)}
                                            >
                                                <option value="true">Approved</option>
                                                <option value="false">Unapproved</option>
                                            </select>
                                        </td>
                    
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <nav className="mt-4" aria-label="Pagination">
                    <ul className="flex justify-center">
                        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
                            <li key={i} onClick={() => paginate(i + 1)} className={`cursor-pointer mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {i + 1}
                            </li>
                        ))}
                    </ul>
                </nav>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Laundry