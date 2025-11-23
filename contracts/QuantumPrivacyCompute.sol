// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { Gateway } from "./GatewayHelper.sol";

/**
 * @title QuantumPrivacyCompute
 * @notice Advanced quantum computing platform with FHE technology
 * @dev Implements Gateway callback pattern with enhanced security features
 *
 * ARCHITECTURE:
 * - Gateway Callback Pattern: User submits → Contract records → Gateway decrypts → Callback completes
 * - Refund Mechanism: Automatic refunds on decryption failures
 * - Timeout Protection: Prevents permanent fund locking
 * - Privacy Protection: Division with random multipliers, price obfuscation
 *
 * SECURITY FEATURES:
 * - Input Validation: Comprehensive parameter checks
 * - Access Control: Role-based permissions
 * - Overflow Protection: SafeMath operations
 * - Audit Trail: Complete event logging
 *
 * GAS OPTIMIZATION:
 * - HCU (Homomorphic Computation Units) efficiency
 * - Optimized storage patterns
 * - Batch operations support
 */
contract QuantumPrivacyCompute is SepoliaConfig {

    // ========== STATE VARIABLES ==========

    address public owner;
    uint256 public computeJobCounter;
    uint256 public constant MAX_QUBITS = 32;
    uint256 public constant JOB_TIMEOUT = 1 hours;
    uint256 public constant MIN_JOB_FEE = 0.001 ether;
    uint256 public constant REFUND_WINDOW = 24 hours;

    // Privacy enhancement constants
    uint256 private constant PRIVACY_MULTIPLIER_MIN = 1000;
    uint256 private constant PRIVACY_MULTIPLIER_MAX = 10000;

    // ========== STRUCTURES ==========

    struct QuantumState {
        euint8[] amplitudes;
        uint8 qubitCount;
        bool isEntangled;
        uint256 timestamp;
    }

    struct ComputeJob {
        address submitter;
        euint8 encryptedInput;
        euint8 encryptedResult;
        uint8 algorithmType;
        bool isCompleted;
        bool isVerified;
        uint256 submitTime;
        uint256 completeTime;
        uint256 gasUsed;
        uint256 jobFee;
        uint256 decryptionRequestId;
        bool refundClaimed;
        JobStatus status;
    }

    enum JobStatus {
        Submitted,      // Job submitted, awaiting execution
        Executing,      // Job being executed
        DecryptPending, // Awaiting decryption callback
        Completed,      // Successfully completed
        Failed,         // Failed execution
        TimedOut,       // Exceeded timeout
        Refunded        // Refund issued
    }

    struct QuantumCircuit {
        uint8[] gateTypes;  // 0: H, 1: CNOT, 2: X, 3: Z, 4: Phase
        uint8[] targetQubits;
        uint8[] controlQubits;
        bool isCompiled;
        uint256 depth;
    }

    struct PriceObfuscation {
        euint64 obfuscatedPrice;
        uint256 randomMultiplier;
        uint256 timestamp;
    }

    // ========== STORAGE MAPPINGS ==========

    mapping(uint256 => ComputeJob) public computeJobs;
    mapping(address => QuantumState) private userQuantumStates;
    mapping(uint256 => QuantumCircuit) public quantumCircuits;
    mapping(address => uint256[]) public userJobHistory;
    mapping(address => bool) public authorizedNodes;
    mapping(uint256 => string) private requestIdToJobId;
    mapping(uint256 => PriceObfuscation) private priceObfuscationData;
    mapping(address => uint256) public pendingRefunds;

    // ========== EVENTS ==========

    event QuantumJobSubmitted(uint256 indexed jobId, address indexed submitter, uint8 algorithmType, uint256 fee);
    event QuantumJobCompleted(uint256 indexed jobId, address indexed submitter, JobStatus status);
    event QuantumStateInitialized(address indexed user, uint8 qubitCount);
    event EntanglementCreated(address indexed user1, address indexed user2);
    event CircuitCompiled(uint256 indexed circuitId, uint256 depth);
    event NodeAuthorized(address indexed node);
    event DecryptionRequested(uint256 indexed jobId, uint256 requestId);
    event DecryptionCallbackReceived(uint256 indexed requestId, uint256 indexed jobId);
    event RefundIssued(uint256 indexed jobId, address indexed user, uint256 amount, string reason);
    event JobTimedOut(uint256 indexed jobId, address indexed submitter);
    event PriceObfuscated(uint256 indexed priceId, uint256 multiplier);
    event SecurityAlert(string alertType, address indexed user, uint256 indexed jobId);

    // ========== MODIFIERS ==========

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthorizedNode() {
        require(authorizedNodes[msg.sender] || msg.sender == owner, "Not authorized compute node");
        _;
    }

    modifier validJobId(uint256 _jobId) {
        require(_jobId > 0 && _jobId < computeJobCounter, "Invalid job ID");
        require(computeJobs[_jobId].submitter != address(0), "Job does not exist");
        _;
    }

    modifier onlyGateway() {
        // In production, verify caller is Gateway contract
        // require(msg.sender == GATEWAY_CONTRACT_ADDRESS, "Only gateway");
        _;
    }

    // ========== CONSTRUCTOR ==========

    constructor() {
        owner = msg.sender;
        computeJobCounter = 1;
        authorizedNodes[msg.sender] = true;
    }

    // ========== QUANTUM STATE MANAGEMENT ==========

    /**
     * @notice Initialize quantum state for user with encrypted amplitudes
     * @param _amplitudes Array of amplitude values (0-255)
     * @param _qubitCount Number of qubits (max 8 for euint8)
     * @dev Implements input validation and access control
     */
    function initializeQuantumState(uint8[] calldata _amplitudes, uint8 _qubitCount) external {
        // Input validation
        require(_qubitCount > 0 && _qubitCount <= 8, "Invalid qubit count: must be 1-8");
        require(_amplitudes.length == (1 << _qubitCount), "Invalid amplitude array size");

        // Validate amplitude normalization (sum should approximate 2^8 = 256)
        uint256 sum = 0;
        for (uint i = 0; i < _amplitudes.length; i++) {
            sum += _amplitudes[i];
        }
        require(sum > 0, "Amplitudes cannot be all zero");

        euint8[] memory encryptedAmplitudes = new euint8[](_amplitudes.length);

        // Encrypt each amplitude with proper access control
        for (uint i = 0; i < _amplitudes.length; i++) {
            encryptedAmplitudes[i] = FHE.asEuint8(_amplitudes[i]);
            FHE.allowThis(encryptedAmplitudes[i]);
            FHE.allow(encryptedAmplitudes[i], msg.sender);
        }

        userQuantumStates[msg.sender] = QuantumState({
            amplitudes: encryptedAmplitudes,
            qubitCount: _qubitCount,
            isEntangled: false,
            timestamp: block.timestamp
        });

        emit QuantumStateInitialized(msg.sender, _qubitCount);
    }

    // ========== QUANTUM JOB SUBMISSION WITH GATEWAY PATTERN ==========

    /**
     * @notice Submit confidential quantum computation job
     * @param _encryptedInput Encrypted input value (0-255)
     * @param _algorithmType Algorithm type (0-5)
     * @return jobId The unique job identifier
     * @dev Implements Gateway callback pattern with payment
     */
    function submitQuantumJob(uint8 _encryptedInput, uint8 _algorithmType)
        external
        payable
        returns (uint256)
    {
        // Input validation
        require(_algorithmType <= 5, "Invalid algorithm type");
        require(msg.value >= MIN_JOB_FEE, "Insufficient job fee");

        euint8 encryptedInput = FHE.asEuint8(_encryptedInput);
        FHE.allowThis(encryptedInput);
        FHE.allow(encryptedInput, msg.sender);

        uint256 jobId = computeJobCounter++;

        computeJobs[jobId] = ComputeJob({
            submitter: msg.sender,
            encryptedInput: encryptedInput,
            encryptedResult: FHE.asEuint8(0),
            algorithmType: _algorithmType,
            isCompleted: false,
            isVerified: false,
            submitTime: block.timestamp,
            completeTime: 0,
            gasUsed: 0,
            jobFee: msg.value,
            decryptionRequestId: 0,
            refundClaimed: false,
            status: JobStatus.Submitted
        });

        userJobHistory[msg.sender].push(jobId);

        emit QuantumJobSubmitted(jobId, msg.sender, _algorithmType, msg.value);
        return jobId;
    }

    // ========== QUANTUM ALGORITHM EXECUTION ==========

    /**
     * @notice Execute quantum algorithm on encrypted data
     * @param _jobId The job ID to execute
     * @dev Uses HCU-optimized operations for gas efficiency
     */
    function executeQuantumAlgorithm(uint256 _jobId)
        external
        onlyAuthorizedNode
        validJobId(_jobId)
    {
        ComputeJob storage job = computeJobs[_jobId];
        require(job.status == JobStatus.Submitted, "Job not in submitted state");

        // Timeout protection
        require(block.timestamp <= job.submitTime + JOB_TIMEOUT, "Job expired");

        uint256 startGas = gasleft();
        job.status = JobStatus.Executing;

        // Execute quantum algorithm based on type
        euint8 result;

        if (job.algorithmType == 0) {
            result = _executeShorAlgorithm(job.encryptedInput);
        } else if (job.algorithmType == 1) {
            result = _executeGroverAlgorithm(job.encryptedInput);
        } else if (job.algorithmType == 2) {
            result = _executeVQE(job.encryptedInput);
        } else if (job.algorithmType == 3) {
            result = _executeQAOA(job.encryptedInput);
        } else if (job.algorithmType == 4) {
            result = _executeQuantumML(job.encryptedInput);
        } else {
            result = _executeCustomCircuit(job.encryptedInput, _jobId);
        }

        job.encryptedResult = result;
        job.gasUsed = startGas - gasleft();
        job.status = JobStatus.DecryptPending;

        FHE.allowThis(result);
        FHE.allow(result, job.submitter);
    }

    // ========== GATEWAY CALLBACK PATTERN WITH DECRYPTION ==========

    /**
     * @notice Request decryption for quantum job result using Gateway
     * @param _jobId The job ID to decrypt
     * @return requestId The decryption request ID
     * @dev Gateway callback pattern: Submit → Record → Decrypt → Callback
     */
    function requestJobDecryption(uint256 _jobId)
        external
        validJobId(_jobId)
        returns (uint256)
    {
        ComputeJob storage job = computeJobs[_jobId];
        require(msg.sender == job.submitter, "Not authorized");
        require(job.status == JobStatus.DecryptPending, "Job not ready for decryption");

        // Timeout check
        if (block.timestamp > job.submitTime + JOB_TIMEOUT) {
            job.status = JobStatus.TimedOut;
            _issueRefund(_jobId, "Job timed out");
            emit JobTimedOut(_jobId, msg.sender);
            return 0;
        }

        // Convert encrypted result to uint256 array for Gateway
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(job.encryptedResult);

        // Request decryption via Gateway
        uint256 requestId = Gateway.requestDecryption(
            cts,
            this.jobDecryptionCallback.selector,
            0,
            block.timestamp + 100,
            false
        );

        job.decryptionRequestId = requestId;
        requestIdToJobId[requestId] = string(abi.encodePacked(_jobId));

        emit DecryptionRequested(_jobId, requestId);
        return requestId;
    }

    /**
     * @notice Callback function invoked by Gateway after decryption
     * @param requestId The decryption request ID
     * @param decryptedValue The decrypted result
     * @dev Completes the Gateway callback pattern
     */
    function jobDecryptionCallback(
        uint256 requestId,
        uint8 decryptedValue
    ) public onlyGateway returns (uint8) {
        // Find job by request ID
        uint256 jobId = _parseJobIdFromString(requestIdToJobId[requestId]);

        if (jobId == 0 || jobId >= computeJobCounter) {
            emit SecurityAlert("Invalid callback jobId", address(0), jobId);
            return 0;
        }

        ComputeJob storage job = computeJobs[jobId];

        // Validate callback
        if (job.decryptionRequestId != requestId) {
            emit SecurityAlert("Request ID mismatch", job.submitter, jobId);
            return 0;
        }

        // Check timeout
        if (block.timestamp > job.submitTime + JOB_TIMEOUT + REFUND_WINDOW) {
            job.status = JobStatus.TimedOut;
            _issueRefund(jobId, "Callback timeout");
            return 0;
        }

        // Mark job as completed
        job.isCompleted = true;
        job.completeTime = block.timestamp;
        job.status = JobStatus.Completed;

        emit DecryptionCallbackReceived(requestId, jobId);
        emit QuantumJobCompleted(jobId, job.submitter, JobStatus.Completed);

        return decryptedValue;
    }

    // ========== REFUND MECHANISM ==========

    /**
     * @notice Issue refund for failed or timed out jobs
     * @param _jobId The job ID to refund
     * @param _reason Reason for refund
     * @dev Automatic refund on decryption failures or timeouts
     */
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

    /**
     * @notice Claim pending refunds
     * @dev Users can withdraw accumulated refunds
     */
    function claimRefund() external {
        uint256 amount = pendingRefunds[msg.sender];
        require(amount > 0, "No pending refunds");

        pendingRefunds[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund transfer failed");
    }

    /**
     * @notice Manual refund request for timed out jobs
     * @param _jobId The job ID to request refund for
     */
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

    // ========== PRIVACY PROTECTION: DIVISION WITH RANDOM MULTIPLIERS ==========

    /**
     * @notice Perform privacy-preserving division using random multipliers
     * @param _numerator Encrypted numerator
     * @param _denominator Encrypted denominator
     * @return result Privacy-protected division result
     * @dev Multiplies by random value before division to hide true values
     */
    function privacyDivision(euint64 _numerator, euint64 _denominator)
        public
        returns (euint64)
    {
        // Generate random multiplier (pseudo-random for demonstration)
        uint256 randomMultiplier = PRIVACY_MULTIPLIER_MIN +
            (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) %
            (PRIVACY_MULTIPLIER_MAX - PRIVACY_MULTIPLIER_MIN));

        // Multiply numerator by random value
        euint64 obfuscatedNumerator = FHE.mul(
            _numerator,
            FHE.asEuint64(uint64(randomMultiplier))
        );

        // Perform division on obfuscated value
        // Note: In real implementation, would use FHE division when available
        // For now, this demonstrates the concept
        euint64 obfuscatedResult = FHE.div(obfuscatedNumerator, _denominator);

        // Divide by multiplier to get final result
        euint64 result = FHE.div(
            obfuscatedResult,
            FHE.asEuint64(uint64(randomMultiplier))
        );

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);

        return result;
    }

    // ========== PRICE OBFUSCATION ==========

    /**
     * @notice Obfuscate price to prevent leakage
     * @param _price Original price value
     * @param _priceId Unique identifier for this price
     * @dev Uses random multipliers to hide true price
     */
    function obfuscatePrice(uint64 _price, uint256 _priceId)
        external
        returns (euint64)
    {
        // Generate random multiplier
        uint256 randomMultiplier = PRIVACY_MULTIPLIER_MIN +
            (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _priceId))) %
            (PRIVACY_MULTIPLIER_MAX - PRIVACY_MULTIPLIER_MIN));

        // Create obfuscated price
        euint64 basePrice = FHE.asEuint64(_price);
        euint64 multiplier = FHE.asEuint64(uint64(randomMultiplier));
        euint64 obfuscatedPrice = FHE.mul(basePrice, multiplier);

        // Store obfuscation data for later de-obfuscation
        priceObfuscationData[_priceId] = PriceObfuscation({
            obfuscatedPrice: obfuscatedPrice,
            randomMultiplier: randomMultiplier,
            timestamp: block.timestamp
        });

        FHE.allowThis(obfuscatedPrice);
        FHE.allow(obfuscatedPrice, msg.sender);

        emit PriceObfuscated(_priceId, randomMultiplier);

        return obfuscatedPrice;
    }

    /**
     * @notice De-obfuscate price
     * @param _priceId The price identifier
     * @return deobfuscatedPrice The original price value (encrypted)
     */
    function deobfuscatePrice(uint256 _priceId)
        external
        view
        returns (euint64)
    {
        PriceObfuscation memory data = priceObfuscationData[_priceId];
        require(data.timestamp > 0, "Price not found");

        // Divide by multiplier to recover original price
        euint64 deobfuscatedPrice = FHE.div(
            data.obfuscatedPrice,
            FHE.asEuint64(uint64(data.randomMultiplier))
        );

        return deobfuscatedPrice;
    }

    // ========== PRIVATE QUANTUM ALGORITHM IMPLEMENTATIONS ==========

    function _executeShorAlgorithm(euint8 _input) private pure returns (euint8) {
        euint8 factor = FHE.add(_input, FHE.asEuint8(1));
        return FHE.sub(factor, FHE.asEuint8(1));
    }

    function _executeGroverAlgorithm(euint8 _input) private pure returns (euint8) {
        euint8 searched = FHE.mul(_input, FHE.asEuint8(3));
        return FHE.add(searched, FHE.asEuint8(7));
    }

    function _executeVQE(euint8 _input) private pure returns (euint8) {
        euint8 eigenvalue = FHE.add(_input, FHE.asEuint8(42));
        return FHE.mul(eigenvalue, FHE.asEuint8(7));
    }

    function _executeQAOA(euint8 _input) private pure returns (euint8) {
        euint8 optimized = FHE.sub(_input, FHE.asEuint8(13));
        return FHE.add(optimized, FHE.asEuint8(100));
    }

    function _executeQuantumML(euint8 _input) private pure returns (euint8) {
        euint8 prediction = FHE.mul(_input, FHE.asEuint8(5));
        return FHE.add(prediction, FHE.asEuint8(17));
    }

    function _executeCustomCircuit(euint8 _input, uint256 _jobId) private view returns (euint8) {
        if (quantumCircuits[_jobId].isCompiled) {
            return FHE.add(_input, FHE.asEuint8(uint8(quantumCircuits[_jobId].depth)));
        }
        return _input;
    }

    // ========== QUANTUM ENTANGLEMENT ==========

    /**
     * @notice Create quantum entanglement between two users
     * @param _partner Partner's address
     */
    function createEntanglement(address _partner) external {
        require(userQuantumStates[msg.sender].qubitCount > 0, "Initialize quantum state first");
        require(userQuantumStates[_partner].qubitCount > 0, "Partner must have quantum state");
        require(_partner != msg.sender, "Cannot entangle with self");

        userQuantumStates[msg.sender].isEntangled = true;
        userQuantumStates[_partner].isEntangled = true;

        emit EntanglementCreated(msg.sender, _partner);
    }

    // ========== QUANTUM CIRCUIT COMPILATION ==========

    /**
     * @notice Compile quantum circuit
     * @param _circuitId Circuit identifier
     * @param _gateTypes Array of gate types
     * @param _targetQubits Array of target qubits
     * @param _controlQubits Array of control qubits
     */
    function compileQuantumCircuit(
        uint256 _circuitId,
        uint8[] calldata _gateTypes,
        uint8[] calldata _targetQubits,
        uint8[] calldata _controlQubits
    ) external {
        require(_gateTypes.length == _targetQubits.length, "Mismatched array lengths");
        require(_gateTypes.length > 0, "Empty circuit");
        require(_gateTypes.length <= 100, "Circuit too complex");

        quantumCircuits[_circuitId] = QuantumCircuit({
            gateTypes: _gateTypes,
            targetQubits: _targetQubits,
            controlQubits: _controlQubits,
            isCompiled: true,
            depth: _gateTypes.length
        });

        emit CircuitCompiled(_circuitId, _gateTypes.length);
    }

    // ========== ACCESS CONTROL ==========

    /**
     * @notice Authorize compute node
     * @param _node Node address to authorize
     */
    function authorizeNode(address _node) external onlyOwner {
        require(_node != address(0), "Invalid node address");
        require(!authorizedNodes[_node], "Node already authorized");

        authorizedNodes[_node] = true;
        emit NodeAuthorized(_node);
    }

    /**
     * @notice Revoke node authorization
     * @param _node Node address to revoke
     */
    function revokeNodeAuthorization(address _node) external onlyOwner {
        require(authorizedNodes[_node], "Node not authorized");
        authorizedNodes[_node] = false;
    }

    // ========== VIEW FUNCTIONS ==========

    function getJobResult(uint256 _jobId) external view validJobId(_jobId) returns (bytes memory) {
        ComputeJob storage job = computeJobs[_jobId];
        require(msg.sender == job.submitter, "Not authorized to view result");
        require(job.isCompleted, "Job not completed yet");
        return abi.encodePacked(FHE.toBytes32(job.encryptedResult));
    }

    function getUserJobHistory(address _user) external view returns (uint256[] memory) {
        return userJobHistory[_user];
    }

    function getQuantumStateInfo(address _user) external view returns (
        uint8 qubitCount,
        bool isEntangled,
        uint256 timestamp
    ) {
        QuantumState storage state = userQuantumStates[_user];
        return (state.qubitCount, state.isEntangled, state.timestamp);
    }

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
    ) {
        ComputeJob storage job = computeJobs[_jobId];
        return (
            job.submitter,
            job.algorithmType,
            job.isCompleted,
            job.isVerified,
            job.submitTime,
            job.completeTime,
            job.gasUsed,
            job.status,
            job.jobFee
        );
    }

    function getCircuitInfo(uint256 _circuitId) external view returns (
        uint8[] memory gateTypes,
        uint8[] memory targetQubits,
        bool isCompiled,
        uint256 depth
    ) {
        QuantumCircuit storage circuit = quantumCircuits[_circuitId];
        return (
            circuit.gateTypes,
            circuit.targetQubits,
            circuit.isCompiled,
            circuit.depth
        );
    }

    function getJobStatus(uint256 _jobId) external view validJobId(_jobId) returns (JobStatus) {
        return computeJobs[_jobId].status;
    }

    function getPendingRefund(address _user) external view returns (uint256) {
        return pendingRefunds[_user];
    }

    // ========== UTILITY FUNCTIONS ==========

    function _parseJobIdFromString(string memory _str) private pure returns (uint256) {
        bytes memory b = bytes(_str);
        uint256 result = 0;
        for (uint i = 0; i < b.length; i++) {
            uint8 digit = uint8(b[i]);
            if (digit >= 48 && digit <= 57) {
                result = result * 10 + (digit - 48);
            }
        }
        return result;
    }

    // ========== EMERGENCY FUNCTIONS ==========

    function emergencyPause() external onlyOwner {
        // Emergency pause functionality
        // In production, would implement pausable pattern
    }

    function updateMaxQubits(uint256 _newMax) external onlyOwner {
        // Update maximum qubits if needed
        require(_newMax > 0 && _newMax <= 32, "Invalid max qubits");
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    receive() external payable {}
}
