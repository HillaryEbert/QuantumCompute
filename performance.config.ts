/**
 * Performance Testing Configuration
 *
 * This file contains configuration settings for performance testing,
 * gas optimization, and performance monitoring.
 */

export const PerformanceConfig = {
  /**
   * Gas Thresholds
   * Maximum acceptable gas consumption for different operations
   */
  gasThresholds: {
    deployment: 3_000_000,
    submitJob: 200_000,
    executeAlgorithm: 500_000,
    compileCircuit: 300_000,
    createEntanglement: 250_000,
    batchOperations: 1_000_000,
    viewFunctions: 50_000, // View functions don't use gas but useful for estimation
  },

  /**
   * Time Thresholds (milliseconds)
   * Maximum acceptable execution time for different operations
   */
  timeThresholds: {
    deployment: 5_000,
    transaction: 2_000,
    batchProcessing: 10_000,
    viewFunctionCall: 1_000,
    contractInteraction: 3_000,
  },

  /**
   * Performance Targets
   * Target performance metrics for optimization
   */
  targets: {
    // Gas optimization target (percentage reduction from unoptimized)
    gasOptimizationTarget: 30,

    // Maximum acceptable gas variance between similar operations
    gasVariancePercent: 10,

    // Minimum transactions per second the system should handle
    minTPS: 100,

    // Maximum acceptable transaction confirmation time
    maxConfirmationTime: 15_000, // ms

    // Target code coverage percentage
    coverageTarget: 80,
  },

  /**
   * Scalability Test Parameters
   */
  scalability: {
    // Test batch sizes
    testBatchSizes: [5, 10, 20, 50],

    // Test complexity levels
    testComplexities: [100, 500, 1000, 5000],

    // Concurrent user simulation counts
    concurrentUsers: [5, 10, 20, 50],

    // Maximum acceptable linear scalability deviation
    maxScalabilityDeviation: 20, // percent
  },

  /**
   * Load Testing Configuration
   */
  loadTesting: {
    // Number of operations for load test
    operationCount: 100,

    // Concurrent operation limit
    concurrencyLimit: 10,

    // Warmup operations before measurement
    warmupOperations: 5,

    // Test duration for sustained load
    sustainedLoadDuration: 60_000, // ms

    // Cooldown period between tests
    cooldownPeriod: 5_000, // ms
  },

  /**
   * Memory and Storage Efficiency
   */
  efficiency: {
    // Maximum storage slots per operation
    maxStorageSlotsPerOperation: 5,

    // Maximum contract size (bytes)
    maxContractSize: 24_576, // 24KB EIP-170 limit

    // Target storage efficiency (bytes per operation)
    targetStorageEfficiency: 1000,

    // Maximum memory usage during execution
    maxMemoryUsage: 100_000, // gas units
  },

  /**
   * Gas Optimization Settings
   */
  optimization: {
    // Compiler optimization enabled
    enabled: true,

    // Optimizer runs (balance between deployment and runtime costs)
    runs: 200,

    // Via IR optimization
    viaIR: false,

    // Target EVM version
    evmVersion: "paris",

    // Additional optimization details
    details: {
      peephole: true,
      inliner: true,
      jumpdestRemover: true,
      orderLiterals: true,
      deduplicate: true,
      cse: true,
      constantOptimizer: true,
      yul: true,
      yulDetails: {
        stackAllocation: true,
        optimizerSteps: "dhfoDgvulfnTUtnIf",
      },
    },
  },

  /**
   * Performance Monitoring
   */
  monitoring: {
    // Enable real-time gas tracking
    enableGasTracking: true,

    // Enable performance metrics collection
    enableMetrics: true,

    // Log performance warnings
    logWarnings: true,

    // Performance warning thresholds (percentage above target)
    warningThreshold: 80,

    // Performance error thresholds (percentage above target)
    errorThreshold: 100,

    // Metrics export format
    metricsFormat: "json",

    // Metrics output directory
    metricsOutputDir: "./performance-reports",
  },

  /**
   * Regression Testing
   */
  regression: {
    // Enable regression testing
    enabled: true,

    // Baseline metrics file
    baselineFile: "./performance-baseline.json",

    // Maximum acceptable performance regression
    maxRegressionPercent: 10,

    // Automatically update baseline on improvement
    autoUpdateBaseline: false,
  },

  /**
   * Reporting Configuration
   */
  reporting: {
    // Generate performance reports
    generateReports: true,

    // Report format (json, html, markdown)
    reportFormat: ["json", "markdown"],

    // Report output directory
    reportOutputDir: "./performance-reports",

    // Include gas breakdown in reports
    includeGasBreakdown: true,

    // Include timing analysis in reports
    includeTimingAnalysis: true,

    // Include scalability metrics in reports
    includeScalabilityMetrics: true,

    // Include comparison with baseline
    includeBaselineComparison: true,
  },

  /**
   * Network-Specific Settings
   */
  networks: {
    hardhat: {
      gasPrice: 20_000_000_000, // 20 gwei
      blockGasLimit: 30_000_000,
      allowUnlimitedContractSize: false,
    },
    sepolia: {
      gasPrice: 50_000_000_000, // 50 gwei
      blockGasLimit: 30_000_000,
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      gasPrice: 100_000_000_000, // 100 gwei
      blockGasLimit: 30_000_000,
      allowUnlimitedContractSize: false,
    },
  },

  /**
   * Test Scenarios
   */
  scenarios: {
    // Standard operation scenario
    standard: {
      jobCount: 10,
      algorithmTypes: [1, 2, 3, 4, 5, 6],
      complexityRange: [100, 1000],
      userCount: 5,
    },

    // High load scenario
    highLoad: {
      jobCount: 100,
      algorithmTypes: [1, 2, 3, 4, 5, 6],
      complexityRange: [100, 5000],
      userCount: 50,
    },

    // Stress test scenario
    stress: {
      jobCount: 1000,
      algorithmTypes: [1, 2, 3, 4, 5, 6],
      complexityRange: [100, 10000],
      userCount: 100,
    },

    // Edge case scenario
    edgeCase: {
      jobCount: 5,
      algorithmTypes: [1],
      complexityRange: [1, 1000000],
      userCount: 2,
    },
  },

  /**
   * DoS Prevention Settings
   */
  dosProtection: {
    // Maximum jobs per user
    maxJobsPerUser: 100,

    // Maximum jobs per block
    maxJobsPerBlock: 50,

    // Minimum blocks between jobs
    minBlocksBetweenJobs: 1,

    // Maximum circuit size
    maxCircuitSize: 1_000_000,

    // Maximum qubits per circuit
    maxQubits: 1000,

    // Maximum gates per circuit
    maxGates: 100_000,

    // Rate limiting window (blocks)
    rateLimitWindow: 100,
  },

  /**
   * Continuous Performance Testing
   */
  continuous: {
    // Enable continuous performance monitoring
    enabled: false,

    // Testing interval (ms)
    interval: 3_600_000, // 1 hour

    // Alert on performance degradation
    alertOnDegradation: true,

    // Alert threshold (percent degradation)
    alertThreshold: 15,

    // Webhook for alerts
    alertWebhook: process.env.ALERT_WEBHOOK || "",

    // Email for alerts
    alertEmail: process.env.ALERT_EMAIL || "",
  },
};

