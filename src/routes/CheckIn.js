import { useLoaderData, useRouteError } from 'react-router-dom';
import { axios } from '../index';

import AppBar from '../components/AppBar';
import { Center } from '../components/Styled';
import { NotFound, SomethingWentWrong } from '../components/Error';
import { Divider, Paper, Grid, responsiveFontSizes } from '@mui/material';

export function CheckIn() {
  const { checkin, flight } = useLoaderData();

  return (
    <>
      <AppBar />
      <Center>
        <CheckInData data={checkin} />
      </Center>
    </>
  );
}

export function CheckInError() {
  const error = useRouteError();
  console.log(error);
  return error.response ? <NotFound /> : <SomethingWentWrong />;
}

export async function checkInLoader({ params }) {
  const checkinResponse = await axios.post('/passenger/pnr', {
    token: "00000000000",
    pnr: params.pnr,
    surname: params.surname,
  });

  const checkin = checkinResponse.data[0];

  const flightResponse = await axios.post('/flight/getflightsbyflightnumber', {
    flight_number: checkin.flight_number,
  });

  return { checkin, flight: flightResponse.data };
}

function CheckInData({ data }) {
  return (
    <Paper>
      <Grid container>
        <Grid item>
          Berkay
        </Grid>
      </Grid>

      <Divider />

      <Grid container>
        <Grid item>
          Dinc
        </Grid>
      </Grid>
    </Paper>
  );
}