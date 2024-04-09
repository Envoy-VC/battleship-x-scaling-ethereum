// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {RMRKAbstractNestableMultiAsset} from "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractNestableMultiAsset.sol";
import {RMRKTokenURIPerToken} from "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKTokenURIPerToken.sol";
import {RMRKImplementationBase} from "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKImplementationBase.sol";


contract BattleshipX is RMRKAbstractNestableMultiAsset, RMRKTokenURIPerToken {
    // Events 
    // Variables
    uint256 private _pricePerMint;
    mapping(address => bool) private _autoAcceptCollection;

    // Constructor
    constructor(
      string memory collectionMetadata,
      uint256 maxSupply,
      address royaltyRecipient,
      uint16 royaltyPercentageBps,
      uint256 pricePerMint_
    )
        RMRKImplementationBase(
            "MyNFT2",
            "NFT2",
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyPercentageBps
        )
    {
      _pricePerMint = pricePerMint_;
}
    
    // Methods
    // Suggested Mint Functions
    /**
     * @notice Used to mint the desired number of tokens to the specified address.
     * @dev The "data" value of the "_safeMint" method is set to an empty value.
     * @dev Can only be called while the open sale is open.
     * @param to Address to which to mint the token
     * @param numToMint Number of tokens to mint
     * @return The ID of the first token to be minted in the current minting cycle
     */
    function mint(
        address to,
        uint256 numToMint
    ) public payable returns (uint256) {
        (uint256 nextToken, uint256 totalSupplyOffset) = _prepareMint(
            numToMint
        );
        _chargeMints(numToMint);

        for (uint256 i = nextToken; i < totalSupplyOffset; ) {
            _safeMint(to, i, "");
            unchecked {
                ++i;
            }
        }

        return nextToken;
    }
        
    /**
     * @notice Used to mint a desired number of child tokens to a given parent token.
     * @dev The "data" value of the "_safeMint" method is set to an empty value.
     * @dev Can only be called while the open sale is open.
     * @param to Address of the collection smart contract of the token into which to mint the child token
     * @param numToMint Number of tokens to mint
     * @param destinationId ID of the token into which to mint the new child token
     * @return The ID of the first token to be minted in the current minting cycle
     */
    function nestMint(
        address to,
        uint256 numToMint,
        uint256 destinationId
    ) public payable returns (uint256) {
        (uint256 nextToken, uint256 totalSupplyOffset) = _prepareMint(
            numToMint
        );
        _chargeMints(numToMint);

        for (uint256 i = nextToken; i < totalSupplyOffset; ) {
            _nestMint(to, i, destinationId, "");
            unchecked {
                ++i;
            }
        }

        return nextToken;
    }
    
    function _chargeMints(uint256 numToMint) internal {
        uint256 price = numToMint * _pricePerMint;
        if (price != msg.value) revert RMRKWrongValueSent();
    }

    /**
     * @notice Used to retrieve the price per mint.
     * @return The price per mint of a single token expressed in the lowest denomination of a native currency
     */
    function pricePerMint() public view returns (uint256) {
        return _pricePerMint;
    }

    /**
     * @notice Used to withdraw the minting proceedings to a specified address.
     * @dev This function can only be called by the owner.
     * @param to Address to receive the given amount of minting proceedings
     * @param amount The amount to withdraw
     */
    function withdrawRaised(address to, uint256 amount) external onlyOwner {
        _withdraw(to, amount);
    }

    /**
     * @notice Used to withdraw the minting proceedings to a specified address.
     * @param _address Address to receive the given amount of minting proceedings
     * @param _amount The amount to withdraw
     */
    function _withdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }
    
    function setAutoAcceptCollection(
        address collection,
        bool autoAccept
    ) public virtual onlyOwnerOrContributor {
        _autoAcceptCollection[collection] = autoAccept;
    }

    function _afterAddChild(
        uint256 tokenId,
        address childAddress,
        uint256 childId,
        bytes memory
    ) internal virtual override {
        // Auto accept children if they are from known collections
        if (_autoAcceptCollection[childAddress]) {
            _acceptChild(
                tokenId,
                _pendingChildren[tokenId].length - 1,
                childAddress,
                childId
            );
        }
    }
    
    function mintWithAssets(
        address to,
        uint64[] memory assetIds
    ) public virtual onlyOwnerOrContributor {
        (uint256 tokenId, ) = _prepareMint(1);
        _safeMint(to, tokenId, "");
        for (uint256 i; i < assetIds.length; ) {
            _addAssetToToken(tokenId, assetIds[i], 0);
            // Only first asset or assets added by token owner are auto-accepted, so we might need to accept for the rest of cases
            if (_pendingAssets[tokenId].length != 0) {
                _acceptAsset(tokenId, 0 , assetIds[i]);
            }
            unchecked {
                ++i;
            }
        }
    }
    
    function nestMintWithAssets(
        address parentContract,
        uint256 destinationId,
        uint64[] memory assetIds
    ) public virtual onlyOwnerOrContributor {
        (uint256 tokenId, ) = _prepareMint(1);
        uint256 length = assetIds.length;
        _nestMint(parentContract, tokenId, destinationId, "");
        for (uint256 i; i < length; ) {
            uint64 assetId = assetIds[i];
            _addAssetToToken(tokenId, assetId, 0);
            // Only first asset or assets added by token owner are auto-accepted, so we might need to accept for the rest of cases
            if (_pendingAssets[tokenId].length != 0) {
                _acceptAsset(tokenId, 0 , assetIds[i]);
            }
            unchecked {
                ++i;
            }
        }
    }
    
}
  