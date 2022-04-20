import React, { useContext } from "react";
import { MultiSigWalletContext } from "../context/MultiSigWalletContext";
import { SiEthereum } from "react-icons/si";
import { shortenAddress } from "../utils/shortenAddress";

const Profile = () => {
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

  return (
    <>
      {currentAccount ? (
        <>
          <div className="flex w-full justify-center items-center gradient-bg-home">
            <div className="flex mf:flex-row  items-start justify-between md:p-20 py-12 px-4">
              <div>Hello</div>
              <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0">
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
              <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glass">
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
