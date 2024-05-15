const hre = require("hardhat");

async function main() {
  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  const marketAddress = await nftMarket.getAddress();

  console.log("nft market deployed to:", marketAddress);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketAddress);
  const nftAddress = await nft.getAddress();

  console.log("nft deployed to :", nftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
