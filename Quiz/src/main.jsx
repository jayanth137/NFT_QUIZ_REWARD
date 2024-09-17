import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import RootLayout from './layout/RootLayout';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { Question, NotFound, SingleQuestion, Success, UserNFTs } from './pages';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

import process from 'process';
window.process = process;

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<NotFound />}>
            <Route index element={<App />} />
            <Route path="question" element={<Question />} />
            <Route path="question/:id" element={<SingleQuestion />} />
            <Route path="finish" element={<Success />} />
            <Route path="my-nft" element={<UserNFTs />} />
        </Route>,
    ),
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <TonConnectUIProvider manifestUrl="https://api.jsonsilo.com/public/f7e096e2-bbf6-46c7-a599-2a885fe59b2d">
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </TonConnectUIProvider>,
);
