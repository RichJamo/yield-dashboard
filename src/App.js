import React, { useEffect, useState } from 'react';
import { fetchYields } from './fetchYields'; // Import your fetchYields function
import './YieldDashboard.css'; // Import CSS for styling

const YieldDashboard = () => {
  const [yieldData, setYieldData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getYieldData = async () => {
      try {
        const data = await fetchYields(); // Fetch yield data
        setYieldData(data); // Update state with the data
      } catch (error) {
        setError('Failed to fetch yield data'); // Update state with error message
      }
    };

    getYieldData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Yield Dashboard</h1>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : yieldData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-gray-300  text-left">Protocol</th>
                  <th className="px-4 py-2 border-b-2 border-gray-300  text-left">Chain</th>
                  <th className="px-4 py-2 border-b-2 border-gray-300  text-left">Asset</th>
                  <th className="px-4 py-2 border-b-2 border-gray-300  text-left">Total Supply</th>
                  <th className="px-4 py-2 border-b-2 border-gray-300  text-left">Base APY</th>
                  <th className="px-4 py-2 border-b-2 border-gray-300  text-left">Rewards APY</th>
                  <th className="px-4 py-2 border-b-2 border-gray-300  text-left">Total APY</th>
                  <th className="px-4 py-2 border-b-2 border-gray-300 text-left relative group">
                    Remaining Rewards Time
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden w-48 bg-gray-700 text-white text-xs rounded-lg py-2 px-4 group-hover:block">
                      The time left until the reward distribution period ends.
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-gray-700 border-transparent"></span>
                    </span>
                  </th>            
                </tr>
              </thead>
              <tbody>
                {yieldData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{item.protocol}</td>
                    <td className="px-4 py-2 border-b">{item.chain}</td>
                    <td className="px-4 py-2 border-b">{item.asset}</td>
                    <td className="px-4 py-2 border-b">{item.totalSupply}</td>
                    <td className="px-4 py-2 border-b">{item.apy}%</td>
                    <td className="px-4 py-2 border-b">{item.rewards}%</td>
                    <td className="px-4 py-2 border-b">{item.totalAPY}%</td>
                    <td className="px-4 py-2 border-b">{item.remainingTime} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default YieldDashboard;