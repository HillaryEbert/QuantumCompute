import { ethers, run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("\n🚀 Starting Quantum Privacy Computing Platform Deployment...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error("❌ Insufficient balance for deployment. Please fund your account.");
  }

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId.toString());

  console.log("\n⏳ Deploying QuantumPrivacyCompute contract...");

  // Deploy contract
  const QuantumCompute = await ethers.getContractFactory("QuantumPrivacyCompute");
  const quantumCompute = await QuantumCompute.deploy();

  await quantumCompute.waitForDeployment();
  const address = await quantumCompute.getAddress();

  console.log("\n✅ QuantumPrivacyCompute deployed to:", address);

  // Get deployment transaction details
  const deploymentTx = quantumCompute.deploymentTransaction();
  if (deploymentTx) {
    console.log("📋 Transaction hash:", deploymentTx.hash);
    console.log("⛽ Gas used:", deploymentTx.gasLimit.toString());

    // Wait for confirmations
    console.log("\n⏳ Waiting for block confirmations...");
    await deploymentTx.wait(3);
    console.log("✅ Confirmed with 3 block confirmations");
  }

  // Save deployment information
  const deploymentInfo = {
    contract: "QuantumPrivacyCompute",
    address: address,
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    deploymentTxHash: deploymentTx?.hash || "",
    timestamp: new Date().toISOString(),
    blockNumber: deploymentTx?.blockNumber || 0,
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save to JSON file
  const deploymentFilePath = path.join(
    deploymentsDir,
    `${network.name}-${Date.now()}.json`
  );
  fs.writeFileSync(
    deploymentFilePath,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📁 Deployment info saved to:", deploymentFilePath);

  // Save latest deployment
  const latestDeploymentPath = path.join(deploymentsDir, "latest.json");
  fs.writeFileSync(
    latestDeploymentPath,
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Verify contract on Etherscan (if not local network)
  if (network.chainId !== 1337n && network.chainId !== 31337n) {
    console.log("\n⏳ Waiting before Etherscan verification...");
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\n🔍 Verifying contract on Etherscan...");
      try {
        await run("verify:verify", {
          address: address,
          constructorArguments: [],
        });
        console.log("✅ Contract verified successfully!");
      } catch (error: any) {
        if (error.message.includes("Already Verified")) {
          console.log("ℹ️  Contract already verified on Etherscan");
        } else {
          console.log("⚠️  Verification failed:", error.message);
          console.log("You can verify manually later using:");
          console.log(`npx hardhat verify --network ${network.name} ${address}`);
        }
      }
    } else {
      console.log("\n⚠️  ETHERSCAN_API_KEY not set. Skipping verification.");
      console.log("To verify later, run:");
      console.log(`npx hardhat verify --network ${network.name} ${address}`);
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Contract Address:", address);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("Transaction:", deploymentTx?.hash || "N/A");
  console.log("=".repeat(60));

  // Print next steps
  console.log("\n📝 NEXT STEPS:");
  console.log("1. Update your frontend .env file with:");
  console.log(`   VITE_CONTRACT_ADDRESS=${address}`);
  console.log(`   VITE_CHAIN_ID=${network.chainId}`);
  console.log("\n2. Test the contract:");
  console.log("   npm run test");
  console.log("\n3. View on block explorer:");
  if (network.chainId === 11155111n) {
    console.log(`   https://sepolia.etherscan.io/address/${address}`);
  }
  console.log("\n4. Start your frontend:");
  console.log("   cd nextjs-app && npm run dev");
  console.log("\n✨ Deployment complete!\n");
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
