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
  // if console.log this you can see all the functions of smart contract
  return MultiSigWalletContract
};

// contract provider always gets children
// wrapping entire react application with all the data
// thats getting passed into contract context
// will have access to the value object
export const MultiSigWalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
      addressTo: "", amount: 0, data: "0x00"
  })
  const [etherAmount, setEtherAmount] = useState(0);
  const [contractBalance, setContractBalance] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
  const [approvers, setApprovers] = useState([]);


  const getContractBalance = async () => {
    const MultiSigWalletContract = getEthereumContract();
    const balance = ethers.utils.formatEther(
      await MultiSigWalletContract.provider.getBalance(contractAddress)
    );
    setContractBalance(balance);
  }

  const getTxCount = async () => {
      const MultiSigWalletContract = getEthereumContract();
      const txCount = await MultiSigWalletContract.getTransactionCount();
      setTransactionCount(txCount.toNumber());
  }

  const getApproverArray = async () => {
    const MultiSigWalletContract = getEthereumContract();
    const approverArray = await MultiSigWalletContract.getApprovers();
    setApprovers(approverArray)
  };

  // setting each form value to whats typed in based on "name"
  const handleChange = (e, name) => {
      setFormData((prevState) =>  ({
          ...prevState, [name]: e.target.value
      }))
  }

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
      // connect Metamask accounts to Dapp
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("😢 No ethereum object");
    }
  };

  const handleSendEtherChange = (e) => {
      setEtherAmount(e.target.value)
  }

  const sendEther = async () => {
    try {
      if (!ethereum) return alert("🦊 Please install metamask");

      console.log("ether is being sent to: " + contractAddress);
      // needs to be converted to hexadecimal
      const parsedEtherAmount = ethers.utils.parseEther(etherAmount);
        try {
             const txHash = await ethereum
              .request({
                method: "eth_sendTransaction",
                params: [
                  {
                    from: currentAccount,
                    to: contractAddress,
                    //   gas: "0x5208", // hexadecimal for 21000 gwei --> this is optional (it would fail if i specify)
                    value: parsedEtherAmount._hex,
                  },
                ],
              })
                setIsLoading(true);
                console.log("loading");
                const MultiSigWalletContract = getEthereumContract();
                await MultiSigWalletContract.provider.once(txHash, (transaction) => {
                    setIsLoading(false);
                    console.log("Success! Transaction mined: " + txHash);
                    getContractBalance()
                });
        } catch (error) {
            console.log(error);
            throw new Error("Transaction was declined or failed")
        }
    } catch (error) {
      console.log(error);
      throw new Error("😢 No ethereum object");
    }
  };

  const submitTransaction = async () => {
      try {
          if (!ethereum) return alert("🦊 Please install metamask");

          //Submit transaction functionality
          const { addressTo, amount, data } = formData;
          const parsedAmount = ethers.utils.parseEther(amount);
          // getting contract instance - can now use this variable to call any function from smart contract
          const MultiSigWalletContract = getEthereumContract()

         const txHash = await MultiSigWalletContract.submitTransaction(addressTo, parsedAmount, data);
         setIsLoading(true);
         console.log(`Loading - ${txHash.hash}`);
        await txHash.wait();
         setIsLoading(false);
         console.log(`Success - ${txHash.hash}`);
         

        getTxCount();
        

        //  const transaction = await MultiSigWalletContract.getTransaction(0);
        //  console.log(transaction);
          
      } catch (error) {
          console.log(error);
          throw new Error("😢 No ethereum object");
      }
  }


//   const approveTransaction = async () => {
//     try {
//       if (!ethereum) return alert("🦊 Please install metamask");

      
//       const MultiSigWalletContract = getEthereumContract();

//       const txHash = await MultiSigWalletContract.submitTransaction(txIndex);
//       setIsLoading(true);
//       console.log(`Loading - ${txHash.hash}`);
//       await txHash.wait();
//       setIsLoading(false);
//       console.log(`Success - ${txHash.hash}`);

//     //   const transaction = await MultiSigWalletContract.getTransaction(0);
//     //   console.log(transaction);
//     } catch (error) {
//       console.log(error);
//       throw new Error("😢 No ethereum object");
//     }
//   };


  useEffect(() => {
    checkIfWalletisConnected();
    getContractBalance()
    getTxCount()
    getApproverArray()
  }, []);

  // wrap around everything and all components have access to data passed into value
  return (
    <MultiSigWalletContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        submitTransaction,
        sendEther,
        handleSendEtherChange,
        etherAmount,
        setEtherAmount,
        contractBalance,
        transactionCount,
        approvers
      }}
    >
      {children}
    </MultiSigWalletContext.Provider>
  );
};
