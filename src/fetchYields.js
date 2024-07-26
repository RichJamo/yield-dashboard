import gearboxLendingPoolABI from './abis/PoolV3.json';
const {ethers, JsonRpcProvider} = require("ethers");

const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const provider = new JsonRpcProvider(`https://arbitrum-mainnet.infura.io/v3/${infuraProjectId}`);

const contracts = [
  { protocol: 'Gearbox', chain: 'Arbitrum', asset: 'USDC', address: '0x890A69EF363C9c7BdD5E36eb95Ceb569F63ACbF6' },
  { protocol: 'Gearbox', chain: 'Arbitrum', asset: 'USDC.e', address: '0xa76c604145D7394DEc36C49Af494C144Ff327861' },
  // Add more contracts as needed
];

const convertSupplyRateToPercentage = (supplyRate) => {
  // Convert BigNumber to a regular number
  const rate = ethers.formatUnits(supplyRate, 27); // Format to a number with 27 decimal places
  
  // Convert to percentage
  const percentage = parseFloat(rate) * 100; // Multiply by 100 to get percentage

  return percentage.toFixed(2); // Fix to 2 decimal places for display
};

export async function fetchYields() {
  const results = [];
  
  for (const contractInfo of contracts) {
    const contract = new ethers.Contract(contractInfo.address, gearboxLendingPoolABI, provider);
    try {
      const supplyRate = await contract.supplyRate(); // Call the contract's supplyRate function
      const apyPercentage = convertSupplyRateToPercentage(supplyRate);
      results.push({
        protocol: contractInfo.protocol,
        chain: contractInfo.chain,
        asset: contractInfo.asset,
        apy: apyPercentage,
      });
    } catch (error) {
      console.error(`Error fetching APY for ${contractInfo.asset}:`, error);
      results.push({
        protocol: contractInfo.protocol,
        chain: contractInfo.chain,
        asset: contractInfo.asset,
        apy: 'Error',
      });
    }
  }
  
  return results;
}
