import './App.css';

import {MultiSigWalletContext} from './context/MultiSigWalletContext'
import React, {useContext} from 'react'

const App = () => {

const {connectWallet, currentAccount} = useContext(MultiSigWalletContext)


  return (
    <div className="App">
      <header className="App-header">

        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        {!currentAccount && (
          <button type="button" onClick={connectWallet}>
            {" "}
            Connect Wallet
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
