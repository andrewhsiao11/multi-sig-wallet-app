import React from "react";
import { SiEthereum } from "react-icons/si";

const About = () => {
  return (
    <>
      <div className="flex w-full items-center gradient-bg-home">
        <div className="flex mf:flex-row  items-start justify-between md:p-10 py-12 px-4">
          <div className="flex flex-1 justify-start ml-20 mt-10 items-start flex-col mf:mr-10">
            <h1 className="text-3xl sm:text-5xl text-white py-1 flex">
              <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center mt-1 mr-4">
                <SiEthereum fontSize={21} color="#fff" />
              </div>
              About this project
            </h1>
            <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
              &emsp; A full stack web 3.0 app (i.e. a decentralized application
              - Dapp) based around the concept of a multi-signature wallet.
              Multi-signature wallets are a type of cryptocurrency wallet that
              require more than one digital signature in order to initiate a
              transaction on the blockchain.
              <br />
              &emsp; For example, if user A wants to send money to user B, user
              A would need another user, say user C, to also sign the
              transaction in order to send the funds to user B. This provides
              another layer of security by reducing dependency on a single user
              who could potentially lose their private key (the only way of
              signing a transaction) or have it stolen.{" "}
              <a
                href="https://ropsten.etherscan.io/address/0xbfda2bb458160fd07ff241ee9c5220bd228a01ad"
                target="_blank"
                rel="noreferrer"
                className="text-blue-300 dark:text-blue-300  hover:underline"
              >
                View the multi-signature wallet smart contract on etherscan
              </a>
              .
              <br />
              <br />
              • A potential use-case could be in a business setting where a
              multi-signature wallet can be used to control access to the
              company’s funds.
              <br />
              • Another use-case, could be seen in escrow transactions which
              could be fully facilitated through a multi-sig wallet (eliminating
              any middle-men and the fees that come with them).
              <br />• Another... a family/couple/group with shared wealth could
              create a multi-sig wallet that requires both or a certain number
              of signatures in order to fulfil an expensive purchase.
            </p>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="flex w-full justify-center items-center gradient-bg-approvers">
        <div className="flex mf:flex-row flex-col items-center justify-between py-12 px-4 mt-20 ">
          <p className="text-left mt-20 -mb-10 text-white font-light text-base">
            Created by{" "}
            <a
              href="https://github.com/andrewhsiao11/multi-sig-wallet-app"
              target="_blank"
              rel="noreferrer"
              className="text-blue-300 dark:text-blue-300  hover:underline"
            >
              @andrewhsiao11
            </a>
            .
          </p>
        </div>
      </div>
      {/*  */}
      <div className="flex w-full justify-center items-center gradient-bg-transactions">
        <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
          <p className="text-left invisible mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            ...
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
