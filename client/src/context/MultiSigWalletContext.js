import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

//create react context
export const MultiSigWalletContext = React.createContext();

// since using metamask, get access to ethereum object
// - destructure here ==> window.ethereum
const { ethereum } = window;

// fetch ethereum contract
const getEthereumContract = () => {
  // provider is metamask
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  // fetch contract with these three things
  const MultiSigWalletContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
};

// contract provider always gets children
// wrapping entire react application with all the data
// thats getting passed into contract context
// will have access to the value object
export const MultiSigWalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletisConnected = async () => {
    try {
      if (!ethereum) return alert("🦊 Please install metamask");
      // get metamask connected accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });

      // Check if there is at least one account connected
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        // getAllTransactions()
      } else {
        console.log("😢 No accounts found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("😢 No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("🦊 Please install metamask");
      // connect metamaks accounts to Dapp
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("😢 No ethereum object");
    }
  };

  const submitTransaction = async () => {
      try {
          if (!ethereum) return alert("🦊 Please install metamask");

          //Submit transaction functionality
          
      } catch (error) {
          console.log(error);
          throw new Error("😢 No ethereum object");
      }
  }

  useEffect(() => {
    checkIfWalletisConnected();
  }, []);

  return (
    <MultiSigWalletContext.Provider value={{ connectWallet, currentAccount }}>
      {children}
    </MultiSigWalletContext.Provider>
  );
};
