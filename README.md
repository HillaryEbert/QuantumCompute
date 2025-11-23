# ⚛️ Quantum Privacy Computing Platform

A cutting-edge confidential quantum computing platform leveraging Fully Homomorphic Encryption (FHE) technology to enable secure quantum computation on encrypted data.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-blue.svg)](https://sepolia.etherscan.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)

## 🌟 New Features

### Gateway Callback Pattern
- **Asynchronous Processing**: User submits → Contract records → Gateway decrypts → Callback completes
- **Non-blocking Operations**: Jobs processed asynchronously via Gateway
- **Secure Decryption**: Gateway handles sensitive decryption operations

### Refund Mechanism
- **Automatic Refunds**: Automatic refunds on decryption failures
- **Timeout Protection**: Prevents permanent fund locking (1 hour timeout + 24 hour grace period)
- **Manual Claims**: Users can claim accumulated refunds anytime
- **Job Fee Protection**: 0.001 ether minimum fee with full refund guarantee

### Privacy Protection
- **Division Privacy**: Random multipliers prevent information leakage in division operations
- **Price Obfuscation**: Unique random factors hide price patterns
- **No Data Exposure**: True values never revealed during computation

### Security Enhancements
- **Input Validation**: Comprehensive parameter checking on all functions
- **Access Control**: Multi-level role-based permissions (Owner, Authorized Nodes, Users)
- **Overflow Protection**: Built-in Solidity 0.8+ overflow/underflow protection
- **Audit Trail**: Complete event logging for all operations
- **Reentrancy Protection**: Checks-Effects-Interactions pattern

### Gas Optimization
- **HCU Efficiency**: Optimized Homomorphic Computation Unit usage
- **Storage Patterns**: Efficient struct packing and storage layout
- **Batch Operations**: Support for future batch processing

---

## 🎬 Demo

**Video Demonstration**: [demo.mp4](https://youtu.be/SjgPjlCYDDY)

**Live Application**: [https://hillaryebert.github.io/QuantumCompute/](https://hillaryebert.github.io/QuantumCompute/)

**GitHub Repository**: [https://github.com/HillaryEbert/QuantumCompute/](https://github.com/HillaryEbert/QuantumCompute/)

---

## 📸 Screenshots

### Application Interface
![Application Interface](image1.png)

### Quantum State Visualization
![Quantum Computing Interface](image2.png)

---

## 🚀 Core Concepts

### Privacy Quantum Computing

Privacy Quantum Computing represents the convergence of quantum computation and fully homomorphic encryption, enabling computation on quantum states while maintaining complete data confidentiality. This platform demonstrates:

- **Encrypted Quantum States**: Initialize and manipulate quantum states that remain encrypted throughout their lifecycle
- **Confidential Quantum Algorithms**: Execute complex quantum algorithms without revealing input data or intermediate computational states
- **Secure Multi-Party Quantum Computation**: Create quantum entanglements between multiple parties while maintaining privacy
- **Zero-Knowledge Quantum Operations**: Perform quantum gate operations and measurements on encrypted quantum states

### Gateway Callback Architecture

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│  User   │─────▶│ Contract │─────▶│ Gateway │─────▶│ Callback │
└─────────┘      └──────────┘      └─────────┘      └──────────┘
     │                 │                  │                │
     │  Submit Job     │  Record State    │  Decrypt       │
     │────────────────▶│─────────────────▶│───────────────▶│
     │                 │                  │                │
     │                 │◀─────────────────┴────────────────│
     │◀────────────────│  Complete Transaction             │
```

### Confidential Quantum Applications

This platform showcases practical applications of privacy-preserving quantum computing:

1. **Private Quantum State Initialization**: Create quantum superposition states with encrypted amplitudes
2. **Secure Quantum Algorithm Execution**: Run Shor's algorithm, Grover's search, VQE, QAOA, and quantum machine learning on encrypted inputs
3. **Confidential Quantum Circuit Design**: Build custom quantum circuits with encrypted parameters
4. **Private Quantum Entanglement**: Establish quantum correlations between encrypted states
5. **Protected Quantum Measurement**: Retrieve quantum computation results while maintaining input privacy

---

## 🔐 Technical Architecture

### Fully Homomorphic Encryption (FHE)

The platform utilizes FHE to enable computation on encrypted quantum state representations:

- **Quantum State Encryption**: Each quantum amplitude is encrypted using FHE, allowing mathematical operations without decryption
- **Homomorphic Quantum Gates**: Quantum gate operations are performed directly on encrypted amplitudes
- **Private Quantum Measurement**: Measurement outcomes are computed on encrypted states and only decrypted by authorized parties

### Smart Contract Infrastructure

The platform deploys Ethereum smart contracts that:

- Manage encrypted quantum state storage
- Coordinate quantum algorithm execution via Gateway callbacks
- Facilitate quantum entanglement between users
- Track quantum computation history
- Ensure access control and privacy guarantees
- Provide automatic refunds and timeout protection

### Supported Quantum Algorithms

- **Shor's Algorithm**: Quantum integer factorization for cryptographic applications
- **Grover's Search**: Quadratic speedup for unstructured search problems
- **Variational Quantum Eigensolver (VQE)**: Quantum chemistry and materials science
- **Quantum Approximate Optimization Algorithm (QAOA)**: Combinatorial optimization
- **Quantum Machine Learning**: Privacy-preserving quantum neural networks
- **Custom Quantum Circuits**: User-defined quantum gate sequences

---

## 🛠️ Features

### For End Users

- **MetaMask Integration**: Seamless wallet connection for quantum operations
- **Interactive Quantum State Control**: Visual interface for configuring quantum amplitudes
- **Real-Time Algorithm Execution**: Submit and execute quantum jobs with live status tracking
- **Quantum Circuit Builder**: Drag-and-drop interface for custom circuit design
- **Quantum Entanglement Manager**: Create and manage quantum correlations with other users
- **Computation History**: Track all quantum jobs with detailed analytics
- **Automatic Refunds**: Get refunds for failed or timed-out jobs
- **Job Status Tracking**: Monitor job progress through all stages

### For Developers

- **Universal SDK**: Compatible with React, Vue, Next.js, and vanilla JavaScript
- **Smart Contract ABI**: Full access to quantum computing contract methods
- **Event Monitoring**: Real-time blockchain events for quantum operations
- **Gas Optimization**: Efficient contract design for minimal transaction costs
- **Extensible Architecture**: Easy integration with existing blockchain applications
- **Comprehensive Documentation**: Full API reference and architecture docs

---

## 📦 Installation & Setup

### Prerequisites

- Node.js v16 or higher
- MetaMask browser extension
- Sepolia testnet ETH (obtain from faucet)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/HillaryEbert/QuantumCompute.git
cd QuantumCompute

# Install dependencies
npm install

# Compile smart contracts
npm run build:contracts

# Start the application
npm start
```

The application will be available at `http://localhost:8080`

### Deployment

To deploy your own instance:

```bash
# Configure environment variables
cp .env.example .env
# Edit .env with your settings

# Deploy to Sepolia
npm run deploy:sepolia

# Deploy to local network
npm run deploy:local
```

---

## 🎯 Usage Guide

### 1. Connect Your Wallet

Click "Connect Wallet" and approve the MetaMask connection. Ensure you're on the Sepolia testnet.

### 2. Initialize Quantum State

1. Select the number of qubits (1-8)
2. Configure quantum amplitudes for each basis state
3. Click "Initialize State" to create your encrypted quantum state

### 3. Execute Quantum Algorithms with Gateway Pattern

1. Choose an algorithm from the algorithm grid:
   - **Shor's Algorithm** (Type 0): Integer factorization
   - **Grover's Search** (Type 1): Unstructured search
   - **VQE** (Type 2): Quantum chemistry
   - **QAOA** (Type 3): Optimization
   - **Quantum ML** (Type 4): Machine learning
   - **Custom Circuit** (Type 5): User-defined

2. Enter encrypted input data (0-255)

3. Submit job with payment (minimum 0.001 ether):
   ```javascript
   await contract.submitQuantumJob(encryptedInput, algorithmType, {
     value: ethers.utils.parseEther("0.001")
   });
   ```

4. Authorized node executes algorithm:
   ```javascript
   await contract.executeQuantumAlgorithm(jobId);
   ```

5. Request decryption via Gateway:
   ```javascript
   const requestId = await contract.requestJobDecryption(jobId);
   ```

6. Gateway processes and calls back:
   - Contract automatically receives decrypted result
   - Job status updated to Completed
   - Result available to retrieve

7. View results:
   ```javascript
   const result = await contract.getJobResult(jobId);
   ```

### 4. Refund Management

**Check Pending Refunds**:
```javascript
const pendingAmount = await contract.getPendingRefund(userAddress);
console.log(`Pending refunds: ${ethers.utils.formatEther(pendingAmount)} ETH`);
```

**Claim Refunds**:
```javascript
await contract.claimRefund();
```

**Manual Refund Request** (for timed-out jobs):
```javascript
await contract.requestRefund(jobId);
```

### 5. Privacy-Preserving Operations

**Division with Privacy Protection**:
```javascript
const result = await contract.privacyDivision(numerator, denominator);
```

**Price Obfuscation**:
```javascript
// Obfuscate
const obfuscatedPrice = await contract.obfuscatePrice(price, priceId);

// De-obfuscate
const originalPrice = await contract.deobfuscatePrice(priceId);
```

### 6. Design Custom Circuits

1. Enter a circuit ID
2. Add quantum gates (H, CNOT, X, Z, Phase)
3. Specify target and control qubits
4. Click "Compile Circuit" to finalize:
   ```javascript
   await contract.compileQuantumCircuit(
     circuitId,
     gateTypes,
     targetQubits,
     controlQubits
   );
   ```

### 7. Create Quantum Entanglement

1. Enter a partner's Ethereum address
2. Click "Create Entanglement":
   ```javascript
   await contract.createEntanglement(partnerAddress);
   ```
3. Both parties can now perform correlated quantum measurements

---

## 🔬 Technical Specifications

### Quantum State Representation

- **Qubit Range**: 1-8 qubits (due to euint8 type)
- **State Vector Size**: 2^n amplitudes (n = number of qubits)
- **Amplitude Precision**: 8-bit unsigned integers (0-255)
- **Normalization**: Automatic amplitude normalization to preserve quantum mechanics

### Timeout Configuration

- **Execution Timeout**: 1 hour (JOB_TIMEOUT)
- **Refund Grace Period**: 24 hours (REFUND_WINDOW)
- **Total Protection Window**: 25 hours

### Fee Structure

- **Minimum Job Fee**: 0.001 ether (MIN_JOB_FEE)
- **Refund Policy**: 100% refund on timeout or failure
- **Fee Withdrawal**: Owner can withdraw accumulated fees

### Privacy Parameters

- **Random Multiplier Range**: 1000-10000
- **Obfuscation Method**: Multiplicative factor
- **De-obfuscation**: Stored mapping for reversal

### Supported Quantum Gates

- **Hadamard (H)**: Creates superposition
- **Controlled-NOT (CNOT)**: Entanglement gate
- **Pauli-X**: Bit flip
- **Pauli-Z**: Phase flip
- **Phase Gate**: Arbitrary phase rotation

---

## 📚 Documentation

### Main Documentation

- [README.md](README.md) - This file
- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed architecture documentation
- [API Reference](ARCHITECTURE.md#api-reference) - Complete API documentation

### Quick Links

- [Gateway Callback Pattern](ARCHITECTURE.md#gateway-callback-pattern)
- [Refund Mechanism](ARCHITECTURE.md#refund-mechanism)
- [Timeout Protection](ARCHITECTURE.md#timeout-protection)
- [Privacy Techniques](ARCHITECTURE.md#privacy-protection-techniques)
- [Security Features](ARCHITECTURE.md#security-features)
- [Gas Optimization](ARCHITECTURE.md#gas-optimization)

---

## 🔒 Security & Privacy

### Privacy Guarantees

- **Data Confidentiality**: All quantum states and inputs remain encrypted end-to-end
- **Computation Privacy**: Intermediate quantum states are never revealed
- **Result Privacy**: Only authorized users can decrypt computation results
- **Access Control**: Quantum states are tied to user addresses
- **Division Privacy**: Random multipliers prevent information leakage
- **Price Privacy**: Obfuscation hides price patterns

### Security Features

- **Input Validation**: All parameters validated before processing
- **Access Control**: Multi-level permissions (Owner, Nodes, Users)
- **Overflow Protection**: Solidity 0.8+ automatic checks
- **Reentrancy Protection**: Checks-Effects-Interactions pattern
- **Audit Trail**: Complete event logging
- **Timeout Protection**: Prevents permanent fund locking
- **Automatic Refunds**: User fund protection

### Security Considerations

- **Smart Contract Auditing**: Contracts should be professionally audited before mainnet deployment
- **Key Management**: Users must securely manage their private keys
- **Network Security**: Always verify you're connected to the correct network
- **Gas Limits**: Complex quantum circuits may require higher gas limits
- **Gateway Trust**: Security depends on Gateway contract implementation

---

## 🌐 Network Information

### Sepolia Testnet

- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/
- **Block Explorer**: https://sepolia.etherscan.io/

### Faucets

- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Sepolia Faucet 2](https://www.alchemy.com/faucets/ethereum-sepolia)

---

## 💻 Development

### Development Setup

```bash
# Clone the repository
git clone https://github.com/HillaryEbert/QuantumCompute.git

# Install dependencies
npm install

# Run tests
npm test

# Run local blockchain
npx hardhat node

# Deploy to local network
npm run deploy:local
```

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/QuantumPrivacyCompute.test.ts

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run coverage
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Zama for pioneering Fully Homomorphic Encryption technology
- Ethereum community for blockchain infrastructure
- Quantum computing researchers for theoretical foundations

---

## 📞 Contact & Support

- **Email**: support@quantumprivacy.io
- **Issues**: [GitHub Issues](https://github.com/HillaryEbert/QuantumCompute/issues)

---

## 🗺️ Roadmap

### Phase 1 (Completed ✅)
- ✅ Basic quantum state management
- ✅ Core quantum algorithms implementation
- ✅ Smart contract deployment
- ✅ Web interface
- ✅ Gateway callback pattern
- ✅ Refund mechanism
- ✅ Timeout protection
- ✅ Privacy protection techniques
- ✅ Enhanced security features

### Phase 2 (In Progress 🔄)
- 🔄 Quantum error correction
- 🔄 Advanced quantum algorithms
- 🔄 Multi-qubit entanglement (>8 qubits)
- 🔄 Performance optimization
- 🔄 Batch job processing
- 🔄 Dynamic pricing

### Phase 3 (Planned 📋)
- 📋 Quantum machine learning models
- 📋 Cross-chain quantum computation
- 📋 Quantum state marketplace
- 📋 Mobile application
- 📋 Oracle integration
- 📋 Advanced circuit builder

---

## 🔬 Research Applications

This platform enables research in:

- **Quantum Chemistry**: Molecular simulation with private proprietary data
- **Drug Discovery**: Confidential pharmaceutical compound analysis
- **Financial Modeling**: Private quantum optimization for trading strategies
- **Machine Learning**: Privacy-preserving quantum neural networks
- **Cryptography**: Post-quantum cryptographic research

---

## 💡 Use Cases

### Enterprise Applications

- **Healthcare**: Private patient genome analysis using quantum algorithms
- **Finance**: Confidential portfolio optimization with quantum computing
- **Supply Chain**: Private logistics optimization using QAOA
- **Telecommunications**: Secure quantum key distribution

### Academic Research

- **Physics**: Confidential simulation of quantum systems
- **Mathematics**: Private execution of quantum number theory algorithms
- **Computer Science**: Research in quantum complexity theory with proprietary datasets

---

## ⚡ Performance Metrics

- **State Initialization**: ~2-3 seconds (8 qubits)
- **Algorithm Execution**: ~5-10 seconds (depending on complexity)
- **Circuit Compilation**: ~3-5 seconds
- **Entanglement Creation**: ~2-3 seconds
- **Decryption Request**: ~2-5 seconds
- **Gateway Callback**: ~10-30 seconds

### Gas Costs (Approximate)

- **Initialize State**: ~150,000 gas
- **Submit Job**: ~120,000 gas
- **Execute Algorithm**: ~200,000 gas
- **Request Decryption**: ~100,000 gas
- **Compile Circuit**: ~180,000 gas
- **Claim Refund**: ~50,000 gas

---

## 🛡️ Disclaimer

This platform is for educational and research purposes. While it demonstrates privacy-preserving quantum computing concepts, it should not be used for production applications without thorough security auditing and proper risk assessment. Quantum computing and homomorphic encryption are rapidly evolving fields, and this implementation represents current best practices but may require updates as the technology advances.

**Important**: Always use testnet for experimentation. Never deploy to mainnet without professional security audit.

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

**Built with ❤️ for the quantum and blockchain communities**

*Enabling private quantum computation for everyone*
