import * as React from 'react';
import { useConnect } from 'wagmi';

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const connector = connectors[0]; // Select the first available connector

  return (
    <button
      className="text-white bg-black w-40 p-2"
      onClick={() => connect({ connector })}
    >
      Connect Wallet
    </button>
  );
}
