# ARKETA - Web 3.0 Multi-Signature Wallet Blockchain Application

<img width="1406" alt="multiSigDapp_img1" src="https://user-images.githubusercontent.com/90870850/164552760-352d2a03-b582-4d55-b207-2a62ffaf53d9.png">
<img width="1328" alt="multiSigDapp_img2" src="https://user-images.githubusercontent.com/90870850/164552772-47be5baa-1161-46d8-b146-fb4040264bf3.png">

## About this project
 A full stack web 3.0 app (i.e. a decentralized application - Dapp) based around the concept of a multi-signature wallet. Multi-signature wallets are a type of cryptocurrency wallet that require more than one digital signature in order to initiate a transaction on the blockchain.
 
 For example, if user A wants to send money to user B, user A would need another user, say user C, to also sign the transaction in order to send the funds to user B. This provides another layer of security by reducing dependency on a single user who could potentially lose their private key (the only way of signing a transaction) or have it stolen. 
 
### Potential Use-Cases:
* In a business setting where a multi-signature wallet can be used to control access to the company’s funds.
* In escrow transactions which could be fully facilitated through a multi-sig wallet (eliminating any middle-men and the fees that come with them).
* A family/couple/group with shared wealth could create a multi-sig wallet that requires both or a certain number of signatures in order to fulfil an expensive purchase.


## Features

* Smart contract written in Solidity
* Hardhat development environment for testing, compiling, and deploying smart contract
* Unit Tests using Mocha, Chai, and Hardhat-waffle
* Contract deployed to the Ropsten Test Network via Alchemy - [view on Etherscan](https://ropsten.etherscan.io/address/0xbfda2bb458160fd07ff241ee9c5220bd228a01ad).
* MetaMask account interaction
* Functionality to send Ether to smart contract and send Ether to accounts from smart contract
* Smart contract has built in functionality to interact with other smart contracts (not implemented in UI)
* React for frontend
* Tailwind CSS framework for styling

## Project Architecture

A fully functioning autonomous decentralized application that implements the core concepts of a multi-signature wallet where a select number of account owners, we’ll call them approvers, are in charge of managing transactions. Upon deploying the smart contract, its constructor will be called, and a pre-set number of accounts will be designated as approvers as well as a target number of approvals a transaction must have before being able to be executed. For example, I will deploy the smart contract with 3 accounts and set the number of approvals required to 2 – this means that at least 2 approvals are necessary for a transaction to be executed.

The select approvers will have the sole power to create transactions by specifying who they would like to send funds to and how much Ether (the digit currency of the Ethereum blockchain) they would like to send. These transactions can be a transfer of monetary funds to any account or can call upon and initiate another smart contract (this second part’s functionality is coded into my smart contract but not implemented in the UI). Once a transaction is submitted by an approver, it will be stored on the smart contract. Any number of transactions can be submitted to the smart contract. An approver can “approve” a transaction, incrementing the number of approvals it has. Additionally, an approver can remove their approval from the transaction, thereby decrementing its approval count. Once a transaction’s number of approvals has reached the number of required approvals (2 in my example), any approver will be able to execute the transaction. However, executing transactions costs Ether AND if the transaction is sending Ether to someone, there has to be money available for the smart contract to send along. The solution...smart contracts can receive, store, and send Ether. So, in order for an adequately approved transaction to be executed, the smart contract must be sent enough Ether beforehand. Finally, once an approver (or anyone else) has sent the smart contract enough Ether and the transaction has enough approvals, it can be executed.

My UI will allow users with a MetaMask wallet to connect (“login”) and interact with the application. Pre-determined approvers will be able to create, approve, revoke, and execute transactions. The pending transactions (with metrics detailing their approval count) as well as executed transactions will be available to view. Users will be able to visit their own profile page, allowing them to interact with the smart contract through approvals, revoking approvals, and executing transactions.


## Getting Started <a name = "getting_started"></a>

### Install dependencies

```bash
npm install
```

### Run app 

-- **Connect MetaMask wallet to Ropsten Test Network** --

In client folder
```bash
npm start 
```

For Unit Testing
```bash
cd smart_contract
npx hardhat test
```
