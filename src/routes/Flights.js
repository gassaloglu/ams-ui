import { axios } from '../index';
import { useLoaderData, useParams, useRouteError } from 'react-router-dom';

import { Box, Stack } from '@mui/material';

import { Flight, FlightDetails } from '../components/Flight';
import { Center } from '../components/Styled';
import Error from '../components/Error';
import Page from "../components/Page";
import dayjs from 'dayjs';

export function Flights() {
  const { from, to, date } = useParams();
  const flights = useLoaderData();

  return (
    <Page>
      <Box padding={2} display='flex' justifyContent='center'>
        <Stack sx={{ width: '900px' }} spacing={3} alignItems='stretch'>
          <FlightDetails from={from} to={to} date={date} />
          <Stack spacing={0}>
            {flights.map(props => <Flight key={props.id} {...props} />)}
          </Stack>
        </Stack >
      </Box >
    </Page>
  );
}

export function FlightsErrorBoundary() {
  const error = useRouteError();

  return (
    <Page>
      <Center>
        {
          error.response
            ? <Error title="No flights available">There are no flights available matching your criteria.</Error>
            : <Error title="Something went wrong">It appears that a network error has occurred.</Error>
        }
      </Center >
    </Page>
  );
}

export async function flightsLoader({ params: { from, to, date } }) {
  const day = dayjs.utc(date).format();
  const nextDay = dayjs.utc(date).add(1, 'day').format();
  const response = await axios.get(`/flights?departure_airport=${from}&destination_airport=${to}&departure_datetime.gte=${day}&departure_datetime.lt=${nextDay}`);
  return response.data;
}