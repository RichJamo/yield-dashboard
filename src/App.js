import React, { useEffect, useState } from 'react';
import { fetchYields } from './fetchYields'; // Import your fetchYields function

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
    <div>
      <h1>Yield Dashboard</h1>
      {error ? (
        <p>{error}</p> // Display error message if any
      ) : yieldData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Protocol</th>
              <th>Chain</th>
              <th>Asset</th>
              <th>Base APY</th>
            </tr>
          </thead>
          <tbody>
            {yieldData.map((item, index) => (
              <tr key={index}>
                <td>{item.protocol}</td>
                <td>{item.chain}</td>
                <td>{item.asset}</td>
                <td>{item.apy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p> // Show loading message while fetching data
      )}
    </div>
  );
};

export default YieldDashboard;
