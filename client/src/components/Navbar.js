import React from 'react'
import logo1 from "../images/logo1.png";

const Navbar = () => {
  return (
    <div className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center -mr-20">
        <a href='/'>
        <img src={logo1} alt="logo" className="w-36 cursor-pointer" />
        </a>
      </div>
      <h1 className="flex text-white justify-left -ml-20">The Multi-Signature Wallet Dapp </h1>
    </div>
  );
}

export default Navbar