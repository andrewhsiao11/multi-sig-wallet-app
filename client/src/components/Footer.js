import React from "react";
import logo4 from "../images/logo4.png";

const Footer = () => {
  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
      <div className="flex flex-[0.5] justify-center items-center">
        <img src={logo4} alt="logo" className="w-32" />
      </div>

      <div className="flex justify-center items-center flex-col mt-5">
        <p className="text-white text-sm text-center">
          Welcome to the future of joint financial managment.
        </p>
        <p className="text-white underline text-sm text-center font-medium mt-2">
          <a href="/about">About this project</a>
        </p>
      </div>

      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className="text-white text-left text-xs">
          <a href="https://github.com/andrewhsiao11/multi-sig-wallet-app" className="hover:underline">
            @andrewhsiao11
          </a>
        </p>
        <p className="text-white text-right text-xs">
          All rights reserved - 2022
        </p>
      </div>
    </div>
  );
};

export default Footer;
