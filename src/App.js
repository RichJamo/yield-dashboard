import React, { useEffect, useState } from 'react';
import { fetchYields } from './fetchYields';

function App() {
  const [yieldData, setYieldData] = useState(null);

  useEffect(() => {
    async function getYieldData() {
      try {
        const data = await fetchYields();
        setYieldData(data);
      } catch (error) {
        console.error("Error fetching yield data:", error);
      }
    }

    getYieldData();
  }, []);

  return (
    <div>
      <h1>Dapp Lending Protocol Yields</h1>
      {yieldData !== null ? (
        <p>Current Yield: {yieldData}%</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
