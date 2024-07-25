import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contractABI = [
  // Replace this with the actual ABI of the contract
  // Example ABI entry for a function to get yields
  "function getYields() view returns (uint256)"
];

export async function fetchYields() {
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const yields = await contract.getYields();
  return ethers.utils.formatUnits(yields, 18); // Adjust decimals as needed
}
