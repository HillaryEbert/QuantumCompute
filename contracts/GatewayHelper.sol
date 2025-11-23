// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { euint8, euint32, euint64 } from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title Gateway
 * @notice Helper library for Gateway API functions
 * @dev Provides utility functions for decryption requests and type conversions
 */
library Gateway {
    /**
     * @notice Check if public decryption is currently allowed
     * @return bool True if decryption is allowed, false otherwise
     */
    function isPublicDecryptAllowed() internal pure returns (bool) {
        return true; // For testing purposes
    }

    /**
     * @notice Convert euint8 to uint256 for Gateway operations
     * @param value The encrypted uint8 value
     * @return uint256 representation
     */
    function toUint256(euint8 value) internal pure returns (uint256) {
        return uint256(euint8.unwrap(value));
    }

    /**
     * @notice Request decryption of encrypted values
     * @param cts Array of ciphertexts to decrypt
     * @param callbackSelector Function selector for callback
     * @param signatures Number of signatures required
     * @param deadline Deadline timestamp
     * @param passSignatures Whether to pass signatures to caller
     * @return requestId The decryption request ID
     */
    function requestDecryption(
        uint256[] memory cts,
        bytes4 callbackSelector,
        uint256 signatures,
        uint256 deadline,
        bool passSignatures
    ) internal pure returns (uint256) {
        // Mock implementation for testing
        return uint256(keccak256(abi.encodePacked(cts, callbackSelector, signatures, deadline, passSignatures)));
    }
}
