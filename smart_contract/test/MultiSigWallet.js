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

  const submitTx = async () => {
    await walletInstance.submitTransaction(
      acc2.address,
      ethers.utils.parseEther("1.0"),
      0x00
    );
    const obj = await walletInstance.transactions(0);
    return obj;
  };

  // -----------------------------------------------------------------------

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

  // -----------------------------------------------------------------------

  describe("Deposit", () => {
    it("Should increment contract balance", async () => {
      const contractBalance1 = ethers.utils.formatEther(
        await ethers.provider.getBalance(walletInstance.address)
      );
      const etherSentToContract = "2.0";
      await acc1.sendTransaction({
        to: walletInstance.address,
        value: ethers.utils.parseEther(etherSentToContract),
      });

      const contractBalance2 = ethers.utils.formatEther(
        await ethers.provider.getBalance(walletInstance.address)
      );

      expect(parseInt(contractBalance2)).to.equal(
        parseInt(contractBalance1) + parseInt(etherSentToContract)
      );
    });

    it("Should emit sender address, amount, contract address balance", async () => {
      const etherSentToContract = ethers.utils.parseEther("2.0");

      const txHash = await acc1.sendTransaction({
        to: walletInstance.address,
        value: etherSentToContract,
      });

      const contractBalance1 = await ethers.provider.getBalance(
        walletInstance.address
      );

      await expect(txHash)
        .to.emit(walletInstance, "Deposit")
        .withArgs(acc1.address, etherSentToContract, contractBalance1);
    });
  });

  // -----------------------------------------------------------------------

  describe("Submit Transaction", () => {
    describe("Modifiers", () => {
      it("Should only be called by an Approver", async () => {
        await expect(
          walletInstance
            .connect(acc4)
            .submitTransaction(acc2.address, 123, 0x00)
        ).to.be.revertedWith("not an approver");
      });
    });

    describe("Function", () => {
      it("Should create a valid transaction", async () => {
        const obj = await submitTx();

        expect(obj.to).to.equal(acc2.address);
        expect(ethers.utils.formatEther(obj.amount)).to.equal("1.0");
        expect(obj.data).to.equal("0x00");
        expect(obj.isExecuted).to.equal(false);
        expect(parseInt(obj.numApprovals)).to.equal(0);
      });

      it("Should emit sender address, amount, contract address balance", async () => {
        await expect(
          walletInstance.submitTransaction(
            acc2.address,
            ethers.utils.parseEther("1.0"),
            0x00
          )
        )
          .to.emit(walletInstance, "SubmitTransaction")
          .withArgs(
            acc1.address,
            0,
            acc2.address,
            ethers.utils.parseEther("1.0"),
            ethers.utils.hexZeroPad(0, 1)
          );
      });
    });
  });

  // -----------------------------------------------------------------------

  describe("Approve Transaction", () => {
    describe("Modifiers", () => {
      it("Should only be called by an Approver", async () => {
        await expect(
          walletInstance.connect(acc4).approveTransaction(0)
        ).to.be.revertedWith("not an approver");
      });

      it("Should call an existing transaction", async () => {
        await submitTx();
        expect(walletInstance.transactions.length == 1);
      });

      it("Should not be executed", async () => {
        const obj1 = await submitTx();
        expect(obj1.isExecuted).to.equal(false);
      });

      it("Should not be already approved by sender", async () => {
        await submitTx();
        expect(await walletInstance.isApproved(0, acc1.address)).to.equal(
          false
        );
      });
    });

    describe("Function", () => {
      it("Should add sender's approval status", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        expect(await walletInstance.isApproved(0, acc1.address)).to.equal(true);
      });

      it("Should increment approval count by 1", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        const obj = await walletInstance.transactions(0);
        expect(obj.numApprovals).to.equal(1);
      });

      it("Should emit sender address and transaction index", async () => {
        await submitTx();

        await expect(walletInstance.approveTransaction(0))
          .to.emit(walletInstance, "ApproveTransaction")
          .withArgs(acc1.address, 0);
      });
    });
  });

  // -----------------------------------------------------------------------

  describe("Revoke Approval", () => {
    describe("Modifiers", () => {
      it("Should only be called by an Approver", async () => {
        await expect(
          walletInstance.connect(acc4).revokeApproval(0)
        ).to.be.revertedWith("not an approver");
      });

      it("Should call an existing transaction", async () => {
        await submitTx();
        expect(walletInstance.transactions.length == 1);
      });

      it("Should not be executed", async () => {
        const obj1 = await submitTx();
        expect(obj1.isExecuted).to.equal(false);
      });
    });

    describe("Function", () => {
      it("Should require sender to have previously approved", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        expect(await walletInstance.isApproved(0, acc1.address)).to.equal(true);
      });

      it("Should remove sender's approval status", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        await walletInstance.revokeApproval(0);
        expect(await walletInstance.isApproved(0, acc1.address)).to.equal(
          false
        );
      });

      it("Should decrement approval count by 1", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        const obj1 = await walletInstance.transactions(0);
        await walletInstance.revokeApproval(0);
        const obj2 = await walletInstance.transactions(0);
        expect(obj2.numApprovals).to.equal(obj1.numApprovals - 1);
      });

      it("Should emit sender address and transaction index", async () => {
        await submitTx();
        await await walletInstance.approveTransaction(0);

        await expect(walletInstance.revokeApproval(0))
          .to.emit(walletInstance, "RevokeApproval")
          .withArgs(acc1.address, 0);
      });
    });
  });

  // -----------------------------------------------------------------------

  describe("Execute Transaction", () => {
    describe("Modifiers", () => {
      it("Should only be called by an Approver", async () => {
        await expect(
          walletInstance.connect(acc4).executeTransaction(0)
        ).to.be.revertedWith("not an approver");
      });

      it("Should call an existing transaction", async () => {
        await submitTx();
        expect(walletInstance.transactions.length == 1);
      });

      it("Should not be executed", async () => {
        const obj = await submitTx();
        expect(obj.isExecuted).to.equal(false);
      });
    });

    describe("Function", () => {
      it("Should have equal to or more approvals than required", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        await walletInstance.connect(acc3).approveTransaction(0);

        const obj = await walletInstance.transactions(0);

        const approvalCount = parseInt(obj.numApprovals);
        const approvalsRequired = parseInt(
          await walletInstance.numApprovalsRequired()
        );

        expect(approvalCount).to.be.greaterThanOrEqual(approvalsRequired);
      });

      it("Should transfer less than contract balance", async () => {
        await submitTx();
        const obj = await walletInstance.transactions(0);

        await acc1.sendTransaction({
          to: walletInstance.address,
          value: ethers.utils.parseEther("2.0"),
        });

        const contractBalance = parseInt(
          ethers.utils.formatEther(
            await ethers.provider.getBalance(walletInstance.address)
          )
        );
        const txAmount = parseInt(ethers.utils.formatEther(obj.amount));
        expect(contractBalance).to.be.greaterThanOrEqual(txAmount);
      });

      it("Should send the amount to the specified address", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        await walletInstance.connect(acc3).approveTransaction(0);
        await acc1.sendTransaction({
          to: walletInstance.address,
          value: ethers.utils.parseEther("2.0"),
        });

        const acc2Balance1 = await parseInt(
          ethers.utils.formatEther(
            await ethers.provider.getBalance(acc2.address)
          )
        );

        await walletInstance.executeTransaction(0);

        const acc2Balance2 = await parseInt(
          ethers.utils.formatEther(
            await ethers.provider.getBalance(acc2.address)
          )
        );

        const obj = await walletInstance.transactions(0);
        // transaction's value to be set to zero
        expect(parseInt(ethers.utils.formatEther(obj.amount))).to.equal(0.0);
        // acc2 balance to increase by 1 eth
        expect(acc2Balance2).to.equal(acc2Balance1 + 1);
      });

      it("Should decrement contract balance by amount sent", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        await walletInstance.connect(acc3).approveTransaction(0);
        await acc1.sendTransaction({
          to: walletInstance.address,
          value: ethers.utils.parseEther("2.0"),
        });
        const contractBalance1 = parseInt(
          ethers.utils.formatEther(
            await ethers.provider.getBalance(walletInstance.address)
          )
        );

        await walletInstance.executeTransaction(0);

        const contractBalance2 = parseInt(
          ethers.utils.formatEther(
            await ethers.provider.getBalance(walletInstance.address)
          )
        );
        // contract balance to be decremented by 1 eth
        expect(contractBalance2).to.equal(contractBalance1 - 1);
      });

      it("Should set the transaction value to zero", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        await walletInstance.connect(acc3).approveTransaction(0);
        await acc1.sendTransaction({
          to: walletInstance.address,
          value: ethers.utils.parseEther("2.0"),
        });
        await walletInstance.executeTransaction(0);
        const obj = await walletInstance.transactions(0);
        // transaction's value to be set to zero
        expect(parseInt(ethers.utils.formatEther(obj.amount))).to.equal(0.0);
      });

      it("Should set the transaction to executed", async () => {
        await submitTx();
        await walletInstance.approveTransaction(0);
        await walletInstance.connect(acc3).approveTransaction(0);
        await acc1.sendTransaction({
          to: walletInstance.address,
          value: ethers.utils.parseEther("2.0"),
        });
        await walletInstance.executeTransaction(0);
        const obj = await walletInstance.transactions(0);
        // transaction's value to be set to zero
        expect(obj.isExecuted).to.equal(true);
      });

      it("Should emit sender address and transaction index", async () => {
        await submitTx();
        await await walletInstance.approveTransaction(0);
        await walletInstance.connect(acc3).approveTransaction(0);
        await acc1.sendTransaction({
          to: walletInstance.address,
          value: ethers.utils.parseEther("2.0"),
        });

        await expect(walletInstance.executeTransaction(0))
          .to.emit(walletInstance, "ExecuteTransaction")
          .withArgs(acc1.address, 0);
      });
    });
  });
  // -----------------------------------------------------------------------
});
