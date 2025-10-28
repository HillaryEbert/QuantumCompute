# CI/CD Documentation

Comprehensive CI/CD pipeline documentation for the Quantum Privacy Computing Platform.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Code Quality Tools](#code-quality-tools)
- [Test Coverage](#test-coverage)
- [Running Locally](#running-locally)
- [Configuration Files](#configuration-files)
- [Troubleshooting](#troubleshooting)

## Overview

The project implements a comprehensive CI/CD pipeline using GitHub Actions with:

✅ **Automated Testing** on every push and pull request
✅ **Multi-Platform Testing** (Ubuntu + Windows)
✅ **Multiple Node.js Versions** (18.x, 20.x)
✅ **Code Quality Checks** (Solhint, ESLint, Prettier)
✅ **Test Coverage Reporting** (Codecov integration)
✅ **Automated Deployment Verification**

## GitHub Actions Workflows

### 1. Main Test Workflow (`.github/workflows/test.yml`)

**Triggers**:
- Push to `main`, `master`, or `develop` branches
- Pull requests targeting these branches

**Jobs**:

#### Ubuntu Test Job
Runs on: `ubuntu-latest`
Node versions: `18.x`, `20.x`

**Steps**:
1. ✅ Checkout code
2. ✅ Setup Node.js with npm cache
3. ✅ Install dependencies (`npm ci`)
4. ✅ Check code formatting (`npm run prettier:check`)
5. ✅ Lint Solidity contracts (`npm run lint:sol`)
6. ✅ Lint TypeScript (`npm run lint:ts`)
7. ✅ Compile contracts (`npm run compile`)
8. ✅ Build TypeScript (`npm run typechain`)
9. ✅ Run tests (`npm test`)
10. ✅ Generate coverage report (`npm run test:coverage`)
11. ✅ Upload to Codecov

####Windows Test Job
Runs on: `windows-latest`
Node versions: `18.x`, `20.x`

**Steps** (code quality checks excluded for Windows compatibility):
1. ✅ Checkout code
2. ✅ Setup Node.js with npm cache
3. ✅ Install dependencies (`npm ci`)
4. ✅ Compile contracts (`npm run compile`)
5. ✅ Build TypeScript (`npm run typechain`)
6. ✅ Run tests (`npm test`)
7. ✅ Generate coverage report (`npm run test:coverage`)

### 2. Manual Workflow (`.github/workflows/manual.yml`)

**Trigger**: Manual workflow dispatch with Node.js version selection

**Purpose**: On-demand testing without code push

**Features**:
- Select Node.js version (18.x or 20.x)
- Full test suite execution
- Coverage report artifacts (30-day retention)

## Code Quality Tools

### 1. Solhint (Solidity Linter)

**Configuration**: `.solhint.json`

**Rules**:
```json
{
  "extends": "solhint:recommended",
  "rules": {
    "code-complexity": ["error", 8],
    "compiler-version": ["error", ">=0.8.24"],
    "func-visibility": ["error", {"ignoreConstructors": true}],
    "max-line-length": ["warn", 120],
    "named-parameters-mapping": "warn",
    "contract-name-camelcase": "error",
    "event-name-camelcase": "error",
    "func-name-mixedcase": "error"
  }
}
```

**Commands**:
```bash
# Check Solidity contracts
npm run lint:sol

# Auto-fix Solidity issues
npm run lint:sol:fix
```

**Ignored Files** (`.solhintignore`):
- node_modules
- artifacts
- cache
- coverage
- typechain-types
- deployments

### 2. ESLint (TypeScript/JavaScript Linter)

**Configuration**: `.eslintrc.yml`

**Extends**:
- `eslint:recommended`
- `plugin:@typescript-eslint/recommended`
- `plugin:prettier/recommended`

**Key Rules**:
- No floating promises (strict async handling)
- Strict unused variable detection
- TypeScript strict type checking

**Commands**:
```bash
# Check TypeScript/JavaScript files
npm run lint:ts

# Auto-fix TypeScript issues
npm run lint:ts:fix
```

**Ignored Files** (`.eslintignore`):
- node_modules
- artifacts
- cache
- coverage
- typechain-types
- deployments
- dist
- *.config.ts
- *.config.js

### 3. Prettier (Code Formatter)

**Configuration**: `.prettierrc.yml`

**Settings**:
```yaml
printWidth: 120
tabWidth: 2
semi: true
singleQuote: false
trailingComma: es5
endOfLine: lf

overrides:
  - files: '*.sol'
    options:
      tabWidth: 4
      compiler: '0.8.24'
      parser: 'solidity-parse'
```

**Commands**:
```bash
# Check formatting
npm run prettier:check

# Auto-format files
npm run prettier:write
```

**Ignored Files** (`.prettierignore`):
- node_modules
- artifacts
- cache
- coverage
- typechain-types
- deployments
- dist
- package-lock.json
- *.min.js

### 4. Combined Linting

**Run all linters**:
```bash
npm run lint
```

This executes:
1. Solhint (Solidity)
2. ESLint (TypeScript)

**Auto-fix all issues**:
```bash
npm run lint:fix
```

## Test Coverage

### Codecov Integration

**Configuration**: `codecov.yml`

**Settings**:
- **Project Target**: 80% coverage
- **Patch Target**: 70% coverage
- **Precision**: 2 decimal places
- **Range**: 70% - 100%

**Ignored Paths**:
- test/**/*
- scripts/**/*
- node_modules/**/*
- artifacts/**/*
- cache/**/*
- typechain-types/**/*
- deployments/**/*
- **/*.config.ts
- **/*.config.js

**Coverage Report**:
```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

**Coverage Badge**:
Add to README.md:
```markdown
[![codecov](https://codecov.io/gh/YOUR_ORG/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_ORG/YOUR_REPO)
```

### Solidity Coverage

**Configuration**: `.solcover.js`

**Skip Files**:
- test/
- mock/
- interfaces/
- GatewayHelper.sol

**Reporter Formats**:
- HTML
- LCOV
- Text
- JSON

## Running Locally

### Prerequisites

```bash
# Node.js version
node --version  # >= 18.0.0

# Install dependencies
npm install
```

### Development Workflow

#### 1. Before Committing

```bash
# Run full CI checks locally
npm run ci

# Or with coverage
npm run ci:coverage
```

#### 2. Individual Checks

```bash
# Check formatting
npm run prettier:check

# Fix formatting
npm run prettier:write

# Lint Solidity
npm run lint:sol

# Lint TypeScript
npm run lint:ts

# Compile contracts
npm run compile

# Run tests
npm test

# Generate coverage
npm run test:coverage
```

#### 3. Pre-Push Checklist

- [ ] Code formatted (`npm run prettier:check`)
- [ ] No linting errors (`npm run lint`)
- [ ] All tests passing (`npm test`)
- [ ] Coverage maintained (`npm run test:coverage`)
- [ ] Contracts compile (`npm run compile`)

## Configuration Files

### Overview

| File | Purpose | Status |
|------|---------|--------|
| `.github/workflows/test.yml` | Main CI/CD pipeline | ✅ |
| `.github/workflows/manual.yml` | Manual test workflow | ✅ |
| `.solhint.json` | Solidity linting rules | ✅ |
| `.solhintignore` | Solhint ignore patterns | ✅ |
| `.eslintrc.yml` | TypeScript linting rules | ✅ |
| `.eslintignore` | ESLint ignore patterns | ✅ |
| `.prettierrc.yml` | Code formatting rules | ✅ |
| `.prettierignore` | Prettier ignore patterns | ✅ |
| `.solcover.js` | Coverage configuration | ✅ |
| `codecov.yml` | Codecov settings | ✅ |
| `tsconfig.json` | TypeScript configuration | ✅ |

### File Locations

```
project-root/
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── manual.yml
├── .solhint.json
├── .solhintignore
├── .eslintrc.yml
├── .eslintignore
├── .prettierrc.yml
├── .prettierignore
├── .solcover.js
├── codecov.yml
└── tsconfig.json
```

## GitHub Actions Setup

### 1. Enable GitHub Actions

1. Go to repository Settings
2. Navigate to Actions > General
3. Ensure "Allow all actions and reusable workflows" is selected
4. Save

### 2. Add Codecov Token (Optional but Recommended)

1. Sign up at https://codecov.io/
2. Add your repository
3. Copy the upload token
4. In GitHub: Settings > Secrets and variables > Actions
5. Add new secret: `CODECOV_TOKEN`
6. Paste your token

### 3. Branch Protection Rules

Recommended settings for `main` branch:

1. Go to Settings > Branches
2. Add branch protection rule for `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select status checks:
     - ✅ Test on Ubuntu (Node 18.x)
     - ✅ Test on Ubuntu (Node 20.x)
     - ✅ Test on Windows (Node 18.x)
     - ✅ Test on Windows (Node 20.x)

## NPM Scripts Reference

### Testing

| Script | Description |
|--------|-------------|
| `npm test` | Run test suite |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:gas` | Run with gas reporting |
| `npm run test:verbose` | Verbose test output |

### Code Quality

| Script | Description |
|--------|-------------|
| `npm run lint` | Run all linters |
| `npm run lint:sol` | Lint Solidity only |
| `npm run lint:ts` | Lint TypeScript only |
| `npm run lint:fix` | Auto-fix all issues |
| `npm run lint:sol:fix` | Auto-fix Solidity |
| `npm run lint:ts:fix` | Auto-fix TypeScript |
| `npm run prettier:check` | Check formatting |
| `npm run prettier:write` | Auto-format code |

### Build

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile contracts |
| `npm run typechain` | Generate TypeChain types |
| `npm run clean` | Clean artifacts |

### CI/CD

| Script | Description |
|--------|-------------|
| `npm run ci` | Run full CI pipeline locally |
| `npm run ci:coverage` | CI with coverage |

## Workflow Status Badges

Add to your README.md:

```markdown
## Build Status

![Test Suite](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_ORG/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_ORG/YOUR_REPO)
```

## Troubleshooting

### Issue: Tests Fail on Windows but Pass on Ubuntu

**Solution**: Code quality checks are platform-dependent. Windows job excludes linting.

### Issue: Coverage Upload Fails

**Causes**:
1. Missing `CODECOV_TOKEN` secret
2. Coverage file not generated

**Solution**:
```bash
# Verify coverage file exists
ls coverage/lcov.info

# Add CODECOV_TOKEN to GitHub Secrets
```

### Issue: Linting Errors Block CI

**Solution**:
```bash
# Run auto-fix locally
npm run lint:fix
npm run prettier:write

# Commit fixes
git add .
git commit -m "Fix linting issues"
```

### Issue: Out of Memory During Tests

**Solution**: Increase Node.js memory:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm test
```

### Issue: Slow Test Execution

**Solution**: Run tests in parallel:
```bash
npx hardhat test --parallel
```

## Best Practices

### 1. Commit Message Format

```
type(scope): subject

body

footer
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:
```
feat(contracts): add quantum entanglement function

Implement quantum entanglement creation between users with validation

Closes #123
```

### 2. Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Run `npm run ci` locally
4. Push and create PR
5. Wait for CI checks
6. Request review
7. Merge after approval

### 3. Code Review Checklist

- [ ] All CI checks passing
- [ ] Code coverage maintained or improved
- [ ] No linting warnings
- [ ] Tests added for new features
- [ ] Documentation updated
- [ ] Breaking changes documented

## Resources

- **GitHub Actions**: https://docs.github.com/actions
- **Codecov**: https://docs.codecov.com/
- **Solhint**: https://github.com/protofire/solhint
- **ESLint**: https://eslint.org/docs/
- **Prettier**: https://prettier.io/docs/
- **Hardhat**: https://hardhat.org/docs

## Summary

The CI/CD pipeline provides:

✅ **Automated testing** on every push and PR
✅ **Multi-platform support** (Ubuntu + Windows)
✅ **Multiple Node.js versions** (18.x, 20.x)
✅ **Comprehensive code quality checks**
✅ **Test coverage reporting** with Codecov
✅ **Easy local development** workflow
✅ **Branch protection** enforcement
✅ **Manual workflow** for on-demand testing

All tools are configured and ready to use!
