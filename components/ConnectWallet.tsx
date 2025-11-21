"use client";

import { useState, useEffect } from "react";
import { getEthereum } from "@/lib/blockchainConfig";

export default function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const eth = getEthereum();
    if (eth) {
      const accounts = await eth.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }
  };

  const connectWallet = async () => {
    const eth = getEthereum();
    if (!eth) {
      alert("Please install MetaMask");
      return;
    }
    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (err) {
      console.error("Failed to connect", err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <span className="text-sm font-mono bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded border border-gray-200 dark:border-zinc-700">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
