import { Stack, Drawer, ListItemButton, ListItemText, ListItemIcon, Toolbar, List, Divider, Typography } from '@mui/material';
import { Outlet, NavLink as NavLinkBase } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

import { ConnectingAirports, Warehouse, PersonAddAlt1, AttachMoney, AirplaneTicket, Airlines, FlightTakeoff, Flight, AirlineSeatReclineNormal, Star, Stroller, Accessible, Luggage, Restaurant, Badge, Person, PersonAdd, PersonAddAlt } from '@mui/icons-material';

const DRAWER_WIDTH = "300px";

const tools = {
  listFlights: { name: "List flights", link: "/dashboard/list-flight", icon: <FlightTakeoff /> },
  listPlanes: { name: "List planes", link: "/dashboard/list-plane", icon: <Flight /> },
  listPassengers: { name: "List passengers", link: "/dashboard/list-passenger", icon: <AirlineSeatReclineNormal /> },
  listCip: { name: "List CIP passengers", link: "/dashboard/list-cip", icon: <Star /> },
  listChild: { name: "List child passengers", link: "/dashboard/list-child", icon: <Stroller /> },
  listDisabled: { name: "List disabled passengers", link: "/dashboard/list-disabled", icon: <Accessible /> },
  listLuggage: { name: "List luggages", link: "/dashboard/list-luggage", icon: < Luggage /> },
  listMeal: { name: "List meal orders", link: "/dashboard/list-meal", icon: <Restaurant /> },
  listEmployee: { name: "List employees", link: "/dashboard/list-employee", icon: <Badge /> },
  listUser: { name: "List users", link: "/dashboard/list-user", icon: <Person /> },
  addPlane: { name: "Add plane", link: "/dashboard/add-plane", icon: <Warehouse /> },
  addPlane: { name: "Add employee", link: "/dashboard/add-employee", icon: <PersonAddAlt1 /> },
  addMoney: { name: "Add money to user", link: "/dashboard/add-money", icon: <AttachMoney /> },
  addFlight: { name: "Add flight", link: "/dashboard/add-flight", icon: <ConnectingAirports /> },
  checkIn: { name: "Check-in", link: "/dashboard/check-in", icon: <AirplaneTicket /> },
};

const toolsOfPermission = {
  "flight_planner": [
    tools.listFlights,
    tools.listPassengers,
    tools.addFlight,
  ],
  "passenger_services": [
    tools.listFlights,
    tools.listPassengers,
    tools.listCip,
    tools.listChild,
    tools.listDisabled,
    tools.checkIn,
  ],
  "ground_services": [
    tools.listLuggage,
    tools.listPlanes,
    tools.listMeal,
  ],
  "seller": [
    tools.addMoney
  ],
  "admin": Object.values(tools),
};

const NavLink = React.forwardRef((props, ref) => (
  <NavLinkBase
    ref={ref}
    {...props}
    style={({ isActive }) => {
      return {
        backgroundColor: isActive ? "#1565c0" : "",
      };
    }}
  />
));

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Stack direction='row'>
      <Drawer
        anchor='left'
        variant='permanent'
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            color: "white",
            backgroundColor: "primary.main"
          },
        }}
      >
        <Toolbar
          sx={{
            p: 2,
            minWidth: '300px',
            alignItems: 'center',
            justifyContent: 'center',
            flexFlow: 'column'
          }}>
          <Airlines sx={{ fontSize: '150px' }} />
          <Typography variant='h6'> AIRLINE COMPANY </Typography>
        </Toolbar>
        <Divider />
        <List>
          {
            toolsOfPermission[user.permission].map(tool =>
              <ListItemButton key={tool.name} LinkComponent={NavLink} to={tool.link}>
                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', color: 'white' }}>
                  {tool.icon}
                </ListItemIcon>
                <ListItemText primary={tool.name} />
              </ListItemButton>
            )
          }
        </List>
      </ Drawer >
      <Outlet />
    </Stack>
  );
}