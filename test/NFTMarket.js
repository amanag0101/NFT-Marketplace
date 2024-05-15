const { expect } = require("chai");
const exp = require("constants");
const { ethers } = require("hardhat");

describe("NFT Market", () => {
  const LISTING_PRICE = ethers.parseEther("0.1");

  const deployFixture = async () => {
    const [nftMarketOwner, ...accounts] = await ethers.getSigners();

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.connect(nftMarketOwner).deploy();

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(await nftMarket.getAddress());

    return { nftMarketOwner, nftMarket, nft, accounts };
  };

  describe("Deployment", async () => {
    it("Should have correct listing price", async () => {
      const { nftMarket } = await deployFixture();

      expect(await nftMarket.getListingPrice()).to.equal(LISTING_PRICE);
    });

    it("Should create a new market item", async () => {
      const { nftMarket, nft, accounts } = await deployFixture();
      const nftAddress = await nft.getAddress();

      await nft.connect(accounts[0]).createToken("https://www.google.com");

      await nftMarket
        .connect(accounts[0])
        .createMarketItem(
          nftAddress,
          1,
          ethers.parseEther("5"),
          "Item name",
          "Item description",
          {
            value: LISTING_PRICE,
          }
        );

      const marketItems = await nftMarket.connect(accounts[1]).getMarketItems();
      expect(marketItems.length).to.equal(1);
      expect(marketItems[0].nftContract).to.equal(nftAddress);
      expect(marketItems[0].seller).to.equal(accounts[0].address);
      expect(marketItems[0].tokenId).to.equal(1);
      expect(marketItems[0].price).to.equal(ethers.parseEther("5"));
      expect(marketItems[0].isSold).to.equal(false);
      expect(marketItems[0].itemName).to.equal("Item name");
      expect(marketItems[0].itemDescription).to.equal("Item description");
    });

    it("Should sell an NFT item", async () => {
      const { nftMarket, nft, accounts } = await deployFixture();
      const nftAddress = await nft.getAddress();

      await nft.connect(accounts[0]).createToken("https://www.google.com");

      await nftMarket
        .connect(accounts[0])
        .createMarketItem(
          nftAddress,
          1,
          ethers.parseEther("5"),
          "Item name",
          "Item description",
          {
            value: LISTING_PRICE,
          }
        );

      await nftMarket
        .connect(accounts[1])
        .createMarketSale(nftAddress, 1, { value: ethers.parseEther("5") });

      const marketItems = await nftMarket.getMarketItems();
      const marketItemsPurchasedByTheUser = await nftMarket
        .connect(accounts[1])
        .getMarketItemsPurchasedByAUser();

      expect(marketItems.length).to.equal(0);
      expect(marketItemsPurchasedByTheUser.length).to.equal(1);
    });

    it("Should should get all the items purchased by the user", async () => {
      const { nftMarket, nft, accounts } = await deployFixture();
      const nftAddress = await nft.getAddress();

      await nft.connect(accounts[0]).createToken("https://www.google.com");

      await nftMarket
        .connect(accounts[0])
        .createMarketItem(
          nftAddress,
          1,
          ethers.parseEther("5"),
          "Item name",
          "Item description",
          {
            value: LISTING_PRICE,
          }
        );

      await nftMarket
        .connect(accounts[1])
        .createMarketSale(nftAddress, 1, { value: ethers.parseEther("5") });

      const marketItemsPurchasedByTheUser = await nftMarket
        .connect(accounts[1])
        .getMarketItemsPurchasedByAUser();

      expect(marketItemsPurchasedByTheUser.length).to.equal(1);
    });

    it("Should get all market items on sale of a user", async () => {
      const { nftMarket, nft, accounts } = await deployFixture();
      const nftAddress = await nft.getAddress();

      await nft.connect(accounts[0]).createToken("https://www.google.com");

      await nftMarket
        .connect(accounts[0])
        .createMarketItem(
          nftAddress,
          1,
          ethers.parseEther("5"),
          "Item name",
          "Item description",
          {
            value: LISTING_PRICE,
          }
        );

      const marketItems = await nftMarket
        .connect(accounts[0])
        .getMarketItemsOnSaleByAUser();

      expect(marketItems.length).to.equal(1);
    });
  });
});
