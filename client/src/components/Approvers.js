import React, { useContext } from "react";
import { MultiSigWalletContext } from "../context/MultiSigWalletContext";
import approval_icon from "../images/approval_icon.png";
import approver_mask from "../images/approver_mask.png";
import approver_walterWhite from "../images/approver_walterWhite.png";
import approver_mando from "../images/approver_mando.png";

const Approvers = () => {
  const { currentAccount, transactionCount, approvers } = useContext(MultiSigWalletContext);

  
  
  return (
    <>
      <div className="flex w-full justify-center items-center gradient-bg-approvers">
        <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
    {currentAccount && 
          <div className="lg:flex items-center justify-center w-full">
            <div className="lg:w-full lg:mb-0 mb-4 blue-glass p-6">
              <div className="flex items-center border-b border-gray-400 pb-4">
                <div className="flex items-start justify-between w-full">
                  <img src={approval_icon} className="w-10 h-10 rounded-full" />
                  <div className="ml-1 w-1/2  mt-2 mr-10">
                    <p className="text-xl font-medium leading-5 text-gray-200 ml-1 mr-10">
                      Approvers
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 w-1/2 mt-2">
                    Approvals required: 2
                  </p>
                </div>
              </div>
              <div className="px-2 flex mt-2 mr-3 -ml-2">
                <img src={approver_mando} className="w-12 h-12 rounded-full" />
                <p className="text-sm leading-5 ml-2 mt-3 text-gray-300">
                  {approvers[0]}
                </p>
              </div>
              <div className="px-2 flex mt-2 mr-3 -ml-2">
                <img src={approver_mask} className="w-12 h-12 rounded-full" />
                <p className="text-sm leading-5 ml-2 mt-3 text-gray-300">
                  {approvers[1]}
                </p>
              </div>
              <div className="px-2 flex mt-2 mr-3 -ml-2">
                <img
                  src={approver_walterWhite}
                  className="w-12 h-12 rounded-full"
                />
                <p className="text-sm leading-5 ml-2 mt-3 text-gray-300">
                  {approvers[2]}
                </p>
              </div>
            </div>

            <div className="lg:w-3/5 blue-glass p-6 ml-20">
              <div className="ml-4 mt-4 mb-4 flex">
                <h1 className="text-xl font-medium mt-9 mb-9 ml-2 text-gray-200">
                  Transaction Count
                  <br />
                  <br />
                  <p className="justify-center flex text-6xl">
                    {transactionCount}
                  </p>
                </h1>
              </div>
            </div>
          </div>
}
        </div>
      </div>
    </>
  );
};

export default Approvers;
