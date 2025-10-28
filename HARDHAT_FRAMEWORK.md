# Hardhat Development Framework

Complete documentation for the Hardhat-based development framework for Quantum Privacy Computing Platform.

## Overview

This project uses Hardhat as the primary development framework, providing:

- ✅ Complete compilation, testing, and deployment workflow
- ✅ Hardhat task scripts with configuration support
- ✅ Deployment scripts (deploy.js, verify.js, interact.js, simulate.js)
- ✅ Deployment information tracking
- ✅ Network configuration (Local, Sepolia, Zama)
- ✅ Automated Etherscan verification
- ✅ Gas reporting and optimization tools
- ✅ TypeScript support with TypeChain

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts Overview](#scripts-overview)
- [Development Workflow](#development-workflow)
- [Deployment Process](#deployment-process)
- [Contract Verification](#contract-verification)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Installation

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Setup

```bash
# Clone repository
git clone https://github.com/HillaryEbert/QuantumCompute.git
cd QuantumCompute

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
```

## Configuration

### Hardhat Configuration (hardhat.config.ts)

The Hardhat configuration file provides comprehensive setup:

```typescript
{
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun"
    }
  },
  networks: {
    hardhat: { /* Local development */ },
    localhost: { /* Running Hardhat node */ },
    sepolia: { /* Sepolia testnet */ },
    zamaDevnet: { /* Zama FHE Sepolia */ }
  }
}
```

### Environment Variables

Required `.env` configuration:

```env
# RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ZAMA_SEPOLIA_RPC_URL=https://sepolia.rpc.zama.ai

# Deployment
PRIVATE_KEY=your_private_key_without_0x

# Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Gas Reporting (Optional)
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

## Scripts Overview

### Deployment Scripts

#### 1. deploy.js

**Purpose**: Main deployment script with comprehensive features

**Features**:
- Automatic gas estimation
- Network detection
- Balance verification
- Deployment information storage (JSON)
- Frontend configuration generation
- Automatic Etherscan verification
- Contract state initialization check

**Usage**:
```bash
# Deploy to local network
npm run deploy:local

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Zama Sepolia
npm run deploy:zama
```

**Output**:
- `deployments/latest.json` - Latest deployment info
- `deployments/sepolia-{timestamp}.json` - Historical record
- `nextjs-app/config/contract.json` - Frontend config

**Deployment Info Structure**:
```json
{
  "contract": "QuantumPrivacyCompute",
  "address": "0x...",
  "network": "sepolia",
  "chainId": "11155111",
  "deployer": "0x...",
  "deploymentTxHash": "0x...",
  "timestamp": "2025-11-02T10:30:00.000Z",
  "blockNumber": 12345678,
  "gasUsed": "3245678",
  "verified": true,
  "contractState": {
    "owner": "0x...",
    "jobCounter": "1",
    "maxQubits": "32"
  }
}
```

#### 2. verify.js

**Purpose**: Verify deployed contracts on Etherscan

**Features**:
- Automatic address detection from deployment files
- Manual address specification support
- Verification status tracking
- Etherscan link generation

**Usage**:
```bash
# Verify using latest deployment
npm run verify:sepolia

# Verify with specific address
npx hardhat run scripts/verify.js --network sepolia -- 0xYOUR_ADDRESS
```

#### 3. interact.js

**Purpose**: Interactive command-line interface for contract interaction

**Features**:
- Initialize quantum states
- Submit quantum jobs
- Execute algorithms
- Check job status
- Get results
- Compile quantum circuits
- Authorize compute nodes
- View job history

**Usage**:
```bash
# Interactive mode
npm run interact:sepolia

# Local network
npm run interact:local
```

**Menu Options**:
1. View Contract Information
2. Initialize Quantum State
3. Submit Quantum Job
4. Execute Quantum Algorithm
5. Check Job Status
6. Get Job Result
7. Compile Quantum Circuit
8. Get User Job History
9. Authorize Compute Node
10. Check Quantum State Info

#### 4. simulate.js

**Purpose**: Complete workflow simulation for testing

**Features**:
- Multi-user quantum state initialization
- Batch job submission (all algorithm types)
- Automated job execution
- Result verification
- Entanglement creation
- Custom circuit compilation
- Comprehensive reporting

**Usage**:
```bash
# Run simulation on local network
npm run simulate

# Run on Sepolia
npm run simulate:sepolia
```

**Simulation Workflow**:
1. Deploy contract
2. Initialize quantum states for 4 users
3. Submit 6 different algorithm jobs
4. Execute all jobs
5. Verify results
6. Create entanglements
7. Compile custom circuits
8. Generate summary report

## Development Workflow

### 1. Local Development

```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy to local network
npm run deploy:local

# Run simulation
npm run simulate

# Interactive testing
npm run interact:local
```

### 2. Testing

```bash
# Run all tests
npm test

# Run with gas reporting
npm run test:gas

# Run with coverage
npm run test:coverage

# Verbose output
npm run test:verbose
```

### 3. Compilation

```bash
# Compile contracts
npm run compile

# Clean and recompile
npm run clean
npm run compile

# Generate TypeChain types
npm run typechain
```

### 4. Code Quality

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint Solidity
npm run lint

# Fix linting issues
npm run lint:fix
```

## Deployment Process

### Step-by-Step Deployment

#### 1. Preparation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Compile contracts
npm run compile

# Run tests
npm test
```

#### 2. Local Testing

```bash
# Start local node (Terminal 1)
npm run node

# Deploy locally (Terminal 2)
npm run deploy:local

# Run simulation
npm run simulate
```

#### 3. Testnet Deployment

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Verify contract (if not auto-verified)
npm run verify:sepolia

# Test interaction
npm run interact:sepolia
```

#### 4. Post-Deployment

```bash
# Update frontend config
cd nextjs-app
# Edit .env.local with contract address

# Install frontend dependencies
npm install

# Start frontend
npm run dev
```

## Contract Verification

### Automatic Verification

Verification occurs automatically during deployment if `ETHERSCAN_API_KEY` is set.

### Manual Verification

```bash
# Using verification script
npm run verify:sepolia

# Direct Hardhat command
npx hardhat verify --network sepolia 0xCONTRACT_ADDRESS

# With contract specification
npx hardhat verify --network sepolia \
  --contract contracts/QuantumPrivacyCompute.sol:QuantumPrivacyCompute \
  0xCONTRACT_ADDRESS
```

### Verification Status

Check verification in deployment file:
```bash
cat deployments/latest.json | grep verified
```

View on Etherscan:
```
https://sepolia.etherscan.io/address/0xCONTRACT_ADDRESS#code
```

## Testing

### Test Structure

```
test/
└── QuantumPrivacyCompute.test.ts  # Comprehensive test suite
```

### Test Categories

1. **Deployment Tests**
   - Contract deployment
   - Initial state verification

2. **Quantum State Tests**
   - State initialization
   - Amplitude management
   - Qubit counting

3. **Job Management Tests**
   - Job submission
   - Algorithm execution
   - Result retrieval

4. **Circuit Tests**
   - Circuit compilation
   - Gate operations

5. **Authorization Tests**
   - Node authorization
   - Access control

6. **Entanglement Tests**
   - Entanglement creation
   - State correlation

### Running Tests

```bash
# All tests
npm test

# With gas reporting
REPORT_GAS=true npm test

# With coverage
npm run test:coverage

# Specific test file
npx hardhat test test/QuantumPrivacyCompute.test.ts

# Specific test case
npx hardhat test --grep "should initialize quantum state"
```

## Network Configuration

### Supported Networks

| Network | Chain ID | Purpose | RPC URL |
|---------|----------|---------|---------|
| hardhat | 1337 | Local testing | In-memory |
| localhost | 1337 | Local node | http://127.0.0.1:8545 |
| sepolia | 11155111 | Testnet | Infura/Alchemy |
| zamaDevnet | 11155111 | FHE Testnet | https://sepolia.rpc.zama.ai |

### Network Selection

```bash
# Local
npm run deploy:local

# Sepolia
npm run deploy:sepolia

# Zama
npm run deploy:zama

# Custom network
npx hardhat run scripts/deploy.js --network YOUR_NETWORK
```

## Gas Optimization

### Gas Reporting

```bash
# Enable gas reporting
REPORT_GAS=true npm test

# With USD conversion
COINMARKETCAP_API_KEY=your_key REPORT_GAS=true npm test
```

### Gas Report Output

```
·--------------------------------------------|--------------------------|-------------|-----------------------------·
|    Solc version: 0.8.24                    ·  Optimizer enabled: true ·  Runs: 200  ·  Block limit: 30000000 gas  │
·············································|··························|·············|······························
|  Methods                                                                                                           │
························|····················|·············|·············|·············|···············|··············
|  Contract             ·  Method            ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
························|····················|·············|·············|·············|···············|··············
|  QuantumPrivacyCompute·  submitQuantumJob  ·     123456  ·     234567  ·     178902  ·           10  ·       0.50  │
························|····················|·············|·············|·············|···············|··············
```

## Best Practices

### Development

1. **Always test locally first**
   ```bash
   npm run deploy:local
   npm run simulate
   ```

2. **Run full test suite before deployment**
   ```bash
   npm test
   npm run test:coverage
   ```

3. **Verify contracts immediately**
   ```bash
   npm run deploy:sepolia
   npm run verify:sepolia
   ```

### Security

1. **Never commit private keys**
   - Use `.env` file (already in `.gitignore`)
   - Use separate wallets for testnet/mainnet

2. **Verify deployment info**
   - Check `deployments/latest.json`
   - Verify contract on Etherscan
   - Test contract interactions

3. **Monitor gas usage**
   ```bash
   REPORT_GAS=true npm test
   ```

### Code Quality

1. **Format before commit**
   ```bash
   npm run format
   npm run lint:fix
   ```

2. **Check coverage**
   ```bash
   npm run test:coverage
   ```

3. **Use TypeChain for type safety**
   ```bash
   npm run typechain
   ```

## Troubleshooting

### Common Issues

#### Compilation Errors

```bash
# Clean and recompile
npm run clean
npm run compile
```

#### Network Issues

```bash
# Check RPC connection
curl -X POST $SEPOLIA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

#### Deployment Failures

```bash
# Check balance
npx hardhat run scripts/checkBalance.ts --network sepolia

# Verify network config
npx hardhat config
```

#### Verification Issues

```bash
# Wait and retry
npm run verify:sepolia

# Manual verification
npx hardhat verify --network sepolia 0xADDRESS
```

## NPM Scripts Reference

### Core Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm run clean` | Clean artifacts and cache |
| `npm test` | Run test suite |
| `npm run node` | Start local Hardhat node |

### Deployment

| Command | Description |
|---------|-------------|
| `npm run deploy:local` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run deploy:zama` | Deploy to Zama Sepolia |

### Verification

| Command | Description |
|---------|-------------|
| `npm run verify:sepolia` | Verify on Etherscan |

### Interaction

| Command | Description |
|---------|-------------|
| `npm run interact:local` | Interact with local contract |
| `npm run interact:sepolia` | Interact with Sepolia contract |
| `npm run simulate` | Run complete simulation |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run format` | Format code |
| `npm run lint` | Lint Solidity |
| `npm run test:coverage` | Test coverage report |
| `npm run test:gas` | Gas usage report |

## Additional Resources

- **Hardhat Documentation**: https://hardhat.org/docs
- **Ethers.js v6**: https://docs.ethers.org/v6/
- **Zama FHE**: https://docs.zama.ai/
- **Sepolia Testnet**: https://sepolia.dev/
- **Project README**: See README.md
- **Deployment Guide**: See DEPLOYMENT.md

## Support

For issues and questions:
- Check existing documentation
- Review Hardhat documentation
- Open GitHub issue
- Review test files for examples
