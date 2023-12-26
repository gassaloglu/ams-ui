import { createContext, useContext, useState } from "react";
import { useLoaderData, useParams, useRouteError } from 'react-router-dom';
import { chunk, isEqual, select } from 'underscore';
import { useImmer } from 'use-immer';
import { axios } from '../index';

import { ArrowCircleRightOutlined, ArrowRight, Book } from '@mui/icons-material';
import { Box, Button, Divider, Stack, Step, StepButton, Stepper, Typography } from "@mui/material";

import Flight from '../components/Flight';
import Page from "../components/Page";
import PassengerForm from '../components/PassengerForm';
import { SeatDescription, SeatPlan } from '../components/Seat';

import dayjs from 'dayjs';
import Error from '../components/Error';
import { Center } from '../components/Styled';

export const BookingContext = createContext({});

const steps = [
  <Flights />,
  <PassengerForm />,
  <SeatSelection />,
  <Payment />
];

const fiftyfifty = () => Math.random() > 0.5;
const randomOccupation = Array(99).fill(false).map(fiftyfifty);
const plan = chunk(chunk(randomOccupation, 3), 3);

export function Booking() {
  const { date } = useParams();
  const flights = useLoaderData();
  const [step, setStep] = useState(0);
  const [booking, updateBooking] = useImmer({
    flight_number: '',
    ticket_type: '',
    national_id: '',
    seat: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    gender: '',
    birth_date: '',
    disabled: '',
    child: '',
  });

  const nextStep = () => setStep(step + 1)
  const context = { step, setStep, nextStep, flights, booking, updateBooking };

  return (
    <BookingContext.Provider value={context}>
      <Page>
        <Box padding={2} display='flex' justifyContent='center'>
          <Stack sx={{ width: '900px' }} spacing={3} alignItems='stretch'>
            <Details date={date} />
            <Steps />
            <Stack alignItems='center'>
              {steps[step]}
            </Stack>
          </Stack >
        </Box >
      </Page>
    </BookingContext.Provider>
  );
}

export function BookingErrorBoundary() {
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

export async function bookingLoader({ params: { from, to, date } }) {
  const response = await axios.get(`/flight/${from}/${to}/${date}`);
  return response.data;
}

function SeatSelection() {
  const { nextStep, updateBooking } = useContext(BookingContext);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSubmit = () => {
    updateBooking(draft => {
      draft.seat = selectedSeat;
    });

    nextStep();
  }

  return (
    <>
      <Stack direction='row' spacing={5}>
        <Stack spacing={2} direction='row' alignItems='center' divider={<Divider orientation="vertical" flexItem />}>
          <SeatDescription variant="occupied" label="Occupied" />
          <SeatDescription variant="vacant" label="Vacant" />
          <SeatDescription variant="selected" label="Selected" />
        </Stack>
        <Button
          sx={{ width: '150px' }}
          disabled={selectedSeat === null}
          variant='contained'
          endIcon={<ArrowRight />}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </Stack>

      <SeatPlan plan={plan} isSelected={seat => isEqual(seat, selectedSeat)} onSelect={setSelectedSeat} />
    </>
  );
}

function Steps() {
  const { step, setStep } = useContext(BookingContext);

  return (
    <Stepper alternativeLabel activeStep={step}>
      <Step >
        <StepButton onClick={() => setStep(0)}>
          Flight
        </StepButton>
      </Step>
      <Step>
        <StepButton onClick={() => setStep(1)}>
          Passenger information
        </StepButton>
      </Step>
      <Step>
        <StepButton onClick={() => setStep(2)}>
          Seat selection
        </StepButton>
      </Step>
      <Step>
        <StepButton onClick={() => setStep(3)}>
          Payment
        </StepButton>
      </Step>
    </Stepper>
  )
}

function Details({ date }) {
  return (
    <Box sx={{ p: 3, }}>
      <Stack
        spacing={2}
        direction='row'
        justifyContent='center'
        alignItems='center'
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography fontWeight='bold' variant='h4'> Adana </Typography>
          <ArrowCircleRightOutlined sx={{ color: 'grey.500' }} />
          <Typography fontWeight='bold' variant='h4'> İzmir </Typography>
        </Stack>

        <Typography>
          <strong> Departure flight: </strong>
          {dayjs(date).format('ddd, MMM D, YYYY')}
        </Typography>
      </Stack>
    </Box>
  );
}

function Flights() {
  const { flights } = useContext(BookingContext);

  return (
    <Stack spacing={0}>
      {flights.map(props => <Flight key={props.id} {...props} />)}
    </Stack>
  );
}

function Payment() {
  const { booking } = useContext(BookingContext);

  console.log(booking);

  return (
    <Typography>Payment!!</Typography>
  )
}