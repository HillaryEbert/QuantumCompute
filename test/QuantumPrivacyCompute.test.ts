import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("QuantumPrivacyCompute", function () {
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let quantumCompute: any;
  let contractAddress: string;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract
    const QuantumCompute = await ethers.getContractFactory("QuantumPrivacyCompute");
    quantumCompute = await QuantumCompute.deploy();
    await quantumCompute.waitForDeployment();
    contractAddress = await quantumCompute.getAddress();

    console.log(`Contract deployed to: ${contractAddress}`);
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(contractAddress).to.be.properAddress;
    });

    it("Should have a valid address", async function () {
      expect(await quantumCompute.getAddress()).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should initialize with zero state", async function () {
      // Test that initial state is empty for new users
      const stateInfo = await quantumCompute.getQuantumStateInfo(owner.address);
      expect(stateInfo.qubitCount).to.equal(0);
    });
  });

  describe("Quantum State Initialization", function () {
    it("Should initialize quantum state with valid parameters", async function () {
      const amplitudes = [128, 128, 0, 0, 0, 0, 0, 0]; // 2-qubit state
      const qubitCount = 2;

      const tx = await quantumCompute.initializeQuantumState(amplitudes, qubitCount);
      await tx.wait();

      const stateInfo = await quantumCompute.getQuantumStateInfo(owner.address);
      expect(stateInfo.qubitCount).to.equal(qubitCount);
    });

    it("Should reject invalid qubit count (zero)", async function () {
      const amplitudes = [255];
      const qubitCount = 0;

      await expect(
        quantumCompute.initializeQuantumState(amplitudes, qubitCount)
      ).to.be.revertedWith("Invalid qubit count");
    });

    it("Should reject invalid qubit count (too many)", async function () {
      const amplitudes = new Array(16).fill(64); // 4 qubits
      const qubitCount = 4;

      await expect(
        quantumCompute.initializeQuantumState(amplitudes, qubitCount)
      ).to.be.revertedWith("Too many qubits");
    });

    it("Should reject mismatched amplitude array size", async function () {
      const amplitudes = [128, 128]; // Only 2 amplitudes
      const qubitCount = 2; // But 2 qubits need 4 amplitudes

      await expect(
        quantumCompute.initializeQuantumState(amplitudes, qubitCount)
      ).to.be.revertedWith("Amplitude count mismatch");
    });

    it("Should allow different users to initialize separate states", async function () {
      const amplitudes1 = [255, 0, 0, 0];
      const amplitudes2 = [0, 255, 0, 0];

      await quantumCompute.connect(user1).initializeQuantumState(amplitudes1, 2);
      await quantumCompute.connect(user2).initializeQuantumState(amplitudes2, 2);

      const state1 = await quantumCompute.getQuantumStateInfo(user1.address);
      const state2 = await quantumCompute.getQuantumStateInfo(user2.address);

      expect(state1.qubitCount).to.equal(2);
      expect(state2.qubitCount).to.equal(2);
    });

    it("Should emit StateInitialized event", async function () {
      const amplitudes = [128, 128, 0, 0];

      await expect(quantumCompute.initializeQuantumState(amplitudes, 2))
        .to.emit(quantumCompute, "StateInitialized")
        .withArgs(owner.address, 2);
    });
  });

  describe("Quantum Job Submission", function () {
    beforeEach(async function () {
      // Initialize quantum state first
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 2);
    });

    it("Should submit quantum job successfully", async function () {
      const encryptedInput = 15; // Test input
      const algorithmType = 1; // Shor's algorithm

      const tx = await quantumCompute.submitQuantumJob(encryptedInput, algorithmType);
      const receipt = await tx.wait();

      expect(receipt).to.not.be.null;
    });

    it("Should return valid job ID", async function () {
      const tx = await quantumCompute.submitQuantumJob(15, 1);
      await tx.wait();

      const jobHistory = await quantumCompute.getUserJobHistory(owner.address);
      expect(jobHistory.length).to.be.greaterThan(0);
    });

    it("Should reject job without initialized state", async function () {
      await expect(
        quantumCompute.connect(user1).submitQuantumJob(15, 1)
      ).to.be.revertedWith("Quantum state not initialized");
    });

    it("Should reject invalid algorithm type", async function () {
      await expect(
        quantumCompute.submitQuantumJob(15, 99) // Invalid algorithm
      ).to.be.revertedWith("Invalid algorithm type");
    });

    it("Should emit JobSubmitted event", async function () {
      await expect(quantumCompute.submitQuantumJob(15, 1))
        .to.emit(quantumCompute, "JobSubmitted");
    });

    it("Should track multiple jobs for same user", async function () {
      await quantumCompute.submitQuantumJob(15, 1);
      await quantumCompute.submitQuantumJob(21, 2);
      await quantumCompute.submitQuantumJob(35, 1);

      const jobHistory = await quantumCompute.getUserJobHistory(owner.address);
      expect(jobHistory.length).to.equal(3);
    });
  });

  describe("Quantum Algorithm Execution", function () {
    let jobId: number;

    beforeEach(async function () {
      // Initialize state and submit job
      const amplitudes = [128, 128, 0, 0, 0, 0, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 3);

      const tx = await quantumCompute.submitQuantumJob(15, 1);
      await tx.wait();

      const jobHistory = await quantumCompute.getUserJobHistory(owner.address);
      jobId = Number(jobHistory[jobHistory.length - 1]);
    });

    it("Should execute quantum algorithm successfully", async function () {
      const tx = await quantumCompute.executeQuantumAlgorithm(jobId);
      await tx.wait();

      const jobInfo = await quantumCompute.getJobInfo(jobId);
      expect(jobInfo.isCompleted).to.be.true;
    });

    it("Should only allow job owner to execute", async function () {
      await expect(
        quantumCompute.connect(user1).executeQuantumAlgorithm(jobId)
      ).to.be.revertedWith("Not job owner");
    });

    it("Should reject execution of non-existent job", async function () {
      await expect(
        quantumCompute.executeQuantumAlgorithm(99999)
      ).to.be.revertedWith("Job does not exist");
    });

    it("Should reject duplicate execution", async function () {
      await quantumCompute.executeQuantumAlgorithm(jobId);

      await expect(
        quantumCompute.executeQuantumAlgorithm(jobId)
      ).to.be.revertedWith("Job already completed");
    });

    it("Should emit AlgorithmExecuted event", async function () {
      await expect(quantumCompute.executeQuantumAlgorithm(jobId))
        .to.emit(quantumCompute, "AlgorithmExecuted")
        .withArgs(jobId, owner.address);
    });

    it("Should record gas usage", async function () {
      const tx = await quantumCompute.executeQuantumAlgorithm(jobId);
      const receipt = await tx.wait();

      const jobInfo = await quantumCompute.getJobInfo(jobId);
      expect(jobInfo.gasUsed).to.be.greaterThan(0);
    });
  });

  describe("Quantum Circuit Compilation", function () {
    beforeEach(async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 2);
    });

    it("Should compile quantum circuit successfully", async function () {
      const circuitId = 1;
      const gateTypes = [1, 2, 3]; // H, CNOT, X
      const targetQubits = [0, 1, 0];
      const controlQubits = [0, 0, 0]; // 0 means no control

      const tx = await quantumCompute.compileQuantumCircuit(
        circuitId,
        gateTypes,
        targetQubits,
        controlQubits
      );
      await tx.wait();

      expect(tx).to.not.be.null;
    });

    it("Should reject mismatched gate array lengths", async function () {
      const circuitId = 1;
      const gateTypes = [1, 2];
      const targetQubits = [0, 1, 0]; // Different length
      const controlQubits = [0, 0];

      await expect(
        quantumCompute.compileQuantumCircuit(
          circuitId,
          gateTypes,
          targetQubits,
          controlQubits
        )
      ).to.be.revertedWith("Array length mismatch");
    });

    it("Should reject invalid gate types", async function () {
      const circuitId = 1;
      const gateTypes = [99]; // Invalid gate
      const targetQubits = [0];
      const controlQubits = [0];

      await expect(
        quantumCompute.compileQuantumCircuit(
          circuitId,
          gateTypes,
          targetQubits,
          controlQubits
        )
      ).to.be.revertedWith("Invalid gate type");
    });

    it("Should reject invalid qubit indices", async function () {
      const circuitId = 1;
      const gateTypes = [1];
      const targetQubits = [5]; // Out of range
      const controlQubits = [0];

      await expect(
        quantumCompute.compileQuantumCircuit(
          circuitId,
          gateTypes,
          targetQubits,
          controlQubits
        )
      ).to.be.revertedWith("Qubit index out of range");
    });

    it("Should emit CircuitCompiled event", async function () {
      const circuitId = 1;
      const gateTypes = [1];
      const targetQubits = [0];
      const controlQubits = [0];

      await expect(
        quantumCompute.compileQuantumCircuit(
          circuitId,
          gateTypes,
          targetQubits,
          controlQubits
        )
      ).to.emit(quantumCompute, "CircuitCompiled")
      .withArgs(circuitId, owner.address);
    });
  });

  describe("Quantum Entanglement", function () {
    beforeEach(async function () {
      // Both users initialize states
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.connect(user1).initializeQuantumState(amplitudes, 2);
      await quantumCompute.connect(user2).initializeQuantumState(amplitudes, 2);
    });

    it("Should create entanglement between two users", async function () {
      const tx = await quantumCompute.connect(user1).createEntanglement(user2.address);
      await tx.wait();

      const state1 = await quantumCompute.getQuantumStateInfo(user1.address);
      expect(state1.isEntangled).to.be.true;
    });

    it("Should reject self-entanglement", async function () {
      await expect(
        quantumCompute.connect(user1).createEntanglement(user1.address)
      ).to.be.revertedWith("Cannot entangle with self");
    });

    it("Should reject entanglement with uninitialized state", async function () {
      await expect(
        quantumCompute.connect(user1).createEntanglement(owner.address)
      ).to.be.revertedWith("Partner state not initialized");
    });

    it("Should emit EntanglementCreated event", async function () {
      await expect(quantumCompute.connect(user1).createEntanglement(user2.address))
        .to.emit(quantumCompute, "EntanglementCreated")
        .withArgs(user1.address, user2.address);
    });
  });

  describe("Query Functions", function () {
    it("Should return correct quantum state info", async function () {
      const amplitudes = [255, 0, 0, 0, 0, 0, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 3);

      const stateInfo = await quantumCompute.getQuantumStateInfo(owner.address);
      expect(stateInfo.qubitCount).to.equal(3);
      expect(stateInfo.timestamp).to.be.greaterThan(0);
    });

    it("Should return correct job info", async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 2);

      const tx = await quantumCompute.submitQuantumJob(15, 1);
      await tx.wait();

      const jobHistory = await quantumCompute.getUserJobHistory(owner.address);
      const jobId = Number(jobHistory[0]);

      const jobInfo = await quantumCompute.getJobInfo(jobId);
      expect(jobInfo.submitter).to.equal(owner.address);
      expect(jobInfo.algorithmType).to.equal(1);
      expect(jobInfo.isCompleted).to.be.false;
    });

    it("Should return user job history", async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 2);

      await quantumCompute.submitQuantumJob(15, 1);
      await quantumCompute.submitQuantumJob(21, 2);

      const jobHistory = await quantumCompute.getUserJobHistory(owner.address);
      expect(jobHistory.length).to.equal(2);
    });
  });

  describe("Gas Optimization Tests", function () {
    it("Should use reasonable gas for state initialization", async function () {
      const amplitudes = [128, 128, 0, 0];
      const tx = await quantumCompute.initializeQuantumState(amplitudes, 2);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lessThan(200000);
      console.log(`State initialization gas: ${receipt.gasUsed}`);
    });

    it("Should use reasonable gas for job submission", async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 2);

      const tx = await quantumCompute.submitQuantumJob(15, 1);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lessThan(150000);
      console.log(`Job submission gas: ${receipt.gasUsed}`);
    });

    it("Should use reasonable gas for algorithm execution", async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 2);

      await quantumCompute.submitQuantumJob(15, 1);
      const jobHistory = await quantumCompute.getUserJobHistory(owner.address);
      const jobId = Number(jobHistory[0]);

      const tx = await quantumCompute.executeQuantumAlgorithm(jobId);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lessThan(250000);
      console.log(`Algorithm execution gas: ${receipt.gasUsed}`);
    });
  });

  describe("Edge Cases and Security", function () {
    it("Should handle maximum amplitude values", async function () {
      const amplitudes = [255, 255, 255, 255];
      await quantumCompute.initializeQuantumState(amplitudes, 2);

      const stateInfo = await quantumCompute.getQuantumStateInfo(owner.address);
      expect(stateInfo.qubitCount).to.equal(2);
    });

    it("Should handle minimum amplitude values", async function () {
      const amplitudes = [0, 0, 0, 1]; // At least one non-zero
      await quantumCompute.initializeQuantumState(amplitudes, 2);

      const stateInfo = await quantumCompute.getQuantumStateInfo(owner.address);
      expect(stateInfo.qubitCount).to.equal(2);
    });

    it("Should handle rapid successive operations", async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 2);

      // Submit multiple jobs rapidly
      await quantumCompute.submitQuantumJob(15, 1);
      await quantumCompute.submitQuantumJob(21, 2);
      await quantumCompute.submitQuantumJob(35, 1);

      const jobHistory = await quantumCompute.getUserJobHistory(owner.address);
      expect(jobHistory.length).to.equal(3);
    });

    it("Should maintain state integrity across multiple operations", async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.initializeQuantumState(amplitudes, 2);

      const initialState = await quantumCompute.getQuantumStateInfo(owner.address);

      await quantumCompute.submitQuantumJob(15, 1);

      const afterJobState = await quantumCompute.getQuantumStateInfo(owner.address);

      expect(initialState.qubitCount).to.equal(afterJobState.qubitCount);
    });
  });
});
