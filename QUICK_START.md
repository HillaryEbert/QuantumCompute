# Quick Start Guide

Fast-track guide to get started with the Quantum Privacy Computing Platform.

## 🚀 5-Minute Setup

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MetaMask wallet

### Step 1: Installation (1 minute)

```bash
# Navigate to project
cd /path/to/quantum-privacy-computing

# Install dependencies
npm install
```

### Step 2: Environment Setup (2 minutes)

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Step 3: Local Testing (2 minutes)

```bash
# Terminal 1: Start local blockchain
npm run node

# Terminal 2: Deploy & test
npm run deploy:local
npm run simulate
```

**Done!** Your local development environment is ready.

---

## 📋 Command Reference

### Essential Commands

```bash
# Development
npm run node              # Start local blockchain
npm run compile           # Compile contracts
npm test                  # Run tests
npm run simulate          # Run complete workflow simulation

# Deployment
npm run deploy:local      # Deploy to local network
npm run deploy:sepolia    # Deploy to Sepolia testnet

# Verification
npm run verify:sepolia    # Verify contract on Etherscan

# Interaction
npm run interact:local    # Interact with local contract
npm run interact:sepolia  # Interact with Sepolia contract
```

---

## 🌐 Testnet Deployment

### Get Testnet ETH

1. Visit: https://sepoliafaucet.com/
2. Enter your wallet address
3. Wait for ETH transfer

### Deploy to Sepolia

```bash
# 1. Compile
npm run compile

# 2. Test
npm test

# 3. Deploy
npm run deploy:sepolia

# 4. Verify
npm run verify:sepolia

# 5. Interact
npm run interact:sepolia
```

---

## 🎮 Interactive Usage

### Start Interactive Interface

```bash
npm run interact:sepolia
```

### Menu Options

```
1.  View Contract Information      # Contract details and state
2.  Initialize Quantum State        # Create quantum state
3.  Submit Quantum Job              # Submit computation job
4.  Execute Quantum Algorithm       # Run algorithm
5.  Check Job Status                # View job info
6.  Get Job Result                  # Retrieve result
7.  Compile Quantum Circuit         # Create circuit
8.  Get User Job History            # View all jobs
9.  Authorize Compute Node          # Add authorized node
10. Check Quantum State Info        # View state details
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# With gas reporting
npm run test:gas

# With coverage
npm run test:coverage

# Verbose output
npm run test:verbose
```

---

## 📊 Deployment Information

After deployment, find info at:
- `deployments/latest.json` - Latest deployment
- `deployments/sepolia-*.json` - Historical records

View on Etherscan:
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

---

## 🛠️ Available Scripts

### Core Scripts

| Script | Purpose | Network |
|--------|---------|---------|
| `deploy.js` | Main deployment | All |
| `verify.js` | Contract verification | Sepolia |
| `interact.js` | Interactive interface | All |
| `simulate.js` | Workflow simulation | All |

### Script Locations

```
scripts/
├── deploy.js      # Deployment with auto-verification
├── verify.js      # Etherscan verification
├── interact.js    # Interactive CLI interface
└── simulate.js    # Complete workflow simulation
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `HARDHAT_FRAMEWORK.md` | Framework documentation |
| `MIGRATION_SUMMARY.md` | Migration details |
| `QUICK_START.md` | This guide |

---

## ⚡ Common Tasks

### Task 1: Deploy New Contract

```bash
npm run compile
npm test
npm run deploy:sepolia
npm run verify:sepolia
```

### Task 2: Test Contract Locally

```bash
# Terminal 1
npm run node

# Terminal 2
npm run deploy:local
npm run simulate
```

### Task 3: Interact with Deployed Contract

```bash
npm run interact:sepolia
# Choose menu option
```

### Task 4: Check Gas Usage

```bash
REPORT_GAS=true npm test
```

### Task 5: Verify Existing Contract

```bash
npm run verify:sepolia
# Or with address:
npx hardhat run scripts/verify.js --network sepolia -- 0xADDRESS
```

---

## 🔧 Troubleshooting

### Issue: Deployment fails

```bash
# Check balance
npx hardhat run scripts/checkBalance.ts --network sepolia

# Verify config
npx hardhat config
```

### Issue: Verification fails

```bash
# Wait 30 seconds and retry
npm run verify:sepolia
```

### Issue: Network issues

```bash
# Test RPC connection
curl -X POST $SEPOLIA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Issue: Compilation errors

```bash
npm run clean
npm run compile
```

---

## 📱 Frontend Integration

### Update Frontend Config

After deployment:

```bash
cd nextjs-app

# Edit .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia

# Install and run
npm install
npm run dev
```

---

## 🎯 Next Steps

### For Developers

1. ✅ Read `HARDHAT_FRAMEWORK.md` for detailed documentation
2. ✅ Explore test files in `test/`
3. ✅ Review contract code in `contracts/`
4. ✅ Customize scripts in `scripts/`

### For Deployment

1. ✅ Read `DEPLOYMENT.md` for comprehensive guide
2. ✅ Configure production environment
3. ✅ Run security audit
4. ✅ Deploy to mainnet

---

## 🔗 Useful Links

- **Hardhat**: https://hardhat.org/docs
- **Ethers.js**: https://docs.ethers.org/v6/
- **Zama FHE**: https://docs.zama.ai/
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Etherscan**: https://sepolia.etherscan.io/

---

## 💡 Tips

1. **Always test locally first** before deploying to testnet
2. **Run full test suite** before deployment
3. **Verify contracts** immediately after deployment
4. **Keep deployment files** for reference
5. **Monitor gas usage** to optimize costs

---

## 🆘 Need Help?

1. Check documentation files
2. Review error messages carefully
3. Verify environment configuration
4. Test on local network first
5. Check Hardhat/Ethers.js documentation

---

**Ready to build quantum-secure privacy computing!** 🚀
