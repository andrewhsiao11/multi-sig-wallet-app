import React, { useContext } from "react";
import { MultiSigWalletContext } from "../context/MultiSigWalletContext";
import { shortenAddress } from "../utils/shortenAddress";

const Transactions = () => {
  const { currentAccount } = useContext(MultiSigWalletContext);

  return (
    <div className="flex w-full justify-center items-center gradient-bg-transactions">
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        <div className="flex flex-col md:p-12 py-12 px-4">
          {currentAccount ? (
            <h3 className="text-white text-3xl text-center my-2">
              Latest Transactions
            </h3>
          ) : (
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account to see the latest transactions
            </h3>
          )}
        </div>


        <div className="flex-1 flex flex-col justify-start items-start">
          <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
            The best choice for buying and selling your crypto assets, with the
            various super friendly services we offer
          </p>
        </div>
        <h2 className="text-white">hello</h2>
      </div>
    </div>
  );
};

export default Transactions;
