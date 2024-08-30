import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import RootLayout from './layout/RootLayout';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';

import { Question, NotFound, SingleQuestion, Success, UserNFTs } from './pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<NotFound />}>
      <Route index element={<App />} />
      <Route path="question" element={<Question />} />
      <Route path="question/:id" element={<SingleQuestion />} />
      <Route path="finish" element={<Success />} />
      <Route path="my-nft" element={<UserNFTs />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
