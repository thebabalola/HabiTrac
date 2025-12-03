# Contract Deployment Guide

## Prerequisites

1. **Get Base Sepolia Testnet ETH**
   - Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Connect your wallet and request testnet ETH

2. **Get BaseScan API Key** (for contract verification)
   - Visit: https://basescan.org/myapikey
   - Sign up and create an API key

## Step 1: Configure Environment

1. Navigate to contracts directory:
   ```bash
   cd contracts/habitrac
   ```

2. Create `.env` file:
   ```bash
   # Copy the example (if it exists) or create manually
   touch .env
   ```

3. Add the following to `.env`:
   ```env
   PRIVATE_KEY=your_private_key_here
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   BASESCAN_API_KEY=your_basescan_api_key_here
   ```

   **⚠️ IMPORTANT**: Never commit your `.env` file! It contains your private key.

## Step 2: Compile Contract

```bash
npm run compile
```

This should output:
```
Compiled 3 Solidity files successfully
```

## Step 3: Deploy to Base Sepolia

```bash
npm run deploy:base-sepolia
```

Expected output:
```
Deploying HabiTrac contract...

=== Deployment Successful ===
Contract Address: 0x...
Network: baseSepolia
Chain ID: 84532
============================

Deployment info saved to: deployments/baseSepolia.json

To verify the contract, run:
npx hardhat verify --network baseSepolia 0x...
```

**Save the contract address** - you'll need it for the frontend!

## Step 4: Verify Contract

After deployment, verify the contract on BaseScan:

```bash
npm run verify:base-sepolia
```

Or manually:
```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

## Step 5: Update Frontend

1. Navigate to frontend directory:
   ```bash
   cd ../../frontend
   ```

2. Create `.env.local` file:
   ```bash
   touch .env.local
   ```

3. Add the deployed contract address:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...your_contract_address...
   NEXT_PUBLIC_CHAIN_ID=84532
   ```

4. Start the frontend:
   ```bash
   npm run dev
   ```

## Deployment to Base Mainnet

For mainnet deployment, follow the same steps but:

1. Update `.env` with mainnet RPC:
   ```env
   BASE_RPC_URL=https://mainnet.base.org
   ```

2. Deploy:
   ```bash
   npm run deploy:base
   ```

3. Verify:
   ```bash
   npm run verify:base
   ```

## Troubleshooting

### "Insufficient funds"
- Make sure you have Base Sepolia ETH in your wallet
- Get testnet ETH from the faucet

### "Contract verification failed"
- Make sure BASESCAN_API_KEY is set correctly
- Wait a few minutes after deployment before verifying
- Check that the contract address is correct

### "Nonce too high"
- Reset your wallet's nonce or wait a bit
- Make sure previous transactions are confirmed

## Contract Addresses

After deployment, contract addresses are saved in:
- `contracts/habitrac/deployments/baseSepolia.json` (testnet)
- `contracts/habitrac/deployments/base.json` (mainnet)

These files are gitignored to protect your deployment information.

