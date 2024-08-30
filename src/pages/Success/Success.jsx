import useQuestionStore from '../../store/zustand';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import AnimateProvider from '../../components/AnimateProvider/AnimateProvider';
import Question from '../../components/Questions/Questions';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

import contractABI from '../../NFT.json';

import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNmUyNWQ1Ni0yOWIxLTRjMzgtOGIyMC04NWRkNzEwOTdkNWIiLCJlbWFpbCI6ImpheWFudGguc21zLmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjNjRjNmY4NWY2NmVmODBlMGU3ZSIsInNjb3BlZEtleVNlY3JldCI6ImM1YzFlMjUyMTg2MWVlY2Q5MDAwNzQ5NTg3OGI3OGMxZjJkZTQ1ZDI3Yzc2NjkzZjE2Zjg3YTY5ZjNiMDEwMWMiLCJleHAiOjE3NTY0OTkyNTJ9.rqb8oQ9loccRQM1OunlUVmjEIWqB4RAFEzNPUuRQCIE',
  pinataGateway: 'teal-late-haddock-980.mypinata.cloud',
}); // Update this path

// Pinata SDK setup

// Smart contract setup
const contractAddress = '0x95bBBbBC692bF3BE5C232e16efaDAb16b8F71496';

function Success() {
  const {
    trueAnswer,
    falseAnswer,
    resetQuestion,
    setTimeStamp,
    question: allQuestion,
  } = useQuestionStore();

  useEffect(() => {
    setTimeStamp(0);
  }, []);
  const navigate = useNavigate();
  const [isMinting, setIsMinting] = useState(false);
  const [metadataUri, setMetadataUri] = useState('');
  const { address, isConnected } = useAccount();

  const score = (trueAnswer * 100) / 5;
  const indxColor =
    score >= 60 ? '#10b981' : score >= 40 ? '#F59E0B' : '#dc2626';

  const uploadMetadata = async () => {
    const metadata = {
      name: 'Certificate of Achievement',
      description: `This certificate is awarded for achieving a score of ${score}`,
      image:
        'https://ipfs.io/ipfs/Qmd4Eu89kUzPcmGCkeg8wmyYAPqbM18WRVP6cCjq4efqCj',
      attributes: [
        { trait_type: 'Score', value: score },
        { trait_type: 'Correct Answers', value: trueAnswer },
        { trait_type: 'Incorrect Answers', value: falseAnswer },
      ],
    };

    console.log('Uploading metadata to IPFS...');
    console.log('Metadata:', metadata);

    try {
      // Convert metadata to a Blob and then to a File
      const file = new File([JSON.stringify(metadata)], 'metadata.json', {
        type: 'application/json',
      });

      // Upload file to Pinata
      const upload = await pinata.upload.file(file);

      // Get the IPFS hash of the uploaded file
      const metadataUri = `ipfs://${upload.IpfsHash}`;
      console.log('Metadata URI:', metadataUri);
      return metadataUri;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
    }
  };
  const mintNFT = async (metadataUri) => {
    try {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error('No wallet detected');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      console.log(signer);
      console.log(contract);
      // Get the current token ID

      // Mint the NFT
      const tx = await contract.mintTo(address, metadataUri);
      console.log(tx);
      console.log('Transaction sent:', tx.hash);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction mined:', receipt.transactionIndex);
      console.log('Block number:', receipt.blockNumber);

      alert('NFT Minted Successfully!');
    } catch (err) {
      console.error('Error minting NFT:', err);
      if (err.message === 'No wallet detected') {
        console.warn('Please connect your MetaMask wallet.');
      } else if (err.code === 'UNSUPPORTED_OPERATION') {
        console.warn(
          'The Ethereum node does not support sending transactions.'
        );
        console.warn(
          'Please check your wallet settings or network connection.'
        );
      } else {
        console.error(err);
      }
    }
  };

  const handleClick = async () => {
    if (score > 40 && isConnected) {
      setIsMinting(true);
      try {
        const uri = await uploadMetadata();
        if (uri) {
          await mintNFT(uri);
        }
      } catch (err) {
        console.error('Error during minting process:', err);
      }
      setIsMinting(false);
    }
    resetQuestion();
    navigate('/');
  };

  return (
    <AnimateProvider className="flex flex-col space-y-10 md:max-w-xl md:mx-auto">
      <h3 className="text-lg text-center text-neutral-900 font-bold md:text-xl">
        Your Final score is
      </h3>

      <h1
        style={{ background: indxColor }}
        className="text-5xl font-bold mx-auto p-5 rounded-full md:text-6xl text-neutral-100"
      >
        {score}
      </h1>

      <div className="text-xs md:text-sm text-neutral-600 font-medium flex flex-col space-y-1">
        <p className="flex justify-between">
          Correct Answer <span className="text-green-600">{trueAnswer}</span>
        </p>
        <p className="flex justify-between">
          Wrong Answer <span className="text-red-600">{falseAnswer}</span>
        </p>
        <p className="flex justify-between">
          Answer Submitted{' '}
          <span className="text-purple-600">{trueAnswer + falseAnswer}</span>
        </p>
      </div>

      <button
        onClick={handleClick}
        disabled={isMinting}
        className={`grid place-items-center text-neutral-50 rounded-full py-2 hover:text-neutral-50 text-sm font-semibold ${
          score > 40 ? 'bg-orange-500' : 'bg-gray-400'
        }`}
      >
        {isMinting ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Minting...
          </span>
        ) : score > 40 ? (
          'Mint Certificate & Back to dashboard'
        ) : (
          'Back to dashboard'
        )}
      </button>

      {/* Summary */}
      <h3 className="text-center text-neutral-600 font-semibold md:text-lg pt-[100px]">
        Answer
      </h3>
      {allQuestion.map((question, i) => (
        <Question
          key={i}
          singleQuestion={question}
          id={i + 1}
          summary={true}
          trueAnswer={question.correct_answer}
        />
      ))}
    </AnimateProvider>
  );
}

export default Success;
