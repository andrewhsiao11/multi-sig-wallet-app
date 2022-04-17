import React, { useContext } from "react";
import { MultiSigWalletContext } from "../context/MultiSigWalletContext";

const Home = () => {

const { connectWallet, currentAccount } = useContext(MultiSigWalletContext);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      {!currentAccount && (
        <button type="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default Home