import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Axios from 'axios';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Auth from './routes/Auth';
import Protected from './routes/Protected';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Profile from './routes/Profile';
import Book from './routes/Book';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

export const axios = Axios.create({
  baseURL: "http://localhost:5500",
});

export const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const router = createBrowserRouter([
  {
    element: <Auth />,
    path: '/',
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/book",
        element: <Book />,
      },
      {
        path: "/profile",
        element: <Protected Layout={Profile} />
      },
    ],
  },
])

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
