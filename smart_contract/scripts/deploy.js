const hre = require("hardhat");
const main = async () => {
  const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy();

  await multiSigWallet.deployed();
  console.log("MultiSigWallet deployed to: ", multiSigWallet.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
