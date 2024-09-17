import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFT from '../../NFT.json'; // Replace with your actual ABI file
import { useAccount } from 'wagmi';

const CONTRACT_ADDRESS = '0x95bBBbBC692bF3BE5C232e16efaDAb16b8F71496'; // Replace with your contract address

const UserNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [errors, setErrors] = useState([]);
  const { address } = useAccount();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            MyNFT.abi,
            signer
          );

          const fetchNFTs = async () => {
            const tokenIds = await getNFTsOfUser(contract, address);
            const nftData = [];
            const fetchErrors = [];

            // Simulate sorting if the contract does not provide minting order
            // This is a placeholder and should be replaced with actual sorting if available
            const sortedTokenIds = tokenIds.sort((a, b) => b - a); // Assuming higher tokenId means newer

            await Promise.all(
              sortedTokenIds.map(async (tokenId) => {
                try {
                  const metadata = await getNFTMetadata(contract, tokenId);
                  nftData.push({ tokenId, metadata });
                } catch (error) {
                  fetchErrors.push({ tokenId, error });
                }
              })
            );

            setNfts(nftData);
            setErrors(fetchErrors);
          };

          if (address) {
            fetchNFTs();
          }
        } catch (error) {
          console.error('Error initializing provider:', error);
        }
      } else {
        console.error('Ethereum wallet is not connected');
      }
    };
    init();
  }, [address]);

  const getNFTsOfUser = async (contract, userAddress) => {
    try {
      const totalSupply = await contract.totalSupply();
      const tokenIds = [];
      for (let i = 0; i < Number(totalSupply); i++) {
        const tokenId = i;
        const owner = await contract.ownerOf(tokenId);
        if (owner.toLowerCase() === userAddress.toLowerCase()) {
          tokenIds.push(tokenId.toString());
        }
      }
      return tokenIds;
    } catch (error) {
      console.error('Error retrieving NFTs:', error);
      return [];
    }
  };

  const getNFTMetadata = async (contract, tokenId) => {
    try {
      const tokenURI = await contract.tokenURI(tokenId);
      const metadataUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const response = await fetch(metadataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      throw new Error(
        `Error retrieving NFT metadata for tokenId ${tokenId}: ${error.message}`
      );
    }
  };

  return (
    <div className="nft-viewer">
      <h1>Your NFTs</h1>
      {nfts.length > 0 ? (
        <div className="nft-list grid grid-cols-3 gap-4 ">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="nft-item border-2 border-black ">
              <h2>Token ID: {nft.tokenId}</h2>
              {nft.metadata ? (
                <div>
                  <img
                    src={nft.metadata.image}
                    alt={`NFT ${nft.tokenId}`}
                    className="nft-image w-40 h-40"
                  />
                  <h3>{nft.metadata.name}</h3>
                  <p>{nft.metadata.description}</p>
                  <div className="nft-attributes">
                    {nft.metadata.attributes.map((attribute, index) => (
                      <div key={index} className="nft-attribute">
                        <strong>{attribute.trait_type}:</strong>{' '}
                        {attribute.value}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>Metadata not available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No NFTs found</p>
      )}
      {errors.length > 0 && (
        <div className="error-list mt-4">
          <h2>Errors Encountered</h2>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                Token ID: {error.tokenId} - Error: {error.error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserNFTs;
