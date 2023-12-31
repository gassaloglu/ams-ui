import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Axios from 'axios';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Auth from './routes/Auth';
import { Protected, EmployeeOnly } from './routes/Protected';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import { Booking, BookingErrorBoundary, bookingLoader } from './routes/Booking';
import { CheckIn, CheckInErrorBoundary, checkInLoader } from './routes/CheckIn';
import { Flights, FlightsErrorBoundary, flightsLoader } from './routes/Flights';

import { Dashboard, DashboardErrorBoundary } from './routes/Dashboard';
import AddEmployee from './routes/dashboard/AddEmployee';
import AddFlight from './routes/dashboard/AddFlight';
import AddMoney from './routes/dashboard/AddMoney';
import AddPlane from './routes/dashboard/AddPlane';
import CheckInPanel from './routes/dashboard/CheckInPanel';
import DashboardIndex from './routes/dashboard/DashboardIndex';
import ListChild from './routes/dashboard/ListChild';
import ListCIP from './routes/dashboard/ListCIP';
import ListDisabled from './routes/dashboard/ListDisabled';
import ListEmployee from './routes/dashboard/ListEmployee';
import { ListFlight, listFlightLoader } from './routes/dashboard/ListFlight';
import ListLuggage from './routes/dashboard/ListLuggage';
import ListMeal from './routes/dashboard/ListMeal';
import { ListPassenger, listPassengerLoader } from './routes/dashboard/ListPassenger';
import { ListPlane, listPlaneLoader } from './routes/dashboard/ListPlane';
import { ListUser, listUserLoader } from './routes/dashboard/ListUser';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const user = JSON.parse(localStorage.getItem('user'));
export const axios = Axios.create({
  headers: user ? { Authorization: `Bearer ${user.token}` } : {},
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
        path: "/flights/:from/:to/:date",
        loader: flightsLoader,
        element: <Flights />,
        errorElement: <FlightsErrorBoundary />,
      },
      {
        path: "/booking/:flight_number/:plan",
        loader: bookingLoader,
        element: <Protected Layout={Booking} />,
        errorElement: <BookingErrorBoundary />,
      },
      {
        path: "/checkin/:pnr/:surname",
        loader: checkInLoader,
        element: <CheckIn />,
        errorElement: <CheckInErrorBoundary />,
      },
      {
        path: "/dashboard",
        element: <EmployeeOnly Layout={Dashboard} />,
        children: [
          {
            index: true,
            element: <DashboardIndex />,
          },
          {
            path: "list-flight",
            element: <ListFlight />,
            loader: listFlightLoader,
          },
          {
            path: "list-plane",
            element: <ListPlane />,
            loader: listPlaneLoader,
          },
          {
            path: "list-passenger",
            element: <ListPassenger />,
            loader: listPassengerLoader,
          },
          {
            path: "list-cip",
            element: <ListCIP />
          },
          {
            path: "list-child",
            element: <ListChild />
          },
          {
            path: "list-disabled",
            element: <ListDisabled />
          },
          {
            path: "list-luggage",
            element: <ListLuggage />
          },
          {
            path: "list-meal",
            element: <ListMeal />
          },
          {
            path: "list-employee",
            element: <ListEmployee />
          },
          {
            path: "list-user",
            element: <ListUser />,
            loader: listUserLoader,
          },
          {
            path: "add-plane",
            element: <AddPlane />
          },
          {
            path: "add-employee",
            element: <AddEmployee />
          },
          {
            path: "add-money",
            element: <AddMoney />
          },
          {
            path: "add-flight",
            element: <AddFlight />
          },
          {
            path: "check-in",
            element: <CheckInPanel />
          }
        ].map(route => Object.assign(route, { errorElement: <DashboardErrorBoundary /> }))
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
