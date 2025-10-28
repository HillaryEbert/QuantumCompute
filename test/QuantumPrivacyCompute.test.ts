import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { QuantumPrivacyCompute } from "../typechain-types";

describe("QuantumPrivacyCompute", function () {
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let quantumCompute: QuantumPrivacyCompute;
  let contractAddress: string;

  async function deployFixture() {
    const [dep, al, bo, ca] = await ethers.getSigners();

    const QuantumCompute = await ethers.getContractFactory("QuantumPrivacyCompute");
    const contract = await QuantumCompute.deploy();
    await contract.waitForDeployment();
    const address = await contract.getAddress();

    return { contract, address, deployer: dep, alice: al, bob: bo, carol: ca };
  }

  beforeEach(async function () {
    const fixture = await deployFixture();
    quantumCompute = fixture.contract;
    contractAddress = fixture.address;
    deployer = fixture.deployer;
    alice = fixture.alice;
    bob = fixture.bob;
    carol = fixture.carol;
  });

  describe("Deployment and Initialization", function () {
    it("Should deploy successfully with valid address", async function () {
      expect(contractAddress).to.be.properAddress;
      expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should set deployer as owner", async function () {
      const owner = await quantumCompute.owner();
      expect(owner).to.equal(deployer.address);
    });

    it("Should initialize computeJobCounter to 1", async function () {
      const counter = await quantumCompute.computeJobCounter();
      expect(counter).to.equal(1);
    });

    it("Should set correct MAX_QUBITS constant", async function () {
      const maxQubits = await quantumCompute.MAX_QUBITS();
      expect(maxQubits).to.equal(32);
    });

    it("Should authorize deployer as compute node", async function () {
      const isAuthorized = await quantumCompute.authorizedNodes(deployer.address);
      expect(isAuthorized).to.be.true;
    });

    it("Should have zero quantum state for new users", async function () {
      const stateInfo = await quantumCompute.getQuantumStateInfo(alice.address);
      expect(stateInfo.qubitCount).to.equal(0);
      expect(stateInfo.isEntangled).to.be.false;
      expect(stateInfo.timestamp).to.equal(0);
    });
  });

  describe("Quantum State Initialization", function () {
    it("Should initialize quantum state with 2 qubits", async function () {
      const amplitudes = [128, 128, 0, 0]; // 4 amplitudes for 2 qubits
      const qubitCount = 2;

      const tx = await quantumCompute.connect(alice).initializeQuantumState(amplitudes, qubitCount);
      await tx.wait();

      const stateInfo = await quantumCompute.getQuantumStateInfo(alice.address);
      expect(stateInfo.qubitCount).to.equal(qubitCount);
      expect(stateInfo.isEntangled).to.be.false;
      expect(stateInfo.timestamp).to.be.greaterThan(0);
    });

    it("Should initialize quantum state with maximum supported qubits (8)", async function () {
      const amplitudes = new Array(256).fill(1); // 256 amplitudes for 8 qubits
      const qubitCount = 8;

      const tx = await quantumCompute.connect(alice).initializeQuantumState(amplitudes, qubitCount);
      await tx.wait();

      const stateInfo = await quantumCompute.getQuantumStateInfo(alice.address);
      expect(stateInfo.qubitCount).to.equal(qubitCount);
    });

    it("Should reject initialization with more than 8 qubits", async function () {
      const amplitudes = new Array(512).fill(1); // 512 amplitudes for 9 qubits
      const qubitCount = 9;

      await expect(
        quantumCompute.connect(alice).initializeQuantumState(amplitudes, qubitCount)
      ).to.be.revertedWith("Max 8 qubits supported");
    });

    it("Should reject initialization with invalid amplitude array size", async function () {
      const amplitudes = [128, 128]; // Only 2 amplitudes
      const qubitCount = 2; // But 2 qubits need 4 amplitudes

      await expect(
        quantumCompute.connect(alice).initializeQuantumState(amplitudes, qubitCount)
      ).to.be.revertedWith("Invalid amplitude array size");
    });

    it("Should allow re-initialization of quantum state", async function () {
      const amplitudes1 = [255, 0, 0, 0];
      await quantumCompute.connect(alice).initializeQuantumState(amplitudes1, 2);

      const amplitudes2 = [128, 128, 0, 0];
      await quantumCompute.connect(alice).initializeQuantumState(amplitudes2, 2);

      const stateInfo = await quantumCompute.getQuantumStateInfo(alice.address);
      expect(stateInfo.qubitCount).to.equal(2);
    });

    it("Should emit QuantumStateInitialized event", async function () {
      const amplitudes = [128, 128, 0, 0];
      const qubitCount = 2;

      await expect(quantumCompute.connect(alice).initializeQuantumState(amplitudes, qubitCount))
        .to.emit(quantumCompute, "QuantumStateInitialized")
        .withArgs(alice.address, qubitCount);
    });

    it("Should allow different users to have independent states", async function () {
      const amplitudes1 = [255, 0, 0, 0];
      const amplitudes2 = [0, 255, 0, 0];

      await quantumCompute.connect(alice).initializeQuantumState(amplitudes1, 2);
      await quantumCompute.connect(bob).initializeQuantumState(amplitudes2, 2);

      const state1 = await quantumCompute.getQuantumStateInfo(alice.address);
      const state2 = await quantumCompute.getQuantumStateInfo(bob.address);

      expect(state1.qubitCount).to.equal(2);
      expect(state2.qubitCount).to.equal(2);
    });
  });

  describe("Quantum Job Submission", function () {
    it("Should submit Shor's algorithm job successfully", async function () {
      const encryptedInput = 15;
      const algorithmType = 0; // Shor's algorithm

      const tx = await quantumCompute.connect(alice).submitQuantumJob(encryptedInput, algorithmType);
      const receipt = await tx.wait();

      expect(receipt).to.not.be.null;
    });

    it("Should submit all algorithm types successfully", async function () {
      const algorithms = [
        { type: 0, name: "Shor" },
        { type: 1, name: "Grover" },
        { type: 2, name: "VQE" },
        { type: 3, name: "QAOA" },
        { type: 4, name: "Quantum ML" },
        { type: 5, name: "Custom" }
      ];

      for (const algo of algorithms) {
        const tx = await quantumCompute.connect(alice).submitQuantumJob(100, algo.type);
        await tx.wait();
      }

      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      expect(jobHistory.length).to.equal(6);
    });

    it("Should return incrementing job IDs", async function () {
      await quantumCompute.connect(alice).submitQuantumJob(10, 0);
      await quantumCompute.connect(alice).submitQuantumJob(20, 1);
      await quantumCompute.connect(alice).submitQuantumJob(30, 2);

      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      expect(jobHistory[0]).to.be.lessThan(jobHistory[1]);
      expect(jobHistory[1]).to.be.lessThan(jobHistory[2]);
    });

    it("Should reject invalid algorithm type", async function () {
      const encryptedInput = 15;
      const algorithmType = 6; // Invalid - only 0-5 supported

      await expect(
        quantumCompute.connect(alice).submitQuantumJob(encryptedInput, algorithmType)
      ).to.be.revertedWith("Invalid algorithm type");
    });

    it("Should emit QuantumJobSubmitted event", async function () {
      const encryptedInput = 15;
      const algorithmType = 1;

      await expect(quantumCompute.connect(alice).submitQuantumJob(encryptedInput, algorithmType))
        .to.emit(quantumCompute, "QuantumJobSubmitted");
    });

    it("Should track job history for multiple users", async function () {
      await quantumCompute.connect(alice).submitQuantumJob(10, 0);
      await quantumCompute.connect(alice).submitQuantumJob(20, 1);
      await quantumCompute.connect(bob).submitQuantumJob(30, 2);

      const aliceHistory = await quantumCompute.getUserJobHistory(alice.address);
      const bobHistory = await quantumCompute.getUserJobHistory(bob.address);

      expect(aliceHistory.length).to.equal(2);
      expect(bobHistory.length).to.equal(1);
    });

    it("Should store correct job information", async function () {
      const tx = await quantumCompute.connect(alice).submitQuantumJob(42, 2);
      await tx.wait();

      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      const jobId = jobHistory[0];
      const jobInfo = await quantumCompute.getJobInfo(jobId);

      expect(jobInfo.submitter).to.equal(alice.address);
      expect(jobInfo.algorithmType).to.equal(2);
      expect(jobInfo.isCompleted).to.be.false;
      expect(jobInfo.isVerified).to.be.false;
      expect(jobInfo.submitTime).to.be.greaterThan(0);
    });
  });

  describe("Quantum Algorithm Execution", function () {
    let jobId: bigint;

    beforeEach(async function () {
      const tx = await quantumCompute.connect(alice).submitQuantumJob(100, 0);
      await tx.wait();

      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      jobId = jobHistory[jobHistory.length - 1];
    });

    it("Should execute quantum algorithm as authorized node", async function () {
      const tx = await quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId);
      await tx.wait();

      const jobInfo = await quantumCompute.getJobInfo(jobId);
      expect(jobInfo.isCompleted).to.be.true;
    });

    it("Should reject execution by unauthorized node", async function () {
      await expect(
        quantumCompute.connect(bob).executeQuantumAlgorithm(jobId)
      ).to.be.revertedWith("Not authorized compute node");
    });

    it("Should reject execution of non-existent job", async function () {
      await expect(
        quantumCompute.connect(deployer).executeQuantumAlgorithm(99999)
      ).to.be.revertedWith("Job does not exist");
    });

    it("Should reject duplicate execution", async function () {
      await quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId);

      await expect(
        quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId)
      ).to.be.revertedWith("Job already completed");
    });

    it("Should emit QuantumJobCompleted event", async function () {
      await expect(quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId))
        .to.emit(quantumCompute, "QuantumJobCompleted")
        .withArgs(jobId, alice.address);
    });

    it("Should record gas usage", async function () {
      await quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId);

      const jobInfo = await quantumCompute.getJobInfo(jobId);
      expect(jobInfo.gasUsed).to.be.greaterThan(0);
    });

    it("Should set completion time", async function () {
      await quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId);

      const jobInfo = await quantumCompute.getJobInfo(jobId);
      expect(jobInfo.completeTime).to.be.greaterThan(0);
      expect(jobInfo.completeTime).to.be.greaterThan(jobInfo.submitTime);
    });
  });

  describe("Quantum Circuit Compilation", function () {
    it("Should compile simple quantum circuit", async function () {
      const circuitId = 1;
      const gateTypes = [0, 1, 2]; // H, CNOT, X
      const targetQubits = [0, 1, 0];
      const controlQubits = [0, 0, 0];

      const tx = await quantumCompute.connect(alice).compileQuantumCircuit(
        circuitId,
        gateTypes,
        targetQubits,
        controlQubits
      );
      await tx.wait();

      const circuitInfo = await quantumCompute.getCircuitInfo(circuitId);
      expect(circuitInfo.isCompiled).to.be.true;
      expect(circuitInfo.depth).to.equal(3);
    });

    it("Should compile complex quantum circuit", async function () {
      const circuitId = 2;
      const gateTypes = [0, 1, 2, 3, 4]; // All gate types
      const targetQubits = [0, 1, 0, 1, 0];
      const controlQubits = [0, 0, 0, 0, 0];

      await quantumCompute.connect(alice).compileQuantumCircuit(
        circuitId,
        gateTypes,
        targetQubits,
        controlQubits
      );

      const circuitInfo = await quantumCompute.getCircuitInfo(circuitId);
      expect(circuitInfo.gateTypes.length).to.equal(5);
      expect(circuitInfo.depth).to.equal(5);
    });

    it("Should reject mismatched array lengths", async function () {
      const circuitId = 1;
      const gateTypes = [0, 1];
      const targetQubits = [0, 1, 2]; // Different length
      const controlQubits = [0, 0];

      await expect(
        quantumCompute.connect(alice).compileQuantumCircuit(
          circuitId,
          gateTypes,
          targetQubits,
          controlQubits
        )
      ).to.be.revertedWith("Mismatched array lengths");
    });

    it("Should emit CircuitCompiled event", async function () {
      const circuitId = 1;
      const gateTypes = [0];
      const targetQubits = [0];
      const controlQubits = [0];

      await expect(
        quantumCompute.connect(alice).compileQuantumCircuit(
          circuitId,
          gateTypes,
          targetQubits,
          controlQubits
        )
      ).to.emit(quantumCompute, "CircuitCompiled")
        .withArgs(circuitId, 1);
    });

    it("Should allow overwriting existing circuit", async function () {
      const circuitId = 1;
      const gateTypes1 = [0, 1];
      const gateTypes2 = [2, 3, 4];
      const targetQubits1 = [0, 1];
      const targetQubits2 = [0, 1, 0];
      const controlQubits1 = [0, 0];
      const controlQubits2 = [0, 0, 0];

      await quantumCompute.compileQuantumCircuit(circuitId, gateTypes1, targetQubits1, controlQubits1);
      await quantumCompute.compileQuantumCircuit(circuitId, gateTypes2, targetQubits2, controlQubits2);

      const circuitInfo = await quantumCompute.getCircuitInfo(circuitId);
      expect(circuitInfo.depth).to.equal(3);
    });
  });

  describe("Quantum Entanglement", function () {
    beforeEach(async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.connect(alice).initializeQuantumState(amplitudes, 2);
      await quantumCompute.connect(bob).initializeQuantumState(amplitudes, 2);
    });

    it("Should create entanglement between two users", async function () {
      const tx = await quantumCompute.connect(alice).createEntanglement(bob.address);
      await tx.wait();

      const state1 = await quantumCompute.getQuantumStateInfo(alice.address);
      const state2 = await quantumCompute.getQuantumStateInfo(bob.address);

      expect(state1.isEntangled).to.be.true;
      expect(state2.isEntangled).to.be.true;
    });

    it("Should reject entanglement without initialized state", async function () {
      await expect(
        quantumCompute.connect(carol).createEntanglement(alice.address)
      ).to.be.revertedWith("Initialize quantum state first");
    });

    it("Should reject entanglement with uninitialized partner", async function () {
      await expect(
        quantumCompute.connect(alice).createEntanglement(carol.address)
      ).to.be.revertedWith("Partner must have quantum state");
    });

    it("Should emit EntanglementCreated event", async function () {
      await expect(quantumCompute.connect(alice).createEntanglement(bob.address))
        .to.emit(quantumCompute, "EntanglementCreated")
        .withArgs(alice.address, bob.address);
    });
  });

  describe("Access Control and Authorization", function () {
    it("Should allow owner to authorize new compute node", async function () {
      const tx = await quantumCompute.connect(deployer).authorizeNode(alice.address);
      await tx.wait();

      const isAuthorized = await quantumCompute.authorizedNodes(alice.address);
      expect(isAuthorized).to.be.true;
    });

    it("Should reject node authorization by non-owner", async function () {
      await expect(
        quantumCompute.connect(alice).authorizeNode(bob.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should allow owner to revoke node authorization", async function () {
      await quantumCompute.connect(deployer).authorizeNode(alice.address);
      await quantumCompute.connect(deployer).revokeNodeAuthorization(alice.address);

      const isAuthorized = await quantumCompute.authorizedNodes(alice.address);
      expect(isAuthorized).to.be.false;
    });

    it("Should emit NodeAuthorized event", async function () {
      await expect(quantumCompute.connect(deployer).authorizeNode(alice.address))
        .to.emit(quantumCompute, "NodeAuthorized")
        .withArgs(alice.address);
    });
  });

  describe("View Functions", function () {
    it("Should return correct quantum state info", async function () {
      const amplitudes = [255, 0, 0, 0, 0, 0, 0, 0];
      await quantumCompute.connect(alice).initializeQuantumState(amplitudes, 3);

      const stateInfo = await quantumCompute.getQuantumStateInfo(alice.address);
      expect(stateInfo.qubitCount).to.equal(3);
      expect(stateInfo.isEntangled).to.be.false;
      expect(stateInfo.timestamp).to.be.greaterThan(0);
    });

    it("Should return correct job info", async function () {
      await quantumCompute.connect(alice).submitQuantumJob(42, 2);
      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      const jobId = jobHistory[0];

      const jobInfo = await quantumCompute.getJobInfo(jobId);
      expect(jobInfo.submitter).to.equal(alice.address);
      expect(jobInfo.algorithmType).to.equal(2);
      expect(jobInfo.isCompleted).to.be.false;
      expect(jobInfo.submitTime).to.be.greaterThan(0);
    });

    it("Should return empty job history for new user", async function () {
      const jobHistory = await quantumCompute.getUserJobHistory(carol.address);
      expect(jobHistory.length).to.equal(0);
    });

    it("Should return circuit info", async function () {
      const circuitId = 1;
      const gateTypes = [0, 1, 2];
      const targetQubits = [0, 1, 0];
      const controlQubits = [0, 0, 0];

      await quantumCompute.compileQuantumCircuit(circuitId, gateTypes, targetQubits, controlQubits);

      const circuitInfo = await quantumCompute.getCircuitInfo(circuitId);
      expect(circuitInfo.isCompiled).to.be.true;
      expect(circuitInfo.depth).to.equal(3);
      expect(circuitInfo.gateTypes).to.deep.equal(gateTypes);
      expect(circuitInfo.targetQubits).to.deep.equal(targetQubits);
    });
  });

  describe("Gas Optimization", function () {
    it("Should use reasonable gas for state initialization", async function () {
      const amplitudes = [128, 128, 0, 0];
      const tx = await quantumCompute.connect(alice).initializeQuantumState(amplitudes, 2);
      const receipt = await tx.wait();

      expect(receipt!.gasUsed).to.be.lessThan(500000);
      console.log(`    ⛽ State initialization gas: ${receipt!.gasUsed}`);
    });

    it("Should use reasonable gas for job submission", async function () {
      const tx = await quantumCompute.connect(alice).submitQuantumJob(100, 0);
      const receipt = await tx.wait();

      expect(receipt!.gasUsed).to.be.lessThan(200000);
      console.log(`    ⛽ Job submission gas: ${receipt!.gasUsed}`);
    });

    it("Should use reasonable gas for algorithm execution", async function () {
      await quantumCompute.connect(alice).submitQuantumJob(100, 0);
      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      const jobId = jobHistory[0];

      const tx = await quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId);
      const receipt = await tx.wait();

      expect(receipt!.gasUsed).to.be.lessThan(300000);
      console.log(`    ⛽ Algorithm execution gas: ${receipt!.gasUsed}`);
    });
  });

  describe("Edge Cases and Boundary Testing", function () {
    it("Should handle zero input value", async function () {
      const tx = await quantumCompute.connect(alice).submitQuantumJob(0, 0);
      await tx.wait();

      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      expect(jobHistory.length).to.equal(1);
    });

    it("Should handle maximum uint8 input value", async function () {
      const tx = await quantumCompute.connect(alice).submitQuantumJob(255, 0);
      await tx.wait();

      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      expect(jobHistory.length).to.equal(1);
    });

    it("Should handle rapid successive job submissions", async function () {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(quantumCompute.connect(alice).submitQuantumJob(i, i % 6));
      }

      await Promise.all(promises.map(p => p.then(tx => tx.wait())));

      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      expect(jobHistory.length).to.equal(10);
    });

    it("Should maintain state consistency across operations", async function () {
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.connect(alice).initializeQuantumState(amplitudes, 2);

      const initialState = await quantumCompute.getQuantumStateInfo(alice.address);
      await quantumCompute.connect(alice).submitQuantumJob(100, 0);
      const afterJobState = await quantumCompute.getQuantumStateInfo(alice.address);

      expect(initialState.qubitCount).to.equal(afterJobState.qubitCount);
    });
  });

  describe("Integration Tests", function () {
    it("Should complete full workflow: init -> submit -> execute -> verify", async function () {
      // 1. Initialize quantum state
      const amplitudes = [128, 128, 0, 0];
      await quantumCompute.connect(alice).initializeQuantumState(amplitudes, 2);

      // 2. Submit job
      await quantumCompute.connect(alice).submitQuantumJob(100, 1);
      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      const jobId = jobHistory[0];

      // 3. Execute algorithm
      await quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId);

      // 4. Verify job completion
      const jobInfo = await quantumCompute.getJobInfo(jobId);
      expect(jobInfo.isCompleted).to.be.true;
      expect(jobInfo.completeTime).to.be.greaterThan(jobInfo.submitTime);
    });

    it("Should handle multiple users with concurrent operations", async function () {
      const amplitudes = [128, 128, 0, 0];

      // Initialize states
      await quantumCompute.connect(alice).initializeQuantumState(amplitudes, 2);
      await quantumCompute.connect(bob).initializeQuantumState(amplitudes, 2);

      // Submit jobs
      await quantumCompute.connect(alice).submitQuantumJob(50, 0);
      await quantumCompute.connect(bob).submitQuantumJob(75, 1);

      const aliceHistory = await quantumCompute.getUserJobHistory(alice.address);
      const bobHistory = await quantumCompute.getUserJobHistory(bob.address);

      expect(aliceHistory.length).to.equal(1);
      expect(bobHistory.length).to.equal(1);
    });

    it("Should test all algorithm types in sequence", async function () {
      const algorithms = [0, 1, 2, 3, 4, 5];

      for (const algoType of algorithms) {
        await quantumCompute.connect(alice).submitQuantumJob(100 + algoType, algoType);
      }

      const jobHistory = await quantumCompute.getUserJobHistory(alice.address);
      expect(jobHistory.length).to.equal(6);

      // Execute all jobs
      for (const jobId of jobHistory) {
        await quantumCompute.connect(deployer).executeQuantumAlgorithm(jobId);
      }

      // Verify all completed
      for (const jobId of jobHistory) {
        const jobInfo = await quantumCompute.getJobInfo(jobId);
        expect(jobInfo.isCompleted).to.be.true;
      }
    });
  });
});
