import React, { useContext, useState } from "react";
import { MultiSigWalletContext } from "../context/MultiSigWalletContext";
import { shortenAddress } from "../utils/shortenAddress";


const TransactionRow = (props) => {
const [ addressLength, setAddressLength] = useState(false);

  return (
    <>
      {props.transaction?.isExecuted ? (
        <tr className="bg-white border-b dark:bg-green-400 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-green-200">
          <td
            scope="row"
            className="px-6 py-4 text-gray-900 dark:text-grey-900"
          >
            {props.idx}
          </td>
          <td className="px-6 py-4 text-gray-900 dark:text-grey-900">
            <span onClick={() => setAddressLength(!addressLength)}>
              {addressLength
                ? props.transaction?.addressTo
                : shortenAddress(props.transaction?.addressTo)}
            </span>
          </td>
          <td className="px-6 py-4 text-gray-900 dark:text-grey-900">
            {props.transaction?.amount}
          </td>
          <td className="px-6 py-4 text-gray-900 dark:text-grey-900">
            {props.transaction?.numApprovals}
          </td>
          <td className="px-6 py-4 text-gray-900 dark:text-grey-900">
            {props.transaction?.isExecuted ? "Yes!" : "Not yet"}
          </td>
          <td className="px-6 py-4 text-right">
            <a
              href={`https://ropsten.etherscan.io/tx/${props.transaction?.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-700 dark:text-blue-700 hover:underline"
            >
              View on Etherscan
            </a>
          </td>
        </tr>
      ) : (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" className="px-6 py-4">
            {props.idx}
          </th>
          <td className="px-6 py-4">
            <span onClick={() => setAddressLength(!addressLength)}>
              {addressLength
                ? props.transaction?.addressTo
                : shortenAddress(props.transaction?.addressTo)}
            </span>
          </td>
          <td className="px-6 py-4">{props.transaction?.amount}</td>
          <td className="px-6 py-4">{props.transaction?.numApprovals}</td>
          <td className="px-6 py-4">
            {props.transaction?.isExecuted ? "Yes!" : "Not yet"}
          </td>
          <td className="px-6 py-4 text-right">
            <a
              href={`https://ropsten.etherscan.io/tx/${props.transaction?.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              View on Etherscan
            </a>
          </td>
        </tr>
      )}
    </>
  );
}

const Transactions = () => {
  const { currentAccount, transactionArray} = useContext(MultiSigWalletContext);

  return (
    <div className="flex w-full justify-center items-center gradient-bg-transactions">
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        <div className="flex flex-col md:p-12 py-12 px-4">
          {currentAccount ? (
            <>
              <h3 className="text-white text-3xl text-center my-2 mb-6">
                Latest Transactions
              </h3>
              {/* table */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Transaction Index
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Address To (click to expand)
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount (ETH)
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Number of Approvals
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Is Executed?
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionArray ? (
                      transactionArray.map((transaction, idx) => {
                        return (
                          <TransactionRow
                            key={idx}
                            idx={idx}
                            transaction={transaction}
                          />
                        );
                      })
                    ) : (
                      <tr>
                        <th>Loading Transactions</th>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* table 2  below?*/}
            </>
          ) : (
            <h3 className="text-white text-3xl text-center -mt-20">
              Connect your account to see the latest transactions
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
