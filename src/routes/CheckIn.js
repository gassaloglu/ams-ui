import { useLoaderData, useRouteError } from 'react-router-dom';
import { axios } from '../index';
import dayjs from 'dayjs';

import { Center } from '../components/Styled';
import Error from '../components/Error';
import Page from '../components/Page';
import { Divider, Paper, Grid, Stack, Typography } from '@mui/material';

export function CheckIn() {
  const { checkin, flight } = useLoaderData();

  return (
    <Page>
      <Center>
        <CheckInData checkin={checkin} flight={flight} />
      </Center>
    </Page>
  );
}

export function CheckInErrorBoundary() {
  const error = useRouteError();

  return (
    <Page>
      <Center>
        {
          error.response
            ? <Error title="Not found">No records found matching your PNR and surname.</Error>
            : <Error title="Something went wrong">It appears that a network error has occurred.</Error>
        }
      </Center >
    </Page>
  );
}

export async function checkInLoader({ params: { pnr, surname } }) {
  const checkinResponse = await axios.get(`/ticket/${pnr}/${surname}`);
  const checkin = checkinResponse.data[0];
  const flightResponse = await axios.get(`/flight/${checkin.flight_number}`);
  const flight = flightResponse.data[0];

  return { checkin, flight };
}

function Info({ label, children }) {
  return (
    <>
      <Typography variant='body2' fontStyle='italic' color='grey'>{label}</Typography>
      <Typography fontWeight='medium'>{children}</Typography>
    </>
  );
}

const question = (b) => b ? 'Yes' : 'No';

function CheckInData({ checkin, flight }) {
  return (
    <Paper elevation={5} sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant='h3'>
          {checkin.name} {checkin.surname}
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Info label="Reservation number"> {checkin.pnr_no} </Info>
          </Grid>
          <Grid item xs={4}>
            <Info label="Flight number"> {flight.flight_number} </Info>
          </Grid>
          <Grid item xs={4}>
            <Info label="Identity number"> {checkin.national_id} </Info>
          </Grid>
          <Grid item xs={4}>
            <Info label="Phone number"> {checkin.phone} </Info>
          </Grid>
          <Grid item xs={4}>
            <Info label="Gender"> {checkin.gender} </Info>
          </Grid>
          <Grid item xs={4}>
            <Info label="C.I.P"> {question(checkin.cip_member)} </Info>
          </Grid>

        </Grid>

        <Divider />

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Info label="Departure airport"> {flight.departure_airport} </Info>
          </Grid>
          <Grid item xs={6}>
            <Info label="Destination airport"> {flight.destination_airport} </Info>
          </Grid>
          <Grid item xs={6}>
            <Info label="Departure time"> {dayjs(flight.departure_time).format('llll')} </Info>
          </Grid>
          <Grid item xs={6}>
            <Info label="Arrival time"> {dayjs(flight.arrival_time).format('llll')} </Info>
          </Grid>
        </Grid>

        <Divider />

        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Info label="Fare type"> {checkin.fare_type} </Info>
          </Grid>
          <Grid item xs={3}>
            <Info label="Seat number"> {checkin.seat} </Info>
          </Grid>
          <Grid item xs={3}>
            <Info label="Luggage number"> {checkin.luggage_id} </Info>
          </Grid>
          <Grid item xs={3}>
            <Info label="Baggage allowance"> {checkin.baggage_allowance} kg. </Info>
          </Grid>
          <Grid item xs={3}>
            <Info label="Meal"> {question(checkin.meal)} </Info>
          </Grid>
          <Grid item xs={3}>
            <Info label="Disabled"> {question(checkin.disabled)} </Info>
          </Grid>
          <Grid item xs={3}>
            <Info label="Child"> {question(checkin.child)} </Info>
          </Grid>
          <Grid item xs={3}>
            <Info label="Price"> {flight.price} </Info>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}