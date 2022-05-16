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
  return MultiSigWalletContract;
};

// contract provider always gets children
// wrapping entire react application with all the data
// thats getting passed into contract context
// will have access to the value object
export const MultiSigWalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: 0,
    data: "0x00",
  });
  const [etherAmount, setEtherAmount] = useState(0);
  const [contractBalance, setContractBalance] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [approvers, setApprovers] = useState([]);
  const [transactionArray, setTransactionArray] = useState([]);
  const [txHash, setTxHash] = useState([
    "0x1b1365cdc8f14f5fdec982ac8554db8b5628c0ee866c5e37aac88b9847bb5aa1",
    "0x48d800b04522671e2d63bf7d5fc70b818df499c42a47ab019bebb19f7b8ffe0c",
    "0x4ab6bdb7f373d7bf7cf72b54cace8c9ba4b44c3fa3a11d40ea8b9f19dcf69532",
    "0x86cd2c95da2ab52560a60b431965f6109dcda651eb8fa6046b1d8ba0eb1ee08e",
    "0x7081e33ef48da14c2f2ed16f25196d0f0a8cf4df018747cb388124c9d414c813",
  ]);
  const [txIndex, setTxIndex] = useState(null)
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [numApprovalsRequired, setNumApprovalsRequired] = useState(null)
  const [searchStatus, setSearchStatus] = useState(false)

  const getApprovalsRequired = async () => {
       const MultiSigWalletContract = getEthereumContract();
       const apprCount = await MultiSigWalletContract.numApprovalsRequired();
       setNumApprovalsRequired(parseInt(apprCount._hex));
  }

  const getContractBalance = async () => {
    const MultiSigWalletContract = getEthereumContract();
    const balance = ethers.utils.formatEther(
      await MultiSigWalletContract.provider.getBalance(contractAddress)
    );
    setContractBalance(balance);
  };

  const getTxCount = async () => {
    const MultiSigWalletContract = getEthereumContract();
    const txCount = await MultiSigWalletContract.getTransactionCount();
    setTransactionCount(txCount.toNumber());
  };

  const getApproverArray = async () => {
    const MultiSigWalletContract = getEthereumContract();
    const approverArray = await MultiSigWalletContract.getApprovers();
    setApprovers(approverArray);
  };

  const getTxArray = async () => {
    if (ethereum) {
      const MultiSigWalletContract = getEthereumContract();
      const txCount = await MultiSigWalletContract.getTransactionCount();
      for (let i = 0; i < txCount.toNumber(); i++) {
        let tx = await MultiSigWalletContract.getTransaction(i);
        const structuredTxObj = {
          addressTo: tx.to,
          amount: parseInt(tx.amount._hex) / 10 ** 18,
          isExecuted: tx.isExecuted,
          numApprovals: parseInt(tx.numApprovals._hex),
          txHash: txHash[i],
        };
        setTransactionArray((current) => [...current, structuredTxObj]);
      }
    }
  };

  const handleGetTxIndexChange = async (e) => {
      setTxIndex((prev) => prev = e.target.value)
      setSearchStatus(false)
  }

  const getUserApprovalStatus = async () => {
        const MultiSigWalletContract = getEthereumContract();
        const approvalStatus = await MultiSigWalletContract.isApproved(txIndex, currentAccount);
        setApprovalStatus(approvalStatus);
  }

  // setting each form value to whats typed in based on "name"
  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const checkIfWalletisConnected = async () => {
    try {
      if (!ethereum) return alert("🦊 Please install metamask");
      // get metamask connected accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });
      // Check if there is at least one account connected
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        window.ethereum.on("accountsChanged", (accounts1) => {
          setCurrentAccount(accounts1[0])
        });
        // get All Transactions...
        getTxArray();
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
      getApproverArray();
      getTxCount();
      getTxArray();
    } catch (error) {
      console.log(error);
      throw new Error("😢 No ethereum object");
    }
  };

  const handleSendEtherChange = (e) => {
    setEtherAmount(e.target.value);
  };

  const sendEther = async () => {
    try {
      if (!ethereum) return alert("🦊 Please install metamask");

      console.log("ether is being sent to: " + contractAddress);
      // needs to be converted to hexadecimal
      const parsedEtherAmount = ethers.utils.parseEther(etherAmount);
      try {
        const txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: contractAddress,
              //   gas: "0x5208", // hexadecimal for 21000 gwei --> this is optional (it would fail if i specify)
              value: parsedEtherAmount._hex,
            },
          ],
        });
        setIsLoading(true);
        console.log("loading");
        const MultiSigWalletContract = getEthereumContract();
        await MultiSigWalletContract.provider.once(txHash, (transaction) => {
          setIsLoading(false);
          console.log("Success! Transaction mined: " + txHash);
          getContractBalance();
        });
      } catch (error) {
        console.log(error);
        throw new Error("Transaction was declined or failed");
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
      const MultiSigWalletContract = getEthereumContract();

      const txHash = await MultiSigWalletContract.submitTransaction(
        addressTo,
        parsedAmount,
        data
      );
      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);

      setTxHash((current) => current.push(txHash.hash));
      // reloading components
      getTxCount();
      setTransactionArray([]);
      getTxArray();
    } catch (error) {
      console.log(error);
      throw new Error("😢 No ethereum object");
    }
  };

    const approveTransaction = async () => {
      try {
        if (!ethereum) return alert("🦊 Please install metamask");


        const MultiSigWalletContract = getEthereumContract();
        const txHash = await MultiSigWalletContract.approveTransaction(txIndex);
        setIsLoading(true);
        console.log(`Loading - ${txHash.hash}`);
        await txHash.wait();
        setIsLoading(false);
        console.log(`Success - ${txHash.hash}`);

        getUserApprovalStatus();
        setTransactionArray([]);
        getTxArray();
      } catch (error) {
        console.log(error);
        throw new Error("😢 No ethereum object");
      }
    };

    const revokeApproval = async () => {
      try {
        if (!ethereum) return alert("🦊 Please install metamask");

        const MultiSigWalletContract = getEthereumContract();
        const txHash = await MultiSigWalletContract.revokeApproval(txIndex);
        setIsLoading(true);
        console.log(`Loading - ${txHash.hash}`);
        await txHash.wait();
        setIsLoading(false);
        console.log(`Success - ${txHash.hash}`);

        getUserApprovalStatus();
        setTransactionArray([]);
        getTxArray();
      } catch (error) {
        console.log(error);
        throw new Error("😢 No ethereum object");
      }
    };

    const executeTransaction = async () => {
      try {
        if (!ethereum) return alert("🦊 Please install metamask");

        const MultiSigWalletContract = getEthereumContract();
        const txHash = await MultiSigWalletContract.executeTransaction(txIndex);
        setIsLoading(true);
        console.log(`Loading - ${txHash.hash}`);
        await txHash.wait();
        setIsLoading(false);
        console.log(`Success - ${txHash.hash}`);

        setTransactionArray([]);
        getTxArray();
      } catch (error) {
        console.log(error);
        throw new Error("😢 No ethereum object");
      }
    };

  useEffect(() => {
    checkIfWalletisConnected();
    getContractBalance();
    getTxCount();
    getApproverArray();
    getApprovalsRequired()
    // getTxArray()
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
        approvers,
        transactionArray,
        handleGetTxIndexChange,
        txIndex,
        getUserApprovalStatus,
        approvalStatus,
        approveTransaction,
        numApprovalsRequired,
        searchStatus,
        setSearchStatus,
        revokeApproval,
        executeTransaction,
        isLoading
      }}
    >
      {children}
    </MultiSigWalletContext.Provider>
  );
};
