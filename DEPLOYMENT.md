# Deployment Guide

Comprehensive deployment documentation for the Quantum Privacy Computing Platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Testnet Deployment](#testnet-deployment)
- [Contract Verification](#contract-verification)
- [Deployment Information](#deployment-information)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: For version control

Check your versions:

```bash
node --version
npm --version
git --version
```

### Required Accounts and API Keys

1. **MetaMask Wallet**
   - Install from: https://metamask.io/
   - Create or import a wallet
   - Export your private key (for testnet deployment only!)

2. **Sepolia Testnet ETH**
   - Get free testnet ETH from:
     - https://sepoliafaucet.com/
     - https://sepolia-faucet.pk910.de/
     - https://www.alchemy.com/faucets/ethereum-sepolia

3. **Infura API Key** (Optional but recommended)
   - Sign up at: https://infura.io/
   - Create a new project
   - Copy your Project ID

4. **Etherscan API Key**
   - Sign up at: https://etherscan.io/
   - Go to: https://etherscan.io/myapikey
   - Create a new API key

5. **CoinMarketCap API Key** (Optional - for gas reporting)
   - Sign up at: https://coinmarketcap.com/api/
   - Get your free API key

## Environment Setup

### 1. Clone and Install

```bash
# Navigate to project directory
cd /path/to/quantum-privacy-computing

# Install dependencies
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your values:

```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ZAMA_SEPOLIA_RPC_URL=https://sepolia.rpc.zama.ai

# Private Key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API Key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Gas Reporting (Optional)
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

### 3. Verify Configuration

```bash
# Check Hardhat configuration
npx hardhat config

# List available accounts
npx hardhat accounts
```

## Local Development

### 1. Start Local Hardhat Node

Open a terminal and run:

```bash
npm run node
```

This starts a local Ethereum network at `http://127.0.0.1:8545`.

### 2. Deploy to Local Network

In a separate terminal:

```bash
npm run deploy:local
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests with gas reporting
npm run test:gas

# Run tests with coverage
npm run test:coverage

# Run tests in verbose mode
npm run test:verbose
```

### 4. Run Simulation

```bash
# Run complete workflow simulation
npx hardhat run scripts/simulate.js --network localhost
```

## Testnet Deployment

### Step 1: Prepare for Deployment

1. **Fund Your Wallet**
   - Ensure you have at least 0.1 Sepolia ETH
   - Check balance in MetaMask

2. **Verify Environment**
   ```bash
   # Check your configuration
   npx hardhat accounts
   ```

3. **Compile Contracts**
   ```bash
   npm run compile
   ```

### Step 2: Deploy to Sepolia

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia
```

Expected output:
```
🚀 Starting Quantum Privacy Computing Platform Deployment...
============================================================
📝 Deploying with account: 0x1234...5678
💰 Account balance: 0.5 ETH
🌐 Network: sepolia
🔗 Chain ID: 11155111
============================================================

⏳ Deploying QuantumPrivacyCompute contract...

✅ QuantumPrivacyCompute deployed to: 0xabcd...ef01

📋 Transaction Details:
   Hash: 0x9876...4321
   Gas Limit: 4500000
   Gas Price: 20 gwei

⏳ Waiting for 3 block confirmation(s)...
✅ Confirmed with 3 block confirmations
⛽ Gas Used: 3245678
💸 Deployment Cost: 0.0649 ETH
```

### Step 3: Save Deployment Information

The deployment script automatically saves:

1. **`deployments/latest.json`** - Latest deployment details
2. **`deployments/sepolia-{timestamp}.json`** - Timestamped deployment record
3. **`nextjs-app/config/contract.json`** - Frontend configuration

Example deployment file structure:
```json
{
  "contract": "QuantumPrivacyCompute",
  "address": "0x1234567890123456789012345678901234567890",
  "network": "sepolia",
  "chainId": "11155111",
  "deployer": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "deploymentTxHash": "0x9876543210987654321098765432109876543210987654321098765432109876",
  "timestamp": "2025-11-02T10:30:00.000Z",
  "blockNumber": 12345678,
  "gasUsed": "3245678",
  "constructorArguments": [],
  "verified": true,
  "verifiedAt": "2025-11-02T10:31:00.000Z",
  "contractState": {
    "owner": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "jobCounter": "1",
    "maxQubits": "32"
  }
}
```

## Contract Verification

### Automatic Verification

Contract verification happens automatically during deployment if `ETHERSCAN_API_KEY` is set.

### Manual Verification

If automatic verification fails:

```bash
# Verify using deployment file
npm run verify:sepolia

# Or verify manually with contract address
npx hardhat verify --network sepolia 0xYOUR_CONTRACT_ADDRESS
```

### Verification with Constructor Arguments

If your contract has constructor arguments:

```bash
npx hardhat verify --network sepolia \
  --contract contracts/QuantumPrivacyCompute.sol:QuantumPrivacyCompute \
  0xYOUR_CONTRACT_ADDRESS
```

### Verify Verification Status

Check on Etherscan:
```
https://sepolia.etherscan.io/address/0xYOUR_CONTRACT_ADDRESS#code
```

## Deployment Information

### Network Details

#### Sepolia Testnet

- **Chain ID**: 11155111
- **RPC URL**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **Block Explorer**: https://sepolia.etherscan.io/
- **Faucets**:
  - https://sepoliafaucet.com/
  - https://sepolia-faucet.pk910.de/

#### Zama Sepolia (FHE-enabled)

- **Chain ID**: 11155111
- **RPC URL**: `https://sepolia.rpc.zama.ai`
- **Special Features**: Fully Homomorphic Encryption support
- **Documentation**: https://docs.zama.ai/

### Contract Information

- **Contract Name**: QuantumPrivacyCompute
- **Solidity Version**: 0.8.24
- **Optimizer**: Enabled (200 runs)
- **License**: MIT

### Deployment Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `deploy.js` | Main deployment script | `npm run deploy:sepolia` |
| `verify.js` | Contract verification | `npm run verify:sepolia` |
| `interact.js` | Interactive contract interface | `npx hardhat run scripts/interact.js --network sepolia` |
| `simulate.js` | Complete workflow simulation | `npx hardhat run scripts/simulate.js --network localhost` |

## Post-Deployment Steps

### 1. Update Frontend Configuration

Edit `nextjs-app/.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### 2. Test Contract Interaction

```bash
# Run interactive script
npx hardhat run scripts/interact.js --network sepolia
```

### 3. Start Frontend Application

```bash
cd nextjs-app
npm install
npm run dev
```

Visit http://localhost:3000 to interact with your deployed contract.

### 4. Monitor Contract Activity

- **Etherscan**: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
- **Track transactions**: All contract interactions appear here
- **View events**: Monitor QuantumJobSubmitted, QuantumJobCompleted events

## Troubleshooting

### Common Issues

#### Issue: "Insufficient balance for deployment"

**Solution**:
```bash
# Check your balance
npx hardhat run scripts/checkBalance.js --network sepolia

# Get more testnet ETH from faucets
```

#### Issue: "Network request failed"

**Possible causes**:
- Invalid RPC URL
- Network connectivity issues
- Infura rate limiting

**Solution**:
```bash
# Test RPC connection
curl -X POST https://sepolia.infura.io/v3/YOUR_PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Use alternative RPC
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

#### Issue: "Nonce too high"

**Solution**:
```bash
# Reset your account in MetaMask
# Settings > Advanced > Reset Account
```

#### Issue: "Verification failed"

**Possible causes**:
- Contract not fully confirmed
- Wrong constructor arguments
- Invalid API key

**Solution**:
```bash
# Wait a few minutes and try again
npm run verify:sepolia

# Check Etherscan API key
echo $ETHERSCAN_API_KEY
```

#### Issue: "Gas estimation failed"

**Solution**:
```bash
# Increase gas limit in hardhat.config.ts
gas: 8000000

# Or specify gas manually
npx hardhat run scripts/deploy.js --network sepolia --gas 8000000
```

### Getting Help

1. **Check Logs**: Review console output for error messages
2. **Review Configuration**: Verify `.env` and `hardhat.config.ts`
3. **Test Network**: Ensure Sepolia testnet is operational
4. **Documentation**: See README.md for detailed information
5. **Community**: Check Hardhat and Zama documentation

### Useful Commands

```bash
# Clean and rebuild
npm run clean
npm run compile

# Check account balance
npx hardhat run scripts/checkBalance.js --network sepolia

# View deployment history
ls -la deployments/

# Test contract locally first
npm run deploy:local
npx hardhat run scripts/simulate.js --network localhost

# Format code
npm run format

# Lint Solidity
npm run lint
```

## Security Best Practices

1. **Never commit private keys** to version control
2. **Use testnet wallets only** for development
3. **Verify contracts** on Etherscan for transparency
4. **Test thoroughly** on local network before deploying
5. **Keep dependencies updated**: `npm audit` and `npm update`
6. **Use hardware wallets** for mainnet deployments
7. **Enable 2FA** on all service accounts (Infura, Etherscan, etc.)

## Next Steps

After successful deployment:

1. ✅ Run comprehensive tests
2. ✅ Verify contract on Etherscan
3. ✅ Update frontend configuration
4. ✅ Test all contract functions via interact.js
5. ✅ Deploy frontend to hosting service
6. ✅ Set up monitoring and alerts
7. ✅ Document API endpoints
8. ✅ Create user documentation

## Resources

- **Hardhat Documentation**: https://hardhat.org/docs
- **Ethers.js Documentation**: https://docs.ethers.org/v6/
- **Zama FHE Documentation**: https://docs.zama.ai/
- **Sepolia Testnet**: https://sepolia.dev/
- **Ethereum Documentation**: https://ethereum.org/developers
