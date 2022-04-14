const hre = require("hardhat");
const main = async () => {
  const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
  // initializing with 3 metamask accounts needing 2/3 for approval
  const multiSigWallet = await MultiSigWallet.deploy(
    [
      "0x093Ed1B4028a4AcDD3E7FEFAA8c658a8601812dc",
      "0x2d05BF7e0f0BE03bA852B9A758FF1D9c2Dd7E26a",
      "0x84E399dbaF0b7D6dF49950C3a63879697E215a36",
    ],
    2
  );

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
