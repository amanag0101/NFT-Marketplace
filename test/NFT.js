const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", () => {
  const deployFixture = async () => {
    const [...accounts] = await ethers.getSigners();

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy();

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(await nftMarket.getAddress());

    return { accounts, nftMarket, nft };
  };

  describe("Deployment", async () => {
    it("Should have correct name and symbol", async function () {
      const { nft } = await deployFixture();

      expect(await nft.name()).to.equal("GameItem");
      expect(await nft.symbol()).to.equal("ITM");
    });

    it("Should create a new NFT and mint it", async () => {
      const { accounts, nft } = await deployFixture();
      await nft.connect(accounts[0]).createToken("https://www.google.com");
      expect(await nft.ownerOf(1)).to.equal(accounts[0].address);
    });

    it("Should return the correct tokenURI", async () => {
      const { accounts, nft } = await deployFixture();
      await nft.connect(accounts[0]).createToken("https://www.google.com");
      expect(await nft.getTokenURI(1)).to.equal("https://www.google.com");
    });
  });
});
