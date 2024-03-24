import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import AdminNavbar from '../../components/AdminNavbar';
import Link from 'next/link';
const PGData = () => {
    const [pgdata, setPgdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [approvedCount, setApprovedCount] = useState(0);
    const [unapprovedCount, setUnapprovedCount] = useState(0);
    const [filter, setFilter] = useState('all'); // 'all', 'approved', 'unapproved'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = firebase.firestore();
                const galleryRef = db.collection('pgdetail');
                const snapshot = await galleryRef.get();
                const data = [];
                let approved = 0;
                let unapproved = 0;
                snapshot.forEach((doc) => {
                    const item = { id: doc.id, ...doc.data() };
                    data.push(item);
                    if (item.Verfied) {
                        approved++;
                    } else {
                        unapproved++;
                    }
                });
                setPgdata(data);
                setApprovedCount(approved);
                setUnapprovedCount(unapproved);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
      
        fetchData();
    }, []);

    const handleVerificationChange = async (id, Verfied) => {
        try {
            const db = firebase.firestore();
            const pgRef = db.collection('pgdetail').doc(id);
            await pgRef.update({ Verfied: Verfied });
            // Update the local state to reflect the change immediately
            setPgdata(prevState => prevState.map(item => item.id === id ? { ...item, Verfied: Verfied === 'true' } : item));
            if (Verfied === 'true') {
                setApprovedCount(prevCount => prevCount + 1);
                setUnapprovedCount(prevCount => prevCount - 1);
            } else {
                setApprovedCount(prevCount => prevCount - 1);
                setUnapprovedCount(prevCount => prevCount + 1);
            }
            console.log(`Verification status for PG with ID ${id} changed to ${Verfied}`);
        } catch (error) {
            console.error('Error updating verification status: ', error);
        }
    };

    const filteredData = filter === 'approved' ? pgdata.filter(item => item.Verfied) :
                        filter === 'unapproved' ? pgdata.filter(item => !item.Verfied) :
                        pgdata;

    return (
        <div className="min-h-screen bg-white dark:white">
            <AdminNavbar/>
            <div className='lg:ml-64' >
            <h1 className="text-xl font-bold mb-4">PG Data</h1>
            <div className="mb-4">
                <button className="mr-4" onClick={() => setFilter('all')}>All ({approvedCount + unapprovedCount})</button>
                <button className="mr-4" onClick={() => setFilter('approved')}>Approved ({approvedCount})</button>
                <button onClick={() => setFilter('unapproved')}>Unapproved ({unapprovedCount})</button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.PGName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.Owner}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.subcat}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    className="border rounded p-1"
                                    value={item.Verfied ? "true" : "false"}
                                    onChange={(e) => handleVerificationChange(item.id, e.target.value)}
                                >
                                    <option value="true">Approved</option>
                                    <option value="false">Unapproved</option>
                                </select>
                            </td>
                            <td className="px-6 py-5 font-medium">
                  <Link href={`/pgdetail?id=${item.id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                   
                  >
                    View Details
                  </Link>
                </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default PGData;
