const hre = require("hardhat");

async function main() {
  const HabiTrac = await hre.ethers.getContractFactory("HabiTrac");
  const habitrac = await HabiTrac.deploy();

  await habitrac.waitForDeployment();

  const address = await habitrac.getAddress();
  console.log("HabiTrac deployed to:", address);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

