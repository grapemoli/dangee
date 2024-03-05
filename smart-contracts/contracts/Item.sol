// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Item is ERC721, ERC721URIStorage, AccessControl {
    /****************
     * Attributes.
     ****************/
    bytes32 public constant MINTER_ROLE = keccak256 ("MINTER_ROLE");
    uint256 private _nextTokenId;
    mapping (uint256 => string) public _tokenURIMap;        // tokenId => tokenURI
    mapping (uint256 => uint256) public _priceMap;          // tokenId => price



    /****************
     * Constructor.
     ****************/
    constructor (address defaultAdmin, address minter) ERC721 ("Item", "ITM") {
        _grantRole (DEFAULT_ADMIN_ROLE, defaultAdmin);   // i.e., contract owner.
        _grantRole (MINTER_ROLE, minter);                // i.e., platform users.
    }



    /****************
     * Events.
     ****************/
    // This event fires when an item has been minted successfully, called after the safeMint()
    // method has finished.
    event NewItem (address sender, uint256 tokenId, uint256 price);
    event PriceUpdate (address indexed owner, uint256 tokenId, uint256 oldPrice, uint256 newPrice);



    /****************
     * Methods.
     ****************/
    // **** GETTERS / SETTERS **** //
    // Since _nextTokenId will always be one greater than the most-recently created tokenId,
    // _nextTokenId also doubles as the total number of items minted.
    function totalItems () public view virtual returns (uint256) {
        return _nextTokenId;
    }

    function getPrice (uint256 tokenId) public view virtual returns (uint256) {
        return _priceMap [tokenId];
    }

    // Set the parameter-related NFT's price. Only the NFT owner or admin can update the price.
    function updatePrice (uint256 tokenId, uint256 newPrice) public {
        require (msg.sender == ownerOf (tokenId) || hasRole (DEFAULT_ADMIN_ROLE, msg.sender), "You are not the owner of this NFT");

        uint256 oldPrice = _priceMap [tokenId];
        _priceMap [tokenId] = newPrice;

        emit PriceUpdate (msg.sender, tokenId, oldPrice, newPrice);
    }


    // **** MINTING **** //
    // This minting function takes in the parameters of (1) the recipient's address and the
    // (2) URI. Since the URI is stored as the NFTs metadata on the blockchain, we store the IPFS hash
    // relating to the NFT.
    function safeMint (address to, string memory uri) public onlyRole (MINTER_ROLE) {
        // Before minting, that we don't already have the max number of NFTs on the platform.
        require (_nextTokenId <  (2^256 - 1), 'Reached max number of NFTs');

        uint256 tokenId = _nextTokenId++;   // Note that the order is (1) tokenId=_nextTokenId, (2) increment
        _safeMint (to, tokenId);
        _setTokenURI (tokenId, uri);

        // Set the mappings. By default, the price is 0.
        _priceMap [tokenId] = 0;
        _tokenURIMap [tokenId] = uri;

        emit NewItem (to, tokenId, 0);
    }

    // @override safeMint () to allow the caller to include the price of the NFT being minted.
    function safeMintWithPrice (address to, string memory uri, uint256 price) public onlyRole (MINTER_ROLE) {
        // Before minting, that we don't already have the max number of NFTs on the platform.
        require (_nextTokenId <  (2^256 - 1), 'Reached max number of NFTs');

        uint256 tokenId = _nextTokenId++;   // Note that the order is (1) tokenId=_nextTokenId, (2) increment
        _safeMint (to, tokenId);
        _setTokenURI (tokenId, uri);

        // Set the mappings.
        _priceMap [tokenId] = price;
        _tokenURIMap [tokenId] = uri;

        emit NewItem (to, tokenId, 0);
    }


    // **** ADMIN / ROLE-RELATED **** //
    // Only the admin can grant users access to minting.
    function grantMintRole (address newMinter) public onlyRole (DEFAULT_ADMIN_ROLE) {
        grantRole (MINTER_ROLE, newMinter);
    }

    // Returns a boolean of if the user can mint or not.
    function canMint () public view returns (bool) {
        return (hasRole (MINTER_ROLE, msg.sender) == true);
    }



    /****************
     * Solidity-Required Overrides.
     ****************/
    function tokenURI (uint256 tokenId)
    public
    view
    override (ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface (bytes4 interfaceId)
    public
    view
    override (ERC721, ERC721URIStorage, AccessControl)
    returns (bool)
    {
        return super.supportsInterface (interfaceId);
    }
}
