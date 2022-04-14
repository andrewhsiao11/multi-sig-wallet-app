const { expect } = require("chai");

describe("MultiSigWallet Contract", function () {
  let WalletFactory;
  let walletInstance;
  let acc1;
  let acc2;
  let acc3;
  let acc4;

  beforeEach(async () => {
    WalletFactory = await ethers.getContractFactory("MultiSigWallet");
    [acc1, acc2, acc3, acc4] = await ethers.getSigners();
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
    it("Should only be called by an Approver", async () => {
      await expect(
        walletInstance.connect(acc4).submitTransaction(acc2.address, 123, 0x00)
      ).to.be.revertedWith("not an approver");
    });

    it("Should create a transaction", async () => {
      await walletInstance.submitTransaction(
        acc2.address,
        ethers.utils.parseEther("1.0"),
        0x00
      );

      const obj = await walletInstance.transactions(0);

      expect(obj.to).to.equal(acc2.address);
      expect(ethers.utils.formatEther(obj.amount)).to.equal("1.0");
    });
  });

  // describe("Approve Transaction", () => {
  //   it("Should only be called by an Approver", async () => {});

  //   it("Should call an existing transaction", async () => {});

  //   it("Should not be executed", async () => {});

  //   it("Should not be approved", async () => {});

  //   it("Should increment approval count by 1", async () => {});
  // });

  // describe("Revoke Transaction", () => {
  //   it("Should only be called by an Approver", async () => {});

  //   it("Should call an existing transaction", async () => {});

  //   it("Should not be executed", async () => {});

  //   it("Should ...", async () => {});
  // });

  // describe("Execute Transaction", () => {
  //   it("Should only be called by an Approver", async () => {});

  //   it("Should call an existing transaction", async () => {});

  //   it("Should not be executed", async () => {});

  //   it("Should ...", async () => {});
  // });
});
