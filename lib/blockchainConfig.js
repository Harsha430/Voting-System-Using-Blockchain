import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

export function getEthereum() {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  }
  return null;
}

export async function getProvider() {
  const eth = getEthereum();
  if (!eth) throw new Error("MetaMask not installed");
  
  const provider = new ethers.BrowserProvider(eth);
  const network = await provider.getNetwork();
  
  if (network.chainId !== 11155111n) {
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
         alert("Please add Sepolia network to MetaMask");
      }
      throw new Error("Please switch to Sepolia network");
    }
  }
  
  return provider;
}

export async function getContract() {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return contract;
}
