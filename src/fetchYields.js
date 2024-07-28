import gearboxLendingPoolABI from './abis/PoolV3.json';
import farmingPoolABI from './abis/farmingPoolABI.json';
import priceFeedABI from './abis/priceFeedABI.json';

const {ethers, JsonRpcProvider} = require("ethers");

const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const provider = new JsonRpcProvider(`https://arbitrum-mainnet.infura.io/v3/${infuraProjectId}`);

const contracts = [
  { protocol: 'Gearbox', chain: 'Arbitrum', asset: 'USDC', address: '0x890A69EF363C9c7BdD5E36eb95Ceb569F63ACbF6', farmingPoolAddress: '0xD0181a36B0566a8645B7eECFf2148adE7Ecf2BE9' },
  { protocol: 'Gearbox', chain: 'Arbitrum', asset: 'USDC.e', address: '0xa76c604145D7394DEc36C49Af494C144Ff327861', farmingPoolAddress: '0x'},
  // Add more contracts as needed
];
const priceFeedAddress = '0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6';

const convertSupplyRateToPercentage = (supplyRate) => {
  const rate = ethers.formatUnits(supplyRate, 27); // Format to a number with 27 decimal places
  
  const percentage = parseFloat(rate) * 100;

  return percentage.toFixed(2);
};

const calculateRewardsAPY = (priceData, totalSupply, duration, reward, finished) => {
  const balance = parseFloat(ethers.formatUnits(totalSupply, 6))
  const arbPrice = ethers.formatUnits(priceData.answer, 8); // Price with 8 decimals
  const currentTime = Math.floor(Date.now() / 1000);
  const elapsedTime = Math.min(currentTime, finished) - (finished - duration);
  const remainingTime = finished - currentTime;
  const distributedRewards = (elapsedTime * reward) / duration;
  const remainingRewards = reward - distributedRewards;
  const rewardsPerSecond = remainingRewards / remainingTime;
  const rewardsPerSecondInUSD = rewardsPerSecond * arbPrice;
  const rewardsPerYear = rewardsPerSecondInUSD * (60 * 60 * 24 * 365.25);
  const rewardsAPY = (rewardsPerYear / balance * 100).toFixed(2);
  return {rewardsAPY, remainingTime};
};

export async function fetchYields() {
  const results = [];
  const priceFeedContract = new ethers.Contract(priceFeedAddress, priceFeedABI, provider);

  for (const contractInfo of contracts) {
    const contract = new ethers.Contract(contractInfo.address, gearboxLendingPoolABI, provider);
    var farmingPoolContract;
    if (contractInfo.farmingPoolAddress !== '0x') {
      farmingPoolContract = new ethers.Contract(contractInfo.farmingPoolAddress, farmingPoolABI, provider);
      }
    try {
      const supplyRate = await contract.supplyRate();
      const apyPercentage = convertSupplyRateToPercentage(supplyRate);
      
      const priceData = await priceFeedContract.latestRoundData(); // Fetch the latest ARB/USD price
      const totalSupply = await contract.totalSupply();
      const farmInfo = await farmingPoolContract.farmInfo();
      
      const duration = parseFloat(farmInfo.duration);
      const reward = parseFloat(ethers.formatUnits(farmInfo.reward, 18)); // Assuming reward is in 18 decimals
      const finished = parseFloat(farmInfo.finished);
      var rewardsAPY, remainingTime;
      if (contractInfo.farmingPoolAddress !== '0x') {
        const result = calculateRewardsAPY(priceData, totalSupply, duration, reward, finished);
        ({ rewardsAPY, remainingTime } = result);
      } else {
        rewardsAPY = 0;
        remainingTime = 0;
      }
      results.push({
        protocol: contractInfo.protocol,
        chain: contractInfo.chain,
        asset: contractInfo.asset,
        totalSupply: parseFloat(ethers.formatUnits(totalSupply, 6)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        apy: apyPercentage,
        rewards: rewardsAPY,
        remainingTime: (remainingTime / (60 * 60 * 24)).toFixed(2),
        totalAPY: (parseFloat(apyPercentage) + parseFloat(rewardsAPY)).toFixed(2),
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
