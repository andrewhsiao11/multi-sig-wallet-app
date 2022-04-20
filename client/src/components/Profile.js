import React, { useContext } from "react";
import { MultiSigWalletContext } from "../context/MultiSigWalletContext";
import { SiEthereum } from "react-icons/si";

const Profile = () => {
  const {
    connectWallet,
    currentAccount,
    transactionArray,
    handleGetTxIndexChange,
    txIndex,
    getUserApprovalStatus,
    approvalStatus
  } = useContext(MultiSigWalletContext);

  const handleGetTxIndex = (e) => {
    // handle not a valid transaction
    if (txIndex >= transactionArray.length || txIndex < 0)
      return alert("Transaction does not exist at that index");
    e.preventDefault();
    getUserApprovalStatus(txIndex, currentAccount);
  };

  return (
    <>
      {currentAccount ? (
        <>
          <div className="flex w-full justify-center items-center gradient-bg-home">
            <div className="flex mf:flex-row  items-start justify-between md:p-8 py-12 px-4">
              <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                <h1 className="text-3xl sm:text-5xl text-white py-1">
                  Welcome User
                </h1>
                <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                  Search for a transaction here and approve and revoke below.
                </p>
                <div className="p-4 sm:w-96 w-full flex flex-col justify-start items-center blue-glass mt-7">
                  <form className="w-full max-w-sm">
                    <div className="flex items-center">
                      <input
                        placeholder="Transaction index"
                        name="transactionIndex"
                        type="number"
                        step="1"
                        min="0"
                        max={transactionArray.length - 1}
                        // value={etherAmount}
                        onChange={handleGetTxIndexChange}
                        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glass"
                      ></input>
                      <button
                        className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                        type="button"
                        onClick={handleGetTxIndex}
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  <div className="flex">
                    {approvalStatus === null ? "" : 
                    (<p className="text-white">
                      Approved by you: {approvalStatus ? "✅" : "❌"}
                    </p>)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0  mt-10">
                <div className="p-3 flex justify-end items-start flex-col rounded-xl h-15 w-full my-5 eth-card .white-glass">
                  <div className="flex justify-between flex-col w-full h-full">
                    <div className="flex items-start">
                      <a href="/profile">
                        <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                          <SiEthereum fontSize={21} color="#fff" />
                        </div>
                      </a>
                      <div className="ml-4 mt-2">
                        <p className="text-white font-light text-sm ">
                          {currentAccount
                            ? currentAccount
                            : "Log in to see your account"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex justify-center py-6">
              <h1 className="text-3xl sm:text-5xl text-white py-1 mr-10">
                Welcome
              </h1>
            </div> */}
          </div>
          {/*  */}
          <div className="flex w-full justify-center items-center gradient-bg-approvers">
            <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
              <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glass">
                <input type="text" name="" id=""></input>
                <br />
                <input type="text" name="" id=""></input>

                <div className="h-[1px] w-full bg-gray-400 my-2 mb-11">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-white w-full mt-3 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                  >
                    Send now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full justify-center items-center gradient-bg-home">
            <div className="flex mf:flex-row  items-start justify-between md:p-20 py-12 px-4">
              <div>
                <h1 className="w-full text-white text-4xl">
                  Log in to see your account
                </h1>
              </div>
              <div>
                <button
                  type="button"
                  onClick={connectWallet}
                  className="w-full ml-4 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                >
                  <p className="text-white text-base font-semibold">
                    Connect Wallet
                  </p>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