/**
 * Performance Test Helper Functions
 */
export class PerformanceTestHelpers {
  /**
   * Calculate gas variance between operations
   */
  static calculateGasVariance(gasValues: bigint[]): number {
    if (gasValues.length === 0) return 0;

    const maxGas = gasValues.reduce((a, b) => (a > b ? a : b));
    const minGas = gasValues.reduce((a, b) => (a < b ? a : b));

    return Number(((maxGas - minGas) * BigInt(100)) / minGas);
  }

  /**
   * Calculate average gas consumption
   */
  static calculateAverageGas(gasValues: bigint[]): bigint {
    if (gasValues.length === 0) return BigInt(0);

    const sum = gasValues.reduce((a, b) => a + b, BigInt(0));
    return sum / BigInt(gasValues.length);
  }

  /**
   * Check if gas is within threshold
   */
  static isWithinThreshold(actualGas: bigint, threshold: number): boolean {
    return actualGas < BigInt(threshold);
  }

  /**
   * Calculate performance improvement percentage
   */
  static calculateImprovement(baseline: bigint, current: bigint): number {
    if (baseline === BigInt(0)) return 0;

    return Number(((baseline - current) * BigInt(100)) / baseline);
  }

  /**
   * Format gas value for display
   */
  static formatGas(gas: bigint): string {
    const gasNumber = Number(gas);

    if (gasNumber >= 1_000_000) {
      return `${(gasNumber / 1_000_000).toFixed(2)}M`;
    } else if (gasNumber >= 1_000) {
      return `${(gasNumber / 1_000).toFixed(2)}K`;
    }

    return gasNumber.toString();
  }

  /**
   * Format time for display
   */
  static formatTime(ms: number): string {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(2)}s`;
    }

    return `${ms}ms`;
  }

  /**
   * Generate performance report
   */
  static generateReport(metrics: any): string {
    return JSON.stringify(metrics, null, 2);
  }
}

export default PerformanceConfig;
