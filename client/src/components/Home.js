import React, { useContext } from "react";
import { MultiSigWalletContext } from "../context/MultiSigWalletContext";
import { Transactions } from "../components";

const Home = () => {

const { connectWallet, currentAccount } = useContext(MultiSigWalletContext);

  return (
    <div className="gradient-bg-home">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      {!currentAccount && (
        <button type="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      <Transactions />
    </div>
  );
}

export default Home