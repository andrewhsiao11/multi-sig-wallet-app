import './App.css';

import {MultiSigWalletContext} from './context/MultiSigWalletContext'
import React, {useContext} from 'react'

function App() {

const {connectWallet, currentAccount} = useContext(MultiSigWalletContext)


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        
        {!currentAccount && (
        <button 
        type='button'
        onClick={connectWallet}
        > Connect Wallet</button>) }


      </header>
    </div>
  );
}

export default App;
