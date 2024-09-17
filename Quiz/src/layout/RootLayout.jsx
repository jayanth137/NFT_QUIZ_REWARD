// src/RootLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { config } from '../config/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <main className="bg-neutral-50 font-Inter">
          <Navbar />

          <div className="p-5 md:py-10 md:px-10 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default RootLayout;
