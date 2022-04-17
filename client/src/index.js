import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { MultiSigWalletProvider } from './context/MultiSigWalletContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MultiSigWalletProvider>
      <App />
  </MultiSigWalletProvider>
);

