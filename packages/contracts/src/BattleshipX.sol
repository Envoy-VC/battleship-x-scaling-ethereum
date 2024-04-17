// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {RMRKAbstractNestable} from
    "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractNestable.sol";
import {RMRKTokenURIPerToken} from "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKTokenURIPerToken.sol";
import {RMRKImplementationBase} from
    "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKImplementationBase.sol";
import {RMRKSoulbound} from "@rmrk-team/evm-contracts/contracts/RMRK/extension/soulbound/RMRKSoulbound.sol";
import {IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {BattleshipURI} from "./lib/BattleshipURI.sol";

import "./interfaces/IBattleshipGame.sol";
import "./lib/GameLibrary.sol";

error ERC721OutOfBoundsIndex(address owner, uint256 index);
error UsernameTaken();
error NotANewUser();

struct User {
    address owner;
    bool taken;
}

contract BattleshipX is RMRKAbstractNestable, RMRKTokenURIPerToken, RMRKSoulbound, IBattleshipGame {
    mapping(address owner => mapping(uint256 index => uint256)) public _ownedTokens;
    mapping(string username => User) public users;
    mapping(uint256 tokenId => uint256) private _ownedTokensIndex;
    uint256[] private _allTokens;
    mapping(uint256 tokenId => uint256) private _allTokensIndex;
    mapping(address => bool) private _autoAcceptCollection;

    // Game
    uint256 public gameId;
    mapping(uint256 => Game) public games;

    // Constructor
    constructor(
        string memory collectionMetadata,
        uint256 maxSupply,
        address royaltyRecipient,
        uint16 royaltyPercentageBps
    )
        RMRKImplementationBase(
            "BattleshipX",
            "BATTLESHIP-X",
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyPercentageBps
        )
    {}

    /// @notice This function is used to mint the initial user NFT and the nested battleships.
    /// @param _user Address of the user to mint the NFTs to.
    /// @param username Username of the user.
    /// @return The User NFT Token ID
    function register(address _user, string memory username) public returns (uint256) {
        usernameAvailable(username);
        newUser(_user);

        users[username] = User(_user, true);

        // Mint the User NFT
        (uint256 userTokenId,) = _prepareMint(1);
        string memory userURI = BattleshipURI.constructUserURI();
        _safeMint(_user, userTokenId, "");
        _setTokenURI(userTokenId, userURI);

        // Mint Nested Battleships
        string[5] memory uris = [
            BattleshipURI.constructBattleshipURI(),
            BattleshipURI.constructCarrierURI(),
            BattleshipURI.constructDestroyerURI(),
            BattleshipURI.constructSubmarineURI(),
            BattleshipURI.constructCruiserURI()
        ];

        (uint256 nextToken, uint256 totalSupplyOffset) = _prepareMint(5);

        for (uint256 i = nextToken; i < totalSupplyOffset;) {
            _nestMint(address(this), i, userTokenId, "");
            _setTokenURI(i, uris[i - nextToken]);
            unchecked {
                ++i;
            }
        }

        return userTokenId;
    }

    /// @notice This method is used to check the availability of username
    /// @param _name The username to check
    function usernameAvailable(string memory _name) public view {
        bool exists = users[_name].taken;
        if (exists) revert UsernameTaken();
    }

    /// @notice This method is used to check if the user already exists
    /// @param _user The address of the user to check
    function newUser(address _user) public view {
        uint256 balance = balanceOf(_user);
        if (balance > 0) revert NotANewUser();
    }

    function existingUser(address _user) public view {
        uint256 balance = balanceOf(_user);
        if (balance == 0) revert UserNotFound();
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
        (bool success,) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function getGame(uint256 _gameId) external view returns (Game memory) {
        return games[_gameId];
    }

    function createGame(address _player1, address _player2) external {
        if (_player1 == _player2) {
            revert SamePlayer();
        }

        existingUser(_player1);
        existingUser(_player2);

        games[gameId] = Game({
            player1: Player(_player1, "", new uint8[](100), 0),
            player2: Player(_player2, "", new uint8[](100), 0),
            next_turn: PlayerType.Player1,
            hasStarted: false,
            hasEnded: false,
            winner: address(0)
        });

        gameId++;
    }

    function startGame(uint256 _gameId) internal {
        Game storage game = games[_gameId];
        if (
            keccak256(abi.encodePacked(game.player1.storeId)) != keccak256(abi.encodePacked(""))
                && keccak256(abi.encodePacked(game.player2.storeId)) != keccak256(abi.encodePacked(""))
        ) {
            game.hasStarted = true;
        }
    }

    function setStoreId(PlayerType player, uint256 _gameId, string memory _storeId) external {
        Game storage game = games[_gameId];
        if (game.hasStarted) {
            revert GameAlreadyStarted();
        }

        if (player == PlayerType.Player1) {
            GameLibrary.onlyPlayer(game, player);
            game.player1.storeId = _storeId;
        } else if (player == PlayerType.Player2) {
            GameLibrary.onlyPlayer(game, player);
            game.player2.storeId = _storeId;
        } else {
            revert InvalidPlayer();
        }
        startGame(_gameId);
    }

    function playMove(PlayerType player, uint256 _gameId, uint8 move) external {
        Game storage game = games[_gameId];
        if (game.hasEnded) {
            revert GameEnded();
        }

        if (player != game.next_turn) {
            revert InvalidTurn();
        }

        if (player == PlayerType.Player1) {
            GameLibrary.onlyPlayer(game, player);
            GameLibrary.checkDuplicate(game.player1.moves, move);
            game.player1.moves[game.player1.moveIndex] = move;
            game.player1.moveIndex++;
            game.next_turn = PlayerType.Player2;
        } else if (player == PlayerType.Player2) {
            GameLibrary.onlyPlayer(game, player);
            GameLibrary.checkDuplicate(game.player2.moves, move);
            game.player2.moves[game.player2.moveIndex] = move;
            game.player2.moveIndex++;
            game.next_turn = PlayerType.Player1;
        } else {
            revert InvalidPlayer();
        }
    }

    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(RMRKSoulbound, RMRKAbstractNestable)
        returns (bool)
    {
        return type(IERC721Enumerable).interfaceId == interfaceId || RMRKAbstractNestable.supportsInterface(interfaceId)
            || RMRKSoulbound.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(RMRKSoulbound, RMRKAbstractNestable)
    {
        RMRKSoulbound._beforeTokenTransfer(from, to, tokenId);
        RMRKAbstractNestable._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }

        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    // IERC721Enumerable (Based on OpenZeppelin implementation)

    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        if (index >= balanceOf(owner)) {
            revert ERC721OutOfBoundsIndex(owner, index);
        }
        return _ownedTokens[owner][index];
    }

    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view virtual returns (uint256) {
        if (index >= totalSupply()) {
            revert ERC721OutOfBoundsIndex(address(0), index);
        }
        return _allTokens[index];
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete _allTokensIndex[tokenId];
        _allTokens.pop();
    }

    function setAutoAcceptCollection(address collection, bool autoAccept) public virtual onlyOwnerOrContributor {
        _autoAcceptCollection[collection] = autoAccept;
    }

    function _afterAddChild(uint256 tokenId, address childAddress, uint256 childId, bytes memory)
        internal
        virtual
        override
    {
        // Auto accept children if they are from known collections
        if (_autoAcceptCollection[childAddress]) {
            _acceptChild(tokenId, _pendingChildren[tokenId].length - 1, childAddress, childId);
        }
    }
}
