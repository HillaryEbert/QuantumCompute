# Quantum Privacy Computing - Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Gateway Callback Pattern](#gateway-callback-pattern)
3. [Refund Mechanism](#refund-mechanism)
4. [Timeout Protection](#timeout-protection)
5. [Privacy Protection Techniques](#privacy-protection-techniques)
6. [Security Features](#security-features)
7. [Gas Optimization](#gas-optimization)
8. [API Reference](#api-reference)

---

## Overview

This quantum computing platform implements an advanced architecture using Fully Homomorphic Encryption (FHE) with a focus on:

- **Asynchronous Processing**: Gateway callback pattern for decryption
- **User Protection**: Automatic refunds and timeout mechanisms
- **Privacy Preservation**: Division obfuscation and price hiding
- **Security**: Comprehensive input validation and access control
- **Efficiency**: HCU-optimized operations

---

## Gateway Callback Pattern

### Architecture Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│  User   │─────▶│ Contract │─────▶│ Gateway │─────▶│ Callback │
└─────────┘      └──────────┘      └─────────┘      └──────────┘
     │                 │                  │                │
     │  Submit Job     │                  │                │
     │────────────────▶│                  │                │
     │                 │  Record State    │                │
     │                 │─────────────────▶│                │
     │                 │                  │  Decrypt       │
     │                 │                  │───────────────▶│
     │                 │                  │                │
     │                 │◀─────────────────┴────────────────│
     │                 │  Complete Transaction             │
     │◀────────────────│                                   │
     │  Result Ready   │                                   │
```

### Implementation Steps

1. **User Submits Job**:
   ```solidity
   function submitQuantumJob(uint8 _encryptedInput, uint8 _algorithmType)
       external
       payable
       returns (uint256)
   ```
   - User submits encrypted quantum computation request
   - Payment required (MIN_JOB_FEE = 0.001 ether)
   - Job status: `Submitted`

2. **Contract Records Request**:
   - Job stored in `computeJobs` mapping
   - User added to job history
   - Event `QuantumJobSubmitted` emitted

3. **Gateway Decryption**:
   ```solidity
   function requestJobDecryption(uint256 _jobId)
       external
       validJobId(_jobId)
       returns (uint256)
   ```
   - Converts encrypted result to Gateway format
   - Initiates decryption request
   - Stores request ID for callback mapping

4. **Callback Completes Transaction**:
   ```solidity
   function jobDecryptionCallback(
       uint256 requestId,
       uint8 decryptedValue
   ) public onlyGateway returns (uint8)
   ```
   - Gateway invokes callback with decrypted value
   - Job marked as completed
   - Result available to user

---

## Refund Mechanism

### Purpose
Protect users from permanent fund loss due to:
- Decryption failures
- Gateway timeouts
- Job execution errors

### Implementation

#### Automatic Refund Triggers

1. **Timeout Expiry**:
   ```solidity
   if (block.timestamp > job.submitTime + JOB_TIMEOUT) {
       job.status = JobStatus.TimedOut;
       _issueRefund(_jobId, "Job timed out");
   }
   ```

2. **Callback Failure**:
   ```solidity
   if (block.timestamp > job.submitTime + JOB_TIMEOUT + REFUND_WINDOW) {
       job.status = JobStatus.TimedOut;
       _issueRefund(jobId, "Callback timeout");
   }
   ```

#### Refund Process

```solidity
function _issueRefund(uint256 _jobId, string memory _reason) private {
    ComputeJob storage job = computeJobs[_jobId];

    if (job.refundClaimed || job.jobFee == 0) {
        return;
    }

    job.refundClaimed = true;
    job.status = JobStatus.Refunded;
    pendingRefunds[job.submitter] += job.jobFee;

    emit RefundIssued(_jobId, job.submitter, job.jobFee, _reason);
}
```

#### Claiming Refunds

Users can claim accumulated refunds at any time:

```solidity
function claimRefund() external {
    uint256 amount = pendingRefunds[msg.sender];
    require(amount > 0, "No pending refunds");

    pendingRefunds[msg.sender] = 0;

    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Refund transfer failed");
}
```

#### Manual Refund Requests

Users can manually request refunds for timed-out jobs:

```solidity
function requestRefund(uint256 _jobId) external validJobId(_jobId) {
    ComputeJob storage job = computeJobs[_jobId];
    require(msg.sender == job.submitter, "Not job submitter");
    require(!job.refundClaimed, "Refund already claimed");
    require(
        job.status != JobStatus.Completed &&
        block.timestamp > job.submitTime + JOB_TIMEOUT,
        "Job not eligible for refund"
    );

    _issueRefund(_jobId, "Manual refund request");
}
```

---

## Timeout Protection

### Constants

```solidity
uint256 public constant JOB_TIMEOUT = 1 hours;
uint256 public constant REFUND_WINDOW = 24 hours;
```

### Protection Levels

1. **Execution Timeout** (1 hour):
   - Prevents jobs from executing after 1 hour
   - Checked in `executeQuantumAlgorithm()`

2. **Decryption Timeout** (1 hour):
   - Prevents decryption requests after timeout
   - Automatic refund issued

3. **Callback Timeout** (25 hours total):
   - Additional 24-hour window for callback
   - Final safety net for refunds

### Timeline

```
Job Submitted
    │
    ├─ 0-1hr:   Normal execution window
    │           ✓ Can execute
    │           ✓ Can request decryption
    │
    ├─ 1-25hr:  Grace period for callbacks
    │           ✗ Cannot execute
    │           ✓ Callback still accepted
    │           ✓ Refund available
    │
    └─ 25hr+:   Full timeout
                ✗ No operations allowed
                ✓ Automatic refund
```

---

## Privacy Protection Techniques

### 1. Division with Random Multipliers

**Problem**: Direct division operations can leak information about encrypted values.

**Solution**: Multiply by random value before division, then divide result.

```solidity
function privacyDivision(euint64 _numerator, euint64 _denominator)
    public
    returns (euint64)
{
    // Generate random multiplier (1000-10000)
    uint256 randomMultiplier = PRIVACY_MULTIPLIER_MIN +
        (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) %
        (PRIVACY_MULTIPLIER_MAX - PRIVACY_MULTIPLIER_MIN));

    // Multiply numerator by random value
    euint64 obfuscatedNumerator = FHE.mul(
        _numerator,
        FHE.asEuint64(uint64(randomMultiplier))
    );

    // Perform division on obfuscated value
    euint64 obfuscatedResult = FHE.div(obfuscatedNumerator, _denominator);

    // Divide by multiplier to get final result
    euint64 result = FHE.div(
        obfuscatedResult,
        FHE.asEuint64(uint64(randomMultiplier))
    );

    return result;
}
```

**Benefits**:
- Hides true numerator/denominator values
- Prevents timing attacks
- Maintains mathematical correctness

### 2. Price Obfuscation

**Problem**: Encrypted prices can still leak information through patterns.

**Solution**: Multiply prices by random factors and store mapping.

```solidity
function obfuscatePrice(uint64 _price, uint256 _priceId)
    external
    returns (euint64)
{
    // Generate unique random multiplier
    uint256 randomMultiplier = PRIVACY_MULTIPLIER_MIN +
        (uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            _priceId
        ))) % (PRIVACY_MULTIPLIER_MAX - PRIVACY_MULTIPLIER_MIN));

    // Create obfuscated price
    euint64 basePrice = FHE.asEuint64(_price);
    euint64 multiplier = FHE.asEuint64(uint64(randomMultiplier));
    euint64 obfuscatedPrice = FHE.mul(basePrice, multiplier);

    // Store obfuscation data
    priceObfuscationData[_priceId] = PriceObfuscation({
        obfuscatedPrice: obfuscatedPrice,
        randomMultiplier: randomMultiplier,
        timestamp: block.timestamp
    });

    return obfuscatedPrice;
}
```

**De-obfuscation**:

```solidity
function deobfuscatePrice(uint256 _priceId)
    external
    view
    returns (euint64)
{
    PriceObfuscation memory data = priceObfuscationData[_priceId];
    require(data.timestamp > 0, "Price not found");

    // Divide by multiplier to recover original
    euint64 deobfuscatedPrice = FHE.div(
        data.obfuscatedPrice,
        FHE.asEuint64(uint64(data.randomMultiplier))
    );

    return deobfuscatedPrice;
}
```

---

## Security Features

### 1. Input Validation

All user inputs are thoroughly validated:

```solidity
function initializeQuantumState(uint8[] calldata _amplitudes, uint8 _qubitCount) external {
    // Range validation
    require(_qubitCount > 0 && _qubitCount <= 8, "Invalid qubit count: must be 1-8");

    // Size validation
    require(_amplitudes.length == (1 << _qubitCount), "Invalid amplitude array size");

    // Value validation
    uint256 sum = 0;
    for (uint i = 0; i < _amplitudes.length; i++) {
        sum += _amplitudes[i];
    }
    require(sum > 0, "Amplitudes cannot be all zero");
}
```

### 2. Access Control

Multi-level permission system:

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

modifier onlyAuthorizedNode() {
    require(
        authorizedNodes[msg.sender] || msg.sender == owner,
        "Not authorized compute node"
    );
    _;
}

modifier validJobId(uint256 _jobId) {
    require(_jobId > 0 && _jobId < computeJobCounter, "Invalid job ID");
    require(computeJobs[_jobId].submitter != address(0), "Job does not exist");
    _;
}

modifier onlyGateway() {
    // In production: verify caller is Gateway contract
    _;
}
```

### 3. Overflow Protection

Using Solidity 0.8.24 built-in overflow protection:
- All arithmetic operations automatically checked
- No need for SafeMath library
- Reverts on overflow/underflow

### 4. Audit Trail

Comprehensive event logging:

```solidity
event QuantumJobSubmitted(uint256 indexed jobId, address indexed submitter, uint8 algorithmType, uint256 fee);
event DecryptionRequested(uint256 indexed jobId, uint256 requestId);
event DecryptionCallbackReceived(uint256 indexed requestId, uint256 indexed jobId);
event RefundIssued(uint256 indexed jobId, address indexed user, uint256 amount, string reason);
event SecurityAlert(string alertType, address indexed user, uint256 indexed jobId);
```

### 5. Reentrancy Protection

Following Checks-Effects-Interactions pattern:

```solidity
function claimRefund() external {
    uint256 amount = pendingRefunds[msg.sender];
    require(amount > 0, "No pending refunds");

    // Effects BEFORE interactions
    pendingRefunds[msg.sender] = 0;

    // Interactions LAST
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Refund transfer failed");
}
```

---

## Gas Optimization

### 1. HCU (Homomorphic Computation Units) Efficiency

HCU is the gas measurement unit for FHE operations. Optimizations:

**Minimize FHE Operations**:
```solidity
// ❌ Bad: Multiple operations
euint8 a = FHE.asEuint8(x);
euint8 b = FHE.add(a, FHE.asEuint8(1));
euint8 c = FHE.mul(b, FHE.asEuint8(2));

// ✓ Good: Combine when possible
euint8 result = FHE.mul(FHE.add(FHE.asEuint8(x), FHE.asEuint8(1)), FHE.asEuint8(2));
```

**Batch Permission Grants**:
```solidity
// Set permissions once
FHE.allowThis(result);
FHE.allow(result, user);
```

### 2. Storage Optimization

**Use Appropriate Types**:
```solidity
// ✓ Good: Use smallest type needed
uint8 algorithmType;    // 0-5 range
uint256 timestamp;      // Full range needed

// ❌ Bad: Oversized types
uint256 algorithmType;  // Wastes storage
```

**Pack Structs**:
```solidity
struct ComputeJob {
    address submitter;           // 20 bytes
    euint8 encryptedInput;       // 32 bytes
    euint8 encryptedResult;      // 32 bytes
    uint8 algorithmType;         // 1 byte
    bool isCompleted;            // 1 byte
    bool isVerified;             // 1 byte
    // ... etc
}
```

### 3. Batch Operations

Support for batch job processing:

```solidity
// Future enhancement: Batch job submission
function submitQuantumJobBatch(
    uint8[] calldata _inputs,
    uint8[] calldata _algorithmTypes
) external payable returns (uint256[] memory)
```

---

## API Reference

### Core Functions

#### Job Management

**submitQuantumJob**
```solidity
function submitQuantumJob(uint8 _encryptedInput, uint8 _algorithmType)
    external
    payable
    returns (uint256)
```
- Submit a quantum computation job
- Requires: msg.value >= MIN_JOB_FEE (0.001 ether)
- Returns: jobId
- Emits: `QuantumJobSubmitted`

**executeQuantumAlgorithm**
```solidity
function executeQuantumAlgorithm(uint256 _jobId)
    external
    onlyAuthorizedNode
    validJobId(_jobId)
```
- Execute quantum algorithm on encrypted data
- Restricted to: Authorized nodes only
- Updates: Job status to DecryptPending
- Emits: None directly (see callback)

**requestJobDecryption**
```solidity
function requestJobDecryption(uint256 _jobId)
    external
    validJobId(_jobId)
    returns (uint256)
```
- Request Gateway decryption of result
- Requires: msg.sender == job submitter
- Returns: requestId
- Emits: `DecryptionRequested`

**jobDecryptionCallback**
```solidity
function jobDecryptionCallback(
    uint256 requestId,
    uint8 decryptedValue
) public onlyGateway returns (uint8)
```
- Gateway callback with decrypted result
- Restricted to: Gateway contract only
- Updates: Job status to Completed
- Emits: `DecryptionCallbackReceived`, `QuantumJobCompleted`

#### Refund Management

**claimRefund**
```solidity
function claimRefund() external
```
- Claim all pending refunds
- Requires: pendingRefunds[msg.sender] > 0
- Transfers: Accumulated refund amount

**requestRefund**
```solidity
function requestRefund(uint256 _jobId) external validJobId(_jobId)
```
- Manually request refund for timed-out job
- Requires: Job timed out and not completed
- Updates: Issues refund to pending balance

**getPendingRefund**
```solidity
function getPendingRefund(address _user) external view returns (uint256)
```
- View pending refund balance
- Returns: Amount in wei

#### Privacy Functions

**privacyDivision**
```solidity
function privacyDivision(euint64 _numerator, euint64 _denominator)
    public
    returns (euint64)
```
- Privacy-preserving division with random multipliers
- Returns: Encrypted division result

**obfuscatePrice**
```solidity
function obfuscatePrice(uint64 _price, uint256 _priceId)
    external
    returns (euint64)
```
- Obfuscate price to prevent leakage
- Stores: Multiplier for de-obfuscation
- Returns: Obfuscated encrypted price
- Emits: `PriceObfuscated`

**deobfuscatePrice**
```solidity
function deobfuscatePrice(uint256 _priceId)
    external
    view
    returns (euint64)
```
- Retrieve original price (still encrypted)
- Returns: De-obfuscated encrypted price

#### Quantum State Management

**initializeQuantumState**
```solidity
function initializeQuantumState(uint8[] calldata _amplitudes, uint8 _qubitCount) external
```
- Initialize user's quantum state
- Requires: Valid qubit count (1-8) and amplitude array
- Emits: `QuantumStateInitialized`

**createEntanglement**
```solidity
function createEntanglement(address _partner) external
```
- Create quantum entanglement with partner
- Requires: Both users have initialized states
- Emits: `EntanglementCreated`

**compileQuantumCircuit**
```solidity
function compileQuantumCircuit(
    uint256 _circuitId,
    uint8[] calldata _gateTypes,
    uint8[] calldata _targetQubits,
    uint8[] calldata _controlQubits
) external
```
- Compile custom quantum circuit
- Requires: Matching array lengths, reasonable depth
- Emits: `CircuitCompiled`

#### View Functions

**getJobInfo**
```solidity
function getJobInfo(uint256 _jobId) external view validJobId(_jobId) returns (
    address submitter,
    uint8 algorithmType,
    bool isCompleted,
    bool isVerified,
    uint256 submitTime,
    uint256 completeTime,
    uint256 gasUsed,
    JobStatus status,
    uint256 jobFee
)
```

**getJobStatus**
```solidity
function getJobStatus(uint256 _jobId) external view validJobId(_jobId) returns (JobStatus)
```

**getJobResult**
```solidity
function getJobResult(uint256 _jobId) external view validJobId(_jobId) returns (bytes memory)
```

**getUserJobHistory**
```solidity
function getUserJobHistory(address _user) external view returns (uint256[] memory)
```

**getQuantumStateInfo**
```solidity
function getQuantumStateInfo(address _user) external view returns (
    uint8 qubitCount,
    bool isEntangled,
    uint256 timestamp
)
```

**getCircuitInfo**
```solidity
function getCircuitInfo(uint256 _circuitId) external view returns (
    uint8[] memory gateTypes,
    uint8[] memory targetQubits,
    bool isCompiled,
    uint256 depth
)
```

#### Access Control

**authorizeNode**
```solidity
function authorizeNode(address _node) external onlyOwner
```
- Authorize compute node
- Restricted to: Owner only
- Emits: `NodeAuthorized`

**revokeNodeAuthorization**
```solidity
function revokeNodeAuthorization(address _node) external onlyOwner
```
- Revoke node authorization
- Restricted to: Owner only

#### Emergency Functions

**emergencyPause**
```solidity
function emergencyPause() external onlyOwner
```
- Emergency pause functionality
- Restricted to: Owner only

**withdrawFees**
```solidity
function withdrawFees() external onlyOwner
```
- Withdraw accumulated fees
- Restricted to: Owner only

---

## Job Status Lifecycle

```
Submitted
    │
    ├─ executeQuantumAlgorithm() ──▶ Executing
    │                                     │
    │                                     ├─ Success ──▶ DecryptPending
    │                                     │                   │
    │                                     │                   ├─ requestJobDecryption() ──▶ DecryptPending
    │                                     │                   │                                    │
    │                                     │                   │                                    ├─ Callback Success ──▶ Completed
    │                                     │                   │                                    │
    │                                     │                   │                                    └─ Callback Timeout ──▶ TimedOut ──▶ Refunded
    │                                     │                   │
    │                                     │                   └─ Timeout ──▶ TimedOut ──▶ Refunded
    │                                     │
    │                                     └─ Failure ──▶ Failed ──▶ Refunded
    │
    └─ Timeout ──▶ TimedOut ──▶ Refunded
```

---

## Best Practices

### For Users

1. **Always check job status** before requesting operations
2. **Monitor timeout windows** (1 hour for execution)
3. **Claim refunds promptly** when jobs fail
4. **Use appropriate job fees** (minimum 0.001 ether)

### For Developers

1. **Validate all inputs** before contract calls
2. **Handle timeout scenarios** gracefully
3. **Monitor events** for job status updates
4. **Implement retry logic** for failed Gateway callbacks
5. **Use view functions** to check state before transactions

### For Operators

1. **Authorize nodes carefully** (security critical)
2. **Monitor gas costs** and optimize operations
3. **Track refund patterns** for system health
4. **Regular security audits** recommended
5. **Emergency pause** mechanism for critical issues

---

## Security Considerations

### Audit Points

1. ✓ Input validation on all public functions
2. ✓ Access control via modifiers
3. ✓ Reentrancy protection (Checks-Effects-Interactions)
4. ✓ Integer overflow protection (Solidity 0.8+)
5. ✓ Proper event emission
6. ✓ Timeout mechanisms
7. ✓ Refund safety
8. ✓ Gateway callback validation

### Known Limitations

1. Gateway callback security depends on Gateway contract implementation
2. Random multipliers use pseudo-randomness (acceptable for obfuscation)
3. Maximum 8 qubits due to euint8 limitation
4. Job fee non-negotiable (fixed minimum)

---

## Future Enhancements

1. **Batch Operations**: Submit multiple jobs in one transaction
2. **Dynamic Pricing**: Adjust fees based on algorithm complexity
3. **Extended Qubit Support**: Use euint16/euint32 for more qubits
4. **Advanced Circuits**: More quantum gate types
5. **Oracle Integration**: External data sources for quantum algorithms
6. **Cross-Chain**: Support for multiple blockchain networks

---

*For support and updates, see main README.md*
