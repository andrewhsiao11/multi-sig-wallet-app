const { expect } = require("chai");

describe("MultiSigWallet Contract", function () {
  let WalletFactory;
  let walletInstance;
  let acc1;
  let acc2;
  let acc3;

  beforeEach(async () => {
    WalletFactory = await ethers.getContractFactory("MultiSigWallet");
    [acc1, acc2, acc3] = await ethers.getSigners();
    walletInstance = await WalletFactory.deploy(
      [acc1.address, acc2.address, acc3.address],
      2
    );
  });
  describe("Deployment", () => {
    it("Should return the proper approvers and approval count", async () => {
      const contractApprovers = await walletInstance.getApprovers();
      const accounts = [acc1.address, acc2.address, acc3.address];
      for (let i = 0; i < contractApprovers.length; i++) {
        expect(contractApprovers[i]).to.equal(accounts[i]);
      }
      expect(await walletInstance.numApprovalsRequired()).to.equal(2);
    });
  });

  describe("Deposit", () => {
    it("Should be the same as contract balance", async () => {
      await acc1.sendTransaction({
        to: walletInstance.address,
        value: ethers.utils.parseEther("2.0"),
      });

      const contractBalance = await ethers.provider.getBalance(
        walletInstance.address
      );

      expect(ethers.utils.formatEther(contractBalance)).to.equal("2.0");
    });
  });

  describe("Submit Transaction", () => { 
    it("Should create a transaction", async () => { 

     });

   });

   describe("ApproveTransaction", () => {
     it("Should ...", async () => {});
   });
   
   describe("Revoke Transaction", () => {
     it("Should ...", async () => {});
   });

   describe("Execute Transaction", () => {
     it("Should ...", async () => {});
   });
});
