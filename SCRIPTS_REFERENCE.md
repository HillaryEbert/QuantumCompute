# NPM Scripts Reference

Quick reference guide for all available npm scripts in the Quantum Privacy Computing Platform.

## Table of Contents

- [Development](#development)
- [Testing](#testing)
- [Performance](#performance)
- [Security](#security)
- [Code Quality](#code-quality)
- [Deployment](#deployment)
- [Frontend](#frontend)
- [CI/CD](#cicd)
- [Utilities](#utilities)

## Development

### Compilation

```bash
# Compile contracts
npm run compile

# Clean artifacts and cache
npm run clean

# Generate TypeChain types
npm run typechain
```

### Local Node

```bash
# Start local Hardhat node
npm run node
```

## Testing

### Basic Testing

```bash
# Run all tests
npm test

# Run tests with verbose output
npm run test:verbose

# Run tests with gas reporting
npm run test:gas

# Generate coverage report
npm run test:coverage
```

### Performance Testing

```bash
# Run performance tests
npm run test:performance

# Run performance tests (verbose)
npm run test:performance:verbose

# Generate performance report with gas data
npm run performance:report
```

**What it does**:
- Measures gas consumption for all operations
- Tests scalability and efficiency
- Generates detailed performance metrics
- Validates against performance thresholds

**Output Example**:
```
📊 Performance Report:
├─ Deployment: 2,500,000 gas
├─ Submit Job: 150,000 gas
├─ Execute Algorithm: 400,000 gas
└─ Create Entanglement: 200,000 gas
```

## Security

### Security Auditing

```bash
# Run npm audit (moderate+ severity)
npm run security:audit

# Fix vulnerabilities automatically
npm run security:audit:fix

# Run complete security check (lint + audit)
npm run security:check
```

**What it checks**:
- Dependency vulnerabilities
- Code quality issues
- Security best practices
- Known CVEs

### Git Hooks

Pre-commit and pre-push hooks run automatically via Husky:

**Pre-Commit** (runs on `git commit`):
- Prettier formatting check
- Solhint (Solidity linting)
- ESLint (TypeScript linting)
- Contract compilation

**Pre-Push** (runs on `git push`):
- Full test suite
- Security audit

**Commit Message** (validates format):
- Conventional commits format
- Must match: `type(scope): subject`

To bypass hooks (not recommended):
```bash
git commit --no-verify
git push --no-verify
```

## Code Quality

### Formatting

```bash
# Check code formatting
npm run format:check
npm run prettier:check  # Same as format:check

# Auto-format code
npm run format
npm run prettier:write  # Same as format
```

**Files formatted**:
- Solidity contracts (`*.sol`)
- TypeScript files (`*.ts`)
- JavaScript files (`*.js`)

### Linting

```bash
# Run all linters
npm run lint

# Run Solidity linter only
npm run lint:sol

# Run TypeScript linter only
npm run lint:ts

# Auto-fix all issues
npm run lint:fix

# Auto-fix Solidity issues
npm run lint:sol:fix

# Auto-fix TypeScript issues
npm run lint:ts:fix
```

**What it checks**:
- Code style and conventions
- Security issues
- Best practices
- Potential bugs

## Deployment

### Deploy Scripts

```bash
# Deploy to local network
npm run deploy:local

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Zama devnet
npm run deploy:zama

# Generic deploy (uses hardhat.config network)
npm run deploy
```

### Contract Verification

```bash
# Verify on Etherscan (Sepolia)
npm run verify:sepolia

# Generic verify
npm run verify
```

### Contract Interaction

```bash
# Interactive CLI (local)
npm run interact:local

# Interactive CLI (Sepolia)
npm run interact:sepolia

# Generic interact
npm run interact
```

**Interactive Menu**:
1. Submit Job
2. Execute Algorithm
3. Compile Circuit
4. Get Job Details
5. Get Total Jobs
6. Create Entanglement
7. Get Entanglement Pair
8. Get User Jobs
9. Get User Stats
10. Exit

### Simulation

```bash
# Run simulation on local network
npm run simulate

# Run simulation on Sepolia
npm run simulate:sepolia
```

**What it does**:
- Simulates complete workflow
- Tests all 6 algorithm types
- Creates entanglements
- Compiles circuits
- Generates comprehensive report

## Frontend

### Next.js Application

```bash
# Install frontend dependencies
npm run dev:frontend

# Build frontend for production
npm run build:frontend

# Start production frontend
npm run start:frontend

# Serve demo (HTTP server)
npm run demo
```

## CI/CD

### Continuous Integration

```bash
# Run full CI pipeline locally
npm run ci

# Run CI with coverage
npm run ci:coverage

# Run CI with performance tests
npm run ci:performance

# Run CI with security checks
npm run ci:security
```

**CI Pipeline Includes**:
1. Code formatting check
2. Linting (Solidity + TypeScript)
3. Contract compilation
4. Test suite execution
5. Coverage reporting (optional)
6. Performance testing (optional)
7. Security audit (optional)

### Pre-Install/Post-Install

```bash
# Install Husky hooks
npm run prepare

# Compile contracts after install
npm run postinstall
```

## Utilities

### Account Management

```bash
# List Hardhat accounts
npm run accounts

# Check account balance
npm run balance
```

### Complete Project Management

```bash
# Install all dependencies (root + frontend)
npm run all:install

# Build everything (contracts + frontend)
npm run all:build

# Clean everything
npm run all:clean
```

## Command Cheat Sheet

### Daily Development

```bash
# Start development
npm run clean
npm install
npm run compile

# Make changes, test
npm test
npm run lint

# Before commit (runs automatically)
# Prettier check + lint + compile

# Commit (validates message format)
git commit -m "feat(contracts): add new feature"

# Before push (runs automatically)
# Test suite + security audit

# Push
git push
```

### Before Deployment

```bash
# Run complete checks
npm run ci:security

# Deploy to testnet
npm run deploy:sepolia

# Verify contract
npm run verify:sepolia

# Test interaction
npm run interact:sepolia

# Run simulation
npm run simulate:sepolia
```

### Performance Monitoring

```bash
# Run performance tests
npm run test:performance

# Generate detailed report
npm run performance:report

# Check gas usage
npm run test:gas
```

### Security Checks

```bash
# Quick security check
npm run security:audit

# Full security check
npm run security:check

# Fix vulnerabilities
npm run security:audit:fix
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Essential variables
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-private-key-without-0x
ETHERSCAN_API_KEY=your-etherscan-api-key

# PauserSet configuration (comma-separated)
PAUSER_ADDRESSES=0xAddr1,0xAddr2,0xAddr3

# Gas reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=your-coinmarketcap-api-key

# Coverage
CODECOV_TOKEN=your-codecov-token
```

## Troubleshooting

### Tests Failing

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules
npm install
npm run compile
npm test
```

### Linting Errors

```bash
# Auto-fix what's possible
npm run lint:fix
npm run prettier:write

# Review remaining issues
npm run lint
```

### Deployment Issues

```bash
# Check network configuration
npx hardhat console --network sepolia

# Verify RPC URL and private key in .env
# Check account has sufficient funds

# Try verbose output
HARDHAT_VERBOSE=true npm run deploy:sepolia
```

### Husky Hooks Not Working

```bash
# Reinstall Husky
npm run prepare

# Check hooks are executable (Unix/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

### Performance Tests Slow

```bash
# Run specific test file
npx hardhat test test/performance.test.ts

# Skip slow tests during development
# Comment out long-running tests temporarily
```

## Quick Reference Table

| Task | Command |
|------|---------|
| Compile contracts | `npm run compile` |
| Run tests | `npm test` |
| Generate coverage | `npm run test:coverage` |
| Performance tests | `npm run test:performance` |
| Check formatting | `npm run prettier:check` |
| Auto-format | `npm run prettier:write` |
| Lint code | `npm run lint` |
| Fix linting | `npm run lint:fix` |
| Security audit | `npm run security:audit` |
| Full CI check | `npm run ci` |
| Deploy testnet | `npm run deploy:sepolia` |
| Verify contract | `npm run verify:sepolia` |
| Interact with contract | `npm run interact:sepolia` |
| Run simulation | `npm run simulate:sepolia` |
| Clean build | `npm run clean` |

## Tips

### 1. Development Speed

```bash
# During active development, skip expensive checks
npm test -- --grep "specific test"

# Use local network for fast testing
npm run node  # Terminal 1
npm run simulate  # Terminal 2
```

### 2. CI/CD Locally

```bash
# Before pushing, run what CI will run
npm run ci:security

# Fix any issues before pushing
```

### 3. Gas Optimization

```bash
# Monitor gas usage during development
npm run test:gas

# Generate performance reports regularly
npm run performance:report
```

### 4. Security First

```bash
# Run security checks before major releases
npm run security:check
npm run test:coverage

# Update dependencies regularly
npm audit fix
```

## GitHub Actions Workflows

Workflows run automatically on push/PR:

1. **Test Workflow** (`.github/workflows/test.yml`)
   - Runs on: Ubuntu + Windows
   - Node versions: 18.x, 20.x
   - Includes: Lint, compile, test, coverage

2. **Security Workflow** (`.github/workflows/security.yml`)
   - Runs daily at 00:00 UTC
   - Includes: Dependency audit, Solidity security, gas optimization, CodeQL

3. **Manual Workflow** (`.github/workflows/manual.yml`)
   - Trigger: Manual dispatch
   - Allows Node version selection
   - Generates artifacts

## Support

For more information:
- **General**: See `README.md`
- **Testing**: See `TESTING.md`
- **Security**: See `SECURITY.md`
- **CI/CD**: See `CI_CD.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Hardhat**: See `HARDHAT_FRAMEWORK.md`

---

**Last Updated**: 2025-11-02
