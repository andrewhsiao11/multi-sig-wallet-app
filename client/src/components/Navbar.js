import React from 'react'
import logo4 from "../images/logo4.png";

const Navbar = () => {
  return (
    <div className="w-full flex md:justify-center justify-center items-center p-4">
      <div className="mr-20 flex-initial justify-center items-center ">
        <a href='/'>
        <img src={logo4} alt="logo" className="w-36 cursor-pointer" />
        </a>
      </div>
      <h1 className="text-white mt-2 -ml-14">  The Multi-Signature Wallet Dapp </h1>
    </div>
  );
}

export default Navbar