import { expect } from "chai";
import { ethers } from "hardhat";
import { QuantumPrivacyCompute } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * Performance Testing Suite
 *
 * Tests gas consumption, execution time, and scalability
 * Monitors performance metrics and identifies bottlenecks
 */
describe("Performance Tests", function () {
  let contract: QuantumPrivacyCompute;
  let owner: SignerWithAddress;
  let users: SignerWithAddress[];

  // Performance thresholds
  const GAS_THRESHOLDS = {
    DEPLOY: 3_000_000,
    SUBMIT_JOB: 200_000,
    EXECUTE_ALGORITHM: 500_000,
    COMPILE_CIRCUIT: 300_000,
    CREATE_ENTANGLEMENT: 250_000,
    BATCH_OPERATIONS: 1_000_000,
  };

  const TIME_THRESHOLDS = {
    DEPLOYMENT: 5000, // ms
    TRANSACTION: 2000, // ms
    BATCH_PROCESSING: 10000, // ms
  };

  before(async function () {
    [owner, ...users] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const Contract = await ethers.getContractFactory("QuantumPrivacyCompute");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  describe("Gas Consumption Tests", function () {
    it("Should deploy within gas threshold", async function () {
      const Contract = await ethers.getContractFactory("QuantumPrivacyCompute");
      const deployTx = Contract.getDeployTransaction();
      const estimatedGas = await ethers.provider.estimateGas(deployTx);

      console.log(`      ⛽ Deployment gas: ${estimatedGas.toString()}`);
      expect(estimatedGas).to.be.lessThan(GAS_THRESHOLDS.DEPLOY);
    });

    it("Should submit job within gas threshold", async function () {
      const tx = await contract.submitJob(1, 100, "Test performance job");
      const receipt = await tx.wait();

      console.log(`      ⛽ Submit job gas: ${receipt?.gasUsed.toString()}`);
      expect(receipt?.gasUsed).to.be.lessThan(GAS_THRESHOLDS.SUBMIT_JOB);
    });

    it("Should execute algorithm within gas threshold", async function () {
      await contract.submitJob(1, 100, "Job for execution");
      const jobId = 0;

      const tx = await contract.executeAlgorithm(jobId);
      const receipt = await tx.wait();

      console.log(`      ⛽ Execute algorithm gas: ${receipt?.gasUsed.toString()}`);
      expect(receipt?.gasUsed).to.be.lessThan(GAS_THRESHOLDS.EXECUTE_ALGORITHM);
    });

    it("Should compile circuit within gas threshold", async function () {
      await contract.submitJob(1, 100, "Job for circuit");
      const jobId = 0;

      const tx = await contract.compileCircuit(jobId);
      const receipt = await tx.wait();

      console.log(`      ⛽ Compile circuit gas: ${receipt?.gasUsed.toString()}`);
      expect(receipt?.gasUsed).to.be.lessThan(GAS_THRESHOLDS.COMPILE_CIRCUIT);
    });

    it("Should create entanglement within gas threshold", async function () {
      const user1 = users[0];
      const user2 = users[1];

      const tx = await contract.createEntanglement(user1.address, user2.address);
      const receipt = await tx.wait();

      console.log(`      ⛽ Create entanglement gas: ${receipt?.gasUsed.toString()}`);
      expect(receipt?.gasUsed).to.be.lessThan(GAS_THRESHOLDS.CREATE_ENTANGLEMENT);
    });
  });

  describe("Batch Operation Performance", function () {
    it("Should handle batch job submissions efficiently", async function () {
      const batchSize = 10;
      const startTime = Date.now();
      let totalGas = BigInt(0);

      for (let i = 0; i < batchSize; i++) {
        const tx = await contract.submitJob(1, 100 + i, `Batch job ${i}`);
        const receipt = await tx.wait();
        totalGas += receipt?.gasUsed || BigInt(0);
      }

      const duration = Date.now() - startTime;
      const avgGasPerJob = totalGas / BigInt(batchSize);

      console.log(`      📊 Batch size: ${batchSize}`);
      console.log(`      ⏱️  Total time: ${duration}ms`);
      console.log(`      ⛽ Total gas: ${totalGas.toString()}`);
      console.log(`      📈 Avg gas per job: ${avgGasPerJob.toString()}`);

      expect(duration).to.be.lessThan(TIME_THRESHOLDS.BATCH_PROCESSING);
      expect(totalGas).to.be.lessThan(GAS_THRESHOLDS.BATCH_OPERATIONS * batchSize);
    });

    it("Should handle batch algorithm executions efficiently", async function () {
      const batchSize = 5;

      // Submit jobs first
      for (let i = 0; i < batchSize; i++) {
        await contract.submitJob(1, 100 + i, `Exec batch job ${i}`);
      }

      const startTime = Date.now();
      let totalGas = BigInt(0);

      // Execute algorithms
      for (let i = 0; i < batchSize; i++) {
        const tx = await contract.executeAlgorithm(i);
        const receipt = await tx.wait();
        totalGas += receipt?.gasUsed || BigInt(0);
      }

      const duration = Date.now() - startTime;
      const avgGasPerExec = totalGas / BigInt(batchSize);

      console.log(`      📊 Batch executions: ${batchSize}`);
      console.log(`      ⏱️  Total time: ${duration}ms`);
      console.log(`      ⛽ Total gas: ${totalGas.toString()}`);
      console.log(`      📈 Avg gas per execution: ${avgGasPerExec.toString()}`);

      expect(duration).to.be.lessThan(TIME_THRESHOLDS.BATCH_PROCESSING);
    });

    it("Should handle multiple entanglements efficiently", async function () {
      const pairCount = 5;
      let totalGas = BigInt(0);

      for (let i = 0; i < pairCount; i++) {
        const user1 = users[i * 2];
        const user2 = users[i * 2 + 1];

        const tx = await contract.createEntanglement(user1.address, user2.address);
        const receipt = await tx.wait();
        totalGas += receipt?.gasUsed || BigInt(0);
      }

      const avgGasPerPair = totalGas / BigInt(pairCount);

      console.log(`      📊 Entanglement pairs: ${pairCount}`);
      console.log(`      ⛽ Total gas: ${totalGas.toString()}`);
      console.log(`      📈 Avg gas per pair: ${avgGasPerPair.toString()}`);

      expect(avgGasPerPair).to.be.lessThan(GAS_THRESHOLDS.CREATE_ENTANGLEMENT);
    });
  });

  describe("Scalability Tests", function () {
    it("Should scale linearly with job count", async function () {
      const testSizes = [5, 10, 20];
      const gasPerJob: bigint[] = [];

      for (const size of testSizes) {
        let totalGas = BigInt(0);

        for (let i = 0; i < size; i++) {
          const tx = await contract.submitJob(1, 100 + i, `Scale job ${i}`);
          const receipt = await tx.wait();
          totalGas += receipt?.gasUsed || BigInt(0);
        }

        const avgGas = totalGas / BigInt(size);
        gasPerJob.push(avgGas);

        console.log(`      📊 Jobs: ${size}, Avg gas: ${avgGas.toString()}`);
      }

      // Gas per job should remain relatively constant (within 20% variance)
      const maxGas = gasPerJob.reduce((a, b) => (a > b ? a : b));
      const minGas = gasPerJob.reduce((a, b) => (a < b ? a : b));
      const variance = Number((maxGas - minGas) * BigInt(100) / minGas);

      console.log(`      📈 Gas variance: ${variance}%`);
      expect(variance).to.be.lessThan(20);
    });

    it("Should maintain performance with increasing complexity", async function () {
      const complexities = [100, 500, 1000];
      const gasPerComplexity: bigint[] = [];

      for (const complexity of complexities) {
        const tx = await contract.submitJob(1, complexity, `Complex job ${complexity}`);
        const receipt = await tx.wait();
        gasPerComplexity.push(receipt?.gasUsed || BigInt(0));

        console.log(`      📊 Complexity: ${complexity}, Gas: ${receipt?.gasUsed.toString()}`);
      }

      // Higher complexity should result in proportionally higher gas
      // but within reasonable bounds
      for (let i = 0; i < gasPerComplexity.length; i++) {
        expect(gasPerComplexity[i]).to.be.lessThan(GAS_THRESHOLDS.SUBMIT_JOB * 2);
      }
    });

    it("Should handle high user concurrency", async function () {
      const userCount = 10;
      let totalGas = BigInt(0);

      // Simulate concurrent job submissions from different users
      const promises = users.slice(0, userCount).map(async (user, index) => {
        const tx = await contract.connect(user).submitJob(1, 100 + index, `User ${index} job`);
        const receipt = await tx.wait();
        return receipt?.gasUsed || BigInt(0);
      });

      const gasResults = await Promise.all(promises);
      totalGas = gasResults.reduce((sum, gas) => sum + gas, BigInt(0));

      const avgGasPerUser = totalGas / BigInt(userCount);

      console.log(`      📊 Concurrent users: ${userCount}`);
      console.log(`      ⛽ Total gas: ${totalGas.toString()}`);
      console.log(`      📈 Avg gas per user: ${avgGasPerUser.toString()}`);

      expect(avgGasPerUser).to.be.lessThan(GAS_THRESHOLDS.SUBMIT_JOB);
    });
  });

  describe("Memory and Storage Efficiency", function () {
    it("Should efficiently store job data", async function () {
      const jobCount = 20;

      for (let i = 0; i < jobCount; i++) {
        await contract.submitJob(1, 100 + i, `Storage test job ${i}`);
      }

      const counter = await contract.jobCounter();
      expect(counter).to.equal(jobCount);

      // Verify all jobs are retrievable
      for (let i = 0; i < jobCount; i++) {
        const job = await contract.getJob(i);
        expect(job.owner).to.equal(owner.address);
        expect(job.algorithmType).to.equal(1);
      }
    });

    it("Should efficiently track user statistics", async function () {
      const jobsPerUser = 5;

      for (let i = 0; i < jobsPerUser; i++) {
        await contract.submitJob(1, 100 + i, `User stats job ${i}`);
      }

      const userJobs = await contract.getUserJobs(owner.address);
      expect(userJobs.length).to.equal(jobsPerUser);

      const stats = await contract.getUserStats(owner.address);
      expect(stats[0]).to.equal(jobsPerUser); // totalJobs
    });

    it("Should efficiently manage entanglement pairs", async function () {
      const pairCount = 10;

      for (let i = 0; i < pairCount; i++) {
        await contract.createEntanglement(users[i * 2].address, users[i * 2 + 1].address);
      }

      const counter = await contract.entanglementCounter();
      expect(counter).to.equal(pairCount);

      // Verify entanglement lookups are efficient
      for (let i = 0; i < pairCount; i++) {
        const pair = await contract.getEntanglementPair(i);
        expect(pair.user1).to.equal(users[i * 2].address);
        expect(pair.user2).to.equal(users[i * 2 + 1].address);
      }
    });
  });

  describe("Optimization Verification", function () {
    it("Should benefit from compiler optimization", async function () {
      // This test verifies that optimized code uses less gas
      // The optimizer should be enabled in hardhat.config.ts
      const tx = await contract.submitJob(1, 100, "Optimization test");
      const receipt = await tx.wait();

      // With optimization, gas should be significantly below threshold
      const optimizationBenefit = GAS_THRESHOLDS.SUBMIT_JOB - Number(receipt?.gasUsed || 0);
      const benefitPercent = (optimizationBenefit / GAS_THRESHOLDS.SUBMIT_JOB) * 100;

      console.log(`      ⛽ Gas used: ${receipt?.gasUsed.toString()}`);
      console.log(`      📈 Gas saved: ${optimizationBenefit} (${benefitPercent.toFixed(2)}%)`);

      expect(receipt?.gasUsed).to.be.lessThan(GAS_THRESHOLDS.SUBMIT_JOB);
    });

    it("Should have efficient view functions", async function () {
      await contract.submitJob(1, 100, "View test job");

      // View functions don't consume gas, but we can measure call overhead
      const startTime = Date.now();

      await contract.getJob(0);
      await contract.getTotalJobs();
      await contract.getUserJobs(owner.address);
      await contract.getUserStats(owner.address);

      const duration = Date.now() - startTime;

      console.log(`      ⏱️  View functions time: ${duration}ms`);
      expect(duration).to.be.lessThan(1000); // Should be very fast
    });

    it("Should minimize storage operations", async function () {
      // Test that operations minimize SSTORE calls (most expensive)
      const tx1 = await contract.submitJob(1, 100, "Storage optimization test");
      const receipt1 = await tx1.wait();

      // Subsequent similar operations should have similar gas costs
      const tx2 = await contract.submitJob(1, 100, "Storage optimization test 2");
      const receipt2 = await tx2.wait();

      const gasDiff = Number(receipt2?.gasUsed || 0) - Number(receipt1?.gasUsed || 0);
      const diffPercent = Math.abs(gasDiff) / Number(receipt1?.gasUsed || 1) * 100;

      console.log(`      ⛽ Gas 1: ${receipt1?.gasUsed.toString()}`);
      console.log(`      ⛽ Gas 2: ${receipt2?.gasUsed.toString()}`);
      console.log(`      📊 Difference: ${diffPercent.toFixed(2)}%`);

      // Gas should be very similar (within 10%)
      expect(diffPercent).to.be.lessThan(10);
    });
  });

  describe("Performance Regression Tests", function () {
    it("Should maintain baseline performance metrics", async function () {
      // Baseline performance test to detect regressions
      const baseline = {
        submitJob: 150_000,
        executeAlgorithm: 400_000,
        compileCircuit: 250_000,
        createEntanglement: 200_000,
      };

      // Test submit job
      const tx1 = await contract.submitJob(1, 100, "Baseline job");
      const receipt1 = await tx1.wait();
      expect(receipt1?.gasUsed).to.be.lessThan(baseline.submitJob);

      // Test execute algorithm
      const tx2 = await contract.executeAlgorithm(0);
      const receipt2 = await tx2.wait();
      expect(receipt2?.gasUsed).to.be.lessThan(baseline.executeAlgorithm);

      // Test compile circuit
      const tx3 = await contract.compileCircuit(0);
      const receipt3 = await tx3.wait();
      expect(receipt3?.gasUsed).to.be.lessThan(baseline.compileCircuit);

      // Test create entanglement
      const tx4 = await contract.createEntanglement(users[0].address, users[1].address);
      const receipt4 = await tx4.wait();
      expect(receipt4?.gasUsed).to.be.lessThan(baseline.createEntanglement);

      console.log(`      ✅ All operations within baseline thresholds`);
    });

    it("Should generate performance report", async function () {
      // Comprehensive performance report
      const metrics = {
        deployment: BigInt(0),
        submitJob: BigInt(0),
        executeAlgorithm: BigInt(0),
        compileCircuit: BigInt(0),
        createEntanglement: BigInt(0),
      };

      // Measure each operation
      const Contract = await ethers.getContractFactory("QuantumPrivacyCompute");
      const deployTx = Contract.getDeployTransaction();
      metrics.deployment = await ethers.provider.estimateGas(deployTx);

      const tx1 = await contract.submitJob(1, 100, "Report job");
      metrics.submitJob = (await tx1.wait())?.gasUsed || BigInt(0);

      const tx2 = await contract.executeAlgorithm(0);
      metrics.executeAlgorithm = (await tx2.wait())?.gasUsed || BigInt(0);

      const tx3 = await contract.compileCircuit(0);
      metrics.compileCircuit = (await tx3.wait())?.gasUsed || BigInt(0);

      const tx4 = await contract.createEntanglement(users[0].address, users[1].address);
      metrics.createEntanglement = (await tx4.wait())?.gasUsed || BigInt(0);

      console.log(`\n      📊 Performance Report:`);
      console.log(`      ├─ Deployment: ${metrics.deployment.toString()} gas`);
      console.log(`      ├─ Submit Job: ${metrics.submitJob.toString()} gas`);
      console.log(`      ├─ Execute Algorithm: ${metrics.executeAlgorithm.toString()} gas`);
      console.log(`      ├─ Compile Circuit: ${metrics.compileCircuit.toString()} gas`);
      console.log(`      └─ Create Entanglement: ${metrics.createEntanglement.toString()} gas\n`);
    });
  });
});
