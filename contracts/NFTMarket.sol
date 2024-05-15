//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarket {
    error Restricted();

    struct MarketItem {
        address nftContract;
        // owner of nft marketplace portal who gets the listing fee
        address payable owner;
        address payable seller;
        uint256 itemId;
        string itemName;
        string itemDescription;
        uint256 tokenId;
        uint256 price;
        bool isSold;
    }

    event MarketItemCreated(
        address indexed nftContract,
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    event MarketItemSold(
        address indexed nftContract,
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );

    // owner of the nft is the market contract. The owner will make a commision on every item sold.
    address payable private owner;
    // the amount that the NFT creator needs to pay to upload the NFT
    uint256 private LISTING_PRICE = 0.1 ether;
    // to assign uinque id to a market item
    uint256 private marketItemIdCounter = 0;
    // to assign uinque id to a sold market item
    uint256 private soldMarketItemIdCounter = 0;
    // maps item id to the market item
    mapping(uint256 => MarketItem) private marketItems;
    bool private locked = false;

    modifier reEntrancyGuard() {
        if (locked) revert Restricted();

        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    function createMarketItem(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price,
        string memory _itemName,
        string memory _itemDescription
    ) public payable reEntrancyGuard {
        require(_price > 0, "Price should at least be 1 wei");
        require(
            msg.value == LISTING_PRICE,
            "Price must be equal to listing price"
        );
        require(!isEmptyString(_itemName), "Item name cannot be empty");
        require(
            !isEmptyString(_itemDescription),
            "Item description cannot be empty"
        );

        uint256 marketItemId = generateMarketItemId();

        marketItems[marketItemId] = MarketItem(
            _nftContract,
            payable(address(owner)),
            payable(msg.sender),
            marketItemId,
            _itemName,
            _itemDescription,
            _tokenId,
            _price,
            false
        );

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        emit MarketItemCreated(
            _nftContract,
            marketItemId,
            _tokenId,
            msg.sender,
            _price
        );
    }

    function createMarketSale(
        address _nftContract,
        uint256 _marketItemId
    ) public payable reEntrancyGuard {
        require(
            msg.value == marketItems[_marketItemId].price,
            "Please pay the asking price in order to complete the purchase"
        );

        // transfer crypto into the wallet of seller
        marketItems[_marketItemId].seller.transfer(msg.value);

        // transfer NFT ownership to the buyer
        IERC721(_nftContract).transferFrom(
            address(this),
            msg.sender,
            marketItems[_marketItemId].tokenId
        );

        marketItems[_marketItemId].owner = payable(msg.sender);
        marketItems[_marketItemId].isSold = true;

        generateSoldMarketItemId();

        emit MarketItemSold(
            _nftContract,
            _marketItemId,
            marketItems[_marketItemId].tokenId,
            msg.sender,
            marketItems[_marketItemId].price
        );
    }

    function generateMarketItemId() private returns (uint256) {
        return ++marketItemIdCounter;
    }

    function generateSoldMarketItemId() private returns (uint256) {
        return ++soldMarketItemIdCounter;
    }

    function isEmptyString(string memory _string) internal pure returns (bool) {
        return bytes(_string).length == 0;
    }

    function getListingPrice() public view returns (uint256) {
        return LISTING_PRICE;
    }

    function getMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemsOnSaleByTheUser = 0;
        for (uint256 i = 1; i <= marketItemIdCounter; i++) {
            if (marketItems[i].seller == msg.sender && !marketItems[i].isSold) {
                itemsOnSaleByTheUser++;
            }
        }

        MarketItem[] memory items = new MarketItem[](
            marketItemIdCounter - soldMarketItemIdCounter - itemsOnSaleByTheUser
        );

        uint256 itemIndex = 0;
        for (uint256 i = 1; i <= marketItemIdCounter; i++) {
            if (!marketItems[i].isSold && marketItems[i].seller != msg.sender) {
                items[itemIndex++] = marketItems[i];
            }
        }

        return items;
    }

    function getMarketItemsPurchasedByAUser()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItemsOfTheUser = 0;
        for (uint256 i = 1; i <= marketItemIdCounter; i++) {
            if (marketItems[i].owner == msg.sender) {
                totalItemsOfTheUser++;
            }
        }

        MarketItem[] memory items = new MarketItem[](totalItemsOfTheUser);
        uint256 itemIndex = 0;

        for (uint256 i = 1; i <= marketItemIdCounter; i++) {
            if (marketItems[i].owner == msg.sender) {
                items[itemIndex++] = marketItems[i];
            }
        }

        return items;
    }

    function getMarketItemsOnSaleByAUser()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItemsOfTheUser = 0;
        for (uint256 i = 1; i <= marketItemIdCounter; i++) {
            if (marketItems[i].seller == msg.sender && !marketItems[i].isSold) {
                totalItemsOfTheUser++;
            }
        }

        MarketItem[] memory items = new MarketItem[](totalItemsOfTheUser);
        uint256 itemIndex = 0;

        for (uint256 i = 1; i <= marketItemIdCounter; i++) {
            if (marketItems[i].seller == msg.sender && !marketItems[i].isSold) {
                items[itemIndex++] = marketItems[i];
            }
        }

        return items;
    }
}
