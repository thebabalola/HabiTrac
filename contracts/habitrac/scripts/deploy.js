const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying HabiTrac contracts...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy token contract first
  console.log("\n1. Deploying HabiTracToken...");
  const HabiTracToken = await hre.ethers.getContractFactory("HabiTracToken");
  const token = await HabiTracToken.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);
  
  // Deploy HabiTrac contract with token address
  console.log("\n2. Deploying HabiTrac...");
  const HabiTrac = await hre.ethers.getContractFactory("HabiTrac");
  const habitrac = await HabiTrac.deploy(tokenAddress);
  await habitrac.waitForDeployment();

  const address = await habitrac.getAddress();
  
  // Set HabiTrac as minter in token contract
  console.log("\n3. Setting HabiTrac as minter in token contract...");
  const setMinterTx = await token.setMinter(address, true);
  await setMinterTx.wait();
  console.log("Minter role configured");
  
  const network = hre.network.name;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  
  console.log("\n=== Deployment Successful ===");
  console.log("HabiTrac Contract Address:", address);
  console.log("Token Contract Address:", tokenAddress);
  console.log("Network:", network);
  console.log("Chain ID:", chainId.toString());
  console.log("============================\n");

  // Save deployment info
  const deploymentInfo = {
    address,
    tokenAddress,
    network,
    chainId: chainId.toString(),
    deployedAt: new Date().toISOString(),
  };

  const deploymentPath = path.join(__dirname, "../deployments", `${network}.json`);
  const deploymentsDir = path.dirname(deploymentPath);
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info saved to: ${deploymentPath}`);
  
  console.log("\nTo verify the contract, run:");
  console.log(`npx hardhat verify --network ${network} ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

