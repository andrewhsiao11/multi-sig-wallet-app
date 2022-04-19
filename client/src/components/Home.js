import React, { useContext } from "react";
import { MultiSigWalletContext } from "../context/MultiSigWalletContext";
import { Transactions, Loader, Approvers } from "../components";
import { SiEthereum } from "react-icons/si";
import {shortenAddress} from "../utils/shortenAddress"

// simple input component for reusability
const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glass"
  />
);

const Home = () => {
  const {
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
  } = useContext(MultiSigWalletContext);

  const handleSubmit = (e) => { 
    //destructure from formData
    const {addressTo, amount, data} = formData
    e.preventDefault()

    if(!addressTo || !amount) return;

    submitTransaction();
    setFormData({ addressTo: "", amount: 0, data: "0x00" });
   }

   const handleSendEther = (e) => { 
    if(etherAmount <=0 ) return;
    e.preventDefault()
    sendEther()
    setEtherAmount(0)
    }

  return (
    <>
      <div className="flex w-full justify-center items-center gradient-bg-home">
        <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
          <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
            <h1 className="text-3xl sm:text-5xl text-white py-1">
              Welcome to your dashboard
            </h1>
            <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
              {currentAccount
                ? "View all transactions below. Submit, approve, and revoke transactions in the sections below."
                : "Connect your Metamask wallet to begin."}
            </p>

            {!currentAccount ? (
              <button
                type="button"
                onClick={connectWallet}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <p className="text-white text-base font-semibold">
                  Connect Wallet
                </p>
              </button>
            ) : (
              <>
                <div className="p-4 sm:w-96 w-full flex flex-col justify-start items-center blue-glass mt-7">
                  <form className="w-full max-w-sm">
                    <div className="flex items-center">
                      <div className="flex -ml-2">
                        <SiEthereum fontSize={21} color="#fff" />
                      </div>
                      <input
                        placeholder="Amount (ETH)"
                        name="etherAmount"
                        type="number"
                        step="0.0001"
                        // value={etherAmount}
                        onChange={handleSendEtherChange}
                        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glass"
                      ></input>
                      <button
                        className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                        type="button"
                        onClick={handleSendEther}
                      >
                        Add Ether
                      </button>
                    </div>
                  </form>

                  <div className="flex">
                    <p className="text-white">Contract Balance: {contractBalance} ETH</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-15 sm:w-72 w-full my-5 eth-card .white-glass">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <div className="ml-4 mt-2">
                  <p className="text-white font-light text-sm ">{currentAccount ? shortenAddress(currentAccount) : "Log in to see your account"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glass">
            <Input
              placeholder="Address To"
              name="addressTo"
              type="text"
              handleChange={handleChange}
            />
            <Input
              placeholder="Amount (ETH)"
              name="amount"
              type="number"
              handleChange={handleChange}
            />
            <div className="h-[1px] w-full bg-gray-400 my-2 mb-11">
              {false ? (
                <Loader />
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white w-full mt-3 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Approvers/>
      <Transactions />
    </>
  );
};

export default Home;
