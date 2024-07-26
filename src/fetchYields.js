import gearboxLendingPoolABI from './abis/PoolV3.json';
const {ethers, JsonRpcProvider} = require("ethers");

const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const provider = new JsonRpcProvider(`https://arbitrum-mainnet.infura.io/v3/${infuraProjectId}`);
console.log(infuraProjectId);
console.log('Provider:', provider);
const gearboxLendingPoolAddress = '0x890A69EF363C9c7BdD5E36eb95Ceb569F63ACbF6';

export async function fetchYields() {
  const lendingPoolContract = new ethers.Contract(gearboxLendingPoolAddress, gearboxLendingPoolABI, provider);
  
  try {
    console.log('Calling supplyRate()...');
    const supplyRate = await lendingPoolContract.supplyRate();
    console.log('Supply Rate Response:', supplyRate);

    const formattedSupplyRate = ethers.formatUnits(supplyRate, 18);
    console.log(`Fetched APY for USDC: ${formattedSupplyRate}%`);
    return formattedSupplyRate;
  } catch (error) {
    console.error('Error fetching APY:', error);
    throw error;
  }
}

// import dotenv from 'dotenv';
// const fs = require('fs');

// dotenv.config();

// const infuraProjectId = process.env.RPC_URL;
// const provider = new ethers.providers.JsonRpcProvider(infuraProjectId);

// const contractAddress = "YOUR_CONTRACT_ADDRESS";
// const gearboxLendingPoolABI = JSON.parse(fs.readFileSync('../abis/PoolV3.json'));

// const contractABI = gearboxLendingPoolABI;

// export async function fetchYields() {
//   const contract = new ethers.Contract(contractAddress, contractABI, provider);
//   const yields = await contract.supplyRate();
//   return ethers.utils.formatUnits(yields, 18); // Adjust decimals as needed
// }
