# FHEVM SDK - Next.js Example

This is a Next.js example application demonstrating the use of the Universal FHEVM SDK.

## Features

- ⚛️ **React Hooks**: `useFHEVM` and `useContract`
- 🔐 **FHE Encryption**: Support for all encryption types
- 📄 **Contract Interaction**: Store and retrieve encrypted data
- 🎨 **Modern UI**: Tailwind CSS with beautiful gradients
- 🔄 **Real-time Events**: Listen to contract events

## Getting Started

### Prerequisites

- Node.js >= 18
- MetaMask or compatible wallet

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextjs-app/
├── app/
│   ├── components/
│   │   ├── StatusBar.tsx
│   │   ├── EncryptionDemo.tsx
│   │   └── ContractInteraction.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.ts
```

## Usage

### 1. Initialize FHEVM

Click "Connect Wallet & Initialize" to connect your wallet and initialize the FHEVM SDK.

### 2. Encrypt Data

- Select an encryption type (uint8, uint16, uint32, uint64, etc.)
- Enter a value
- Click "Encrypt with FHE"
- View the encrypted result

### 3. Contract Interaction

- Enter a value and click "Store Encrypted Data"
- Use the Data ID to request decryption
- Query data information
- View real-time events

## Configuration

Update the contract address in `app/components/ContractInteraction.tsx`:

```typescript
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
```

## Deployment

### Vercel

```bash
npm run build
vercel deploy
```

### Other Platforms

```bash
npm run build
npm run start
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama fhEVM](https://docs.zama.ai/fhevm)

## License

MIT
