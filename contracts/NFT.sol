//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    // to assign uinque id to a token
    uint256 private tokenIdCounter = 0;
    // maps tokenId to its resource link
    mapping(uint256 => string) private tokenURIs;
    address private marketplaceAddress;

    constructor(address _marketplpaceAddress) ERC721("GameItem", "ITM") {
        marketplaceAddress = _marketplpaceAddress;
    }

    function createToken(string memory _tokenURI) public returns (uint256) {
        _mint(msg.sender, generateTokenId());
        tokenURIs[tokenIdCounter] = _tokenURI;
        setApprovalForAll(marketplaceAddress, true);

        return tokenIdCounter;
    }

    function generateTokenId() private returns (uint256) {
        return ++tokenIdCounter;
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        return tokenURIs[_tokenId];
    }
}
