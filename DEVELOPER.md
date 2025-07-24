# 👨‍💻 Developer Guide

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Smart Contract Layer](#smart-contract-layer)
- [Development Workflow](#development-workflow)
- [API Reference](#api-reference)
- [Testing Guidelines](#testing-guidelines)
- [Deployment Process](#deployment-process)
- [Integration Guide](#integration-guide)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  HTML/CSS/JS │  │   Next.js    │  │    React     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Ethers.js     │
                    │  MetaMask SDK   │
                    └────────┬────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                   Blockchain Layer                          │
│                   ┌────────▼────────┐                       │
│                   │  Smart Contract │                       │
│                   │ QuantumPrivacy  │                       │
│                   │    Compute      │                       │
│                   └────────┬────────┘                       │
│                            │                                │
│  ┌──────────────────┬──────┴─────┬──────────────────┐     │
│  ▼                  ▼            ▼                  ▼     │
│ State            Jobs        Circuits         Entangle    │
│ Management                                                 │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Smart Contracts**: Solidity 0.8.24
- **Development Framework**: Hardhat
- **Testing**: Hardhat + Chai + TypeScript
- **Type Generation**: TypeChain (Ethers v6)
- **Web3 Library**: Ethers.js v6
- **Frontend**: HTML5/CSS3/JavaScript, Next.js (optional)
- **Wallet**: MetaMask integration
- **Network**: Ethereum Sepolia Testnet

## Smart Contract Layer

### Contract Structure

```solidity
contract QuantumPrivacyCompute {
    // State Variables
    mapping(address => QuantumState) public quantumStates;
    mapping(uint256 => QuantumJob) public quantumJobs;
    mapping(uint256 => QuantumCircuit) public quantumCircuits;
    mapping(address => address) public entanglements;

    // Core Functions
    function initializeQuantumState(...) external
    function submitQuantumJob(...) external returns (uint256)
    function executeQuantumAlgorithm(...) external
    function compileQuantumCircuit(...) external
    function createEntanglement(...) external

    // Query Functions
    function getQuantumStateInfo(...) external view
    function getJobInfo(...) external view
    function getUserJobHistory(...) external view
}
```

### Data Structures

#### QuantumState

```solidity
struct QuantumState {
    uint8[] amplitudes;      // Quantum amplitudes (0-255)
    uint8 qubitCount;        // Number of qubits (1-3)
    bool isInitialized;      // Initialization status
    bool isEntangled;        // Entanglement status
    uint256 timestamp;       // Creation time
}
```

#### QuantumJob

```solidity
struct QuantumJob {
    address submitter;       // Job creator
    uint8 encryptedInput;    // Encrypted input data
    uint8 algorithmType;     // Algorithm identifier
    bool isCompleted;        // Completion status
    bool isVerified;         // Verification status
    uint256 submitTime;      // Submission timestamp
    uint256 completeTime;    // Completion timestamp
    uint256 gasUsed;         // Gas consumed
    bytes result;            // Computation result
}
```

#### QuantumCircuit

```solidity
struct QuantumCircuit {
    uint8[] gateTypes;       // Gate type identifiers
    uint8[] targetQubits;    // Target qubit indices
    uint8[] controlQubits;   // Control qubit indices
    bool isCompiled;         // Compilation status
    uint256 timestamp;       // Creation time
}
```

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone https://github.com/HillaryEbert/QuantumCompute.git
cd QuantumCompute

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Compile contracts
npm run compile
```

### Development Cycle

```bash
# 1. Make changes to contracts/QuantumPrivacyCompute.sol

# 2. Compile
npm run compile

# 3. Run tests
npm test

# 4. Check gas usage
npm run test:gas

# 5. Generate types
npm run typechain

# 6. Deploy to local network
npm run node          # Terminal 1
npm run deploy:local  # Terminal 2

# 7. Test integration
npm run demo
```

### Code Quality

```bash
# Format code
npm run format

# Lint Solidity
npm run lint

# Check formatting
npm run format:check

# Clean build artifacts
npm run clean
```

## API Reference

### State Management

#### initializeQuantumState

```solidity
/**
 * @notice Initialize encrypted quantum state
 * @param amplitudes Array of quantum amplitudes (0-255)
 * @param qubitCount Number of qubits (1-3)
 * @dev Emits StateInitialized event
 */
function initializeQuantumState(
    uint8[] memory amplitudes,
    uint8 qubitCount
) external
```

**Usage Example:**

```javascript
const amplitudes = [128, 128, 0, 0]; // 2-qubit state
const qubitCount = 2;

const tx = await contract.initializeQuantumState(amplitudes, qubitCount);
await tx.wait();
```

### Job Management

#### submitQuantumJob

```solidity
/**
 * @notice Submit quantum computation job
 * @param encryptedInput Encrypted input data (0-255)
 * @param algorithmType Algorithm identifier (1-5)
 * @return jobId Unique job identifier
 * @dev Requires initialized quantum state
 */
function submitQuantumJob(
    uint8 encryptedInput,
    uint8 algorithmType
) external returns (uint256 jobId)
```

**Algorithm Types:**

1. Shor's Algorithm (factorization)
2. Grover's Search
3. VQE (Variational Quantum Eigensolver)
4. QAOA (Quantum Approximate Optimization)
5. Quantum Machine Learning

**Usage Example:**

```javascript
const encryptedInput = 15;
const algorithmType = 1; // Shor's

const tx = await contract.submitQuantumJob(encryptedInput, algorithmType);
const receipt = await tx.wait();

// Get job ID from events
const event = receipt.events.find(e => e.event === 'JobSubmitted');
const jobId = event.args.jobId;
```

#### executeQuantumAlgorithm

```solidity
/**
 * @notice Execute quantum algorithm
 * @param jobId Job identifier
 * @dev Only job owner can execute
 * @dev Emits AlgorithmExecuted event
 */
function executeQuantumAlgorithm(uint256 jobId) external
```

**Usage Example:**

```javascript
await contract.executeQuantumAlgorithm(jobId);

// Get results
const jobInfo = await contract.getJobInfo(jobId);
const result = await contract.getJobResult(jobId);
```

### Circuit Compilation

#### compileQuantumCircuit

```solidity
/**
 * @notice Compile custom quantum circuit
 * @param circuitId Circuit identifier
 * @param gateTypes Array of gate types (1-5)
 * @param targetQubits Target qubit indices
 * @param controlQubits Control qubit indices (0 = no control)
 * @dev All arrays must have same length
 */
function compileQuantumCircuit(
    uint256 circuitId,
    uint8[] memory gateTypes,
    uint8[] memory targetQubits,
    uint8[] memory controlQubits
) external
```

**Gate Types:**

1. Hadamard (H)
2. CNOT (Controlled-NOT)
3. Pauli-X
4. Pauli-Z
5. Phase Gate

**Usage Example:**

```javascript
const circuitId = 1;
const gateTypes = [1, 2, 3];     // H, CNOT, X
const targetQubits = [0, 1, 0];
const controlQubits = [0, 0, 0]; // 0 means no control

await contract.compileQuantumCircuit(
    circuitId,
    gateTypes,
    targetQubits,
    controlQubits
);
```

### Entanglement

#### createEntanglement

```solidity
/**
 * @notice Create quantum entanglement with another user
 * @param partner Address to entangle with
 * @dev Both users must have initialized states
 * @dev Cannot entangle with self
 */
function createEntanglement(address partner) external
```

**Usage Example:**

```javascript
const partnerAddress = "0x...";
await contract.createEntanglement(partnerAddress);

// Check status
const stateInfo = await contract.getQuantumStateInfo(userAddress);
console.log("Entangled:", stateInfo.isEntangled);
```

### Query Functions

#### getQuantumStateInfo

```solidity
/**
 * @notice Get quantum state information
 * @param user User address
 * @return qubitCount Number of qubits
 * @return isEntangled Entanglement status
 * @return timestamp Creation time
 */
function getQuantumStateInfo(address user)
    external view
    returns (uint8 qubitCount, bool isEntangled, uint256 timestamp)
```

#### getJobInfo

```solidity
/**
 * @notice Get job information
 * @param jobId Job identifier
 * @return submitter Job creator
 * @return algorithmType Algorithm used
 * @return isCompleted Completion status
 * @return gasUsed Gas consumed
 */
function getJobInfo(uint256 jobId)
    external view
    returns (
        address submitter,
        uint8 algorithmType,
        bool isCompleted,
        uint256 gasUsed
    )
```

#### getUserJobHistory

```solidity
/**
 * @notice Get user's job history
 * @param user User address
 * @return Array of job IDs
 */
function getUserJobHistory(address user)
    external view
    returns (uint256[] memory)
```

## Testing Guidelines

### Test Structure

```typescript
describe("QuantumPrivacyCompute", function () {
    let contract: any;
    let owner: SignerWithAddress;

    beforeEach(async function () {
        // Deploy fresh contract for each test
        const Contract = await ethers.getContractFactory("QuantumPrivacyCompute");
        contract = await Contract.deploy();
        await contract.waitForDeployment();
    });

    describe("Feature Name", function () {
        it("Should do something", async function () {
            // Arrange
            const input = "test data";

            // Act
            const result = await contract.someFunction(input);

            // Assert
            expect(result).to.equal(expectedValue);
        });
    });
});
```

### Writing Tests

1. **Test Happy Paths**: Normal operation scenarios
2. **Test Edge Cases**: Boundary conditions
3. **Test Failures**: Error conditions and reverts
4. **Test Events**: Verify event emissions
5. **Test Gas**: Monitor gas usage
6. **Test Security**: Access control and permissions

### Running Specific Tests

```bash
# Run specific test file
npx hardhat test test/QuantumPrivacyCompute.test.ts

# Run specific test suite
npx hardhat test --grep "Quantum State Initialization"

# Run single test
npx hardhat test --grep "Should initialize quantum state"
```

## Deployment Process

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Gas optimizations completed
- [ ] Security review completed
- [ ] Environment variables configured
- [ ] Sufficient ETH for deployment
- [ ] Network configuration verified

### Deployment Steps

```bash
# 1. Configure .env
PRIVATE_KEY=your_key
SEPOLIA_RPC_URL=your_rpc_url
ETHERSCAN_API_KEY=your_api_key

# 2. Test deployment locally
npm run node
npm run deploy:local

# 3. Deploy to Sepolia
npm run deploy:sepolia

# 4. Verify contract
npm run verify:sepolia <CONTRACT_ADDRESS>

# 5. Update frontend configuration
# Edit frontend .env with new contract address
```

### Post-Deployment

1. Verify contract on Etherscan
2. Test all functions on testnet
3. Update documentation with new address
4. Monitor initial transactions
5. Set up monitoring/alerts

## Integration Guide

### Frontend Integration

#### Using Ethers.js

```javascript
import { ethers } from 'ethers';

// Connect to provider
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Load contract
const contractAddress = "0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2";
const abi = [...]; // Load from artifacts

const contract = new ethers.Contract(contractAddress, abi, signer);

// Initialize state
const tx = await contract.initializeQuantumState([128, 128, 0, 0], 2);
await tx.wait();

// Listen to events
contract.on("StateInitialized", (user, qubitCount) => {
    console.log(`State initialized for ${user} with ${qubitCount} qubits`);
});
```

#### Using Web3Modal

```javascript
import Web3Modal from 'web3modal';

const web3Modal = new Web3Modal({
    network: "sepolia",
    cacheProvider: true,
});

const instance = await web3Modal.connect();
const provider = new ethers.BrowserProvider(instance);
const signer = await provider.getSigner();

// Use contract as above
```

### Backend Integration

```javascript
import { ethers } from 'ethers';

// Connect to Infura/Alchemy
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Load wallet
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load contract
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Interact with contract
const jobHistory = await contract.getUserJobHistory(userAddress);
```

## Best Practices

### Smart Contract Development

1. **Use Latest Solidity**: Version 0.8.24+ for security
2. **Enable Optimizer**: Set runs to 200 for deployment
3. **Validate Inputs**: Check all parameters
4. **Emit Events**: Log all state changes
5. **Use Modifiers**: For access control
6. **Gas Optimization**: Minimize storage operations
7. **Comment Code**: Use NatSpec format

### Testing

1. **Test Coverage**: Aim for 100%
2. **Edge Cases**: Test boundaries
3. **Error Messages**: Verify revert reasons
4. **Gas Monitoring**: Track gas usage
5. **Integration Tests**: Test full flows
6. **Continuous Testing**: Run on every commit

### Security

1. **Access Control**: Restrict sensitive functions
2. **Input Validation**: Check all inputs
3. **Reentrancy**: Use checks-effects-interactions
4. **Integer Overflow**: Use Solidity 0.8+
5. **External Calls**: Be cautious
6. **Private Keys**: Never commit
7. **Audits**: Get professional review

## Troubleshooting

### Common Issues

#### Contract Won't Compile

```bash
# Solution
npm run clean
npm install
npm run compile
```

#### Tests Failing

```bash
# Check Hardhat network
npx hardhat clean
npm test

# Run with verbose output
npm run test:verbose
```

#### Deployment Fails

```bash
# Check balance
npx hardhat accounts

# Verify network
npx hardhat run scripts/checkBalance.ts

# Try local first
npm run deploy:local
```

#### Gas Estimation Error

- Increase gas limit in hardhat.config.ts
- Check transaction parameters
- Verify network gas prices

#### MetaMask Issues

- Switch to correct network
- Clear cache
- Reimport account
- Check sufficient balance

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethereum Development](https://ethereum.org/developers)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

- GitHub Issues: [Report bugs](https://github.com/HillaryEbert/QuantumCompute/issues)
- Discussions: [Ask questions](https://github.com/HillaryEbert/QuantumCompute/discussions)
- Email: support@quantumprivacy.io

---

**Happy coding! 🚀**
