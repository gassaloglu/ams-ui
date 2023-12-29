import { createContext, useContext, useState } from "react";
import { useLoaderData, useRouteError } from 'react-router-dom';
import { chunk, isEqual } from 'underscore';
import { useImmer } from 'use-immer';
import { axios } from '../index';

import { Box, Button, Divider, Stack, Step, StepButton, Stepper, Typography } from "@mui/material";
import { ArrowRight } from '@mui/icons-material';

import Page from "../components/Page";
import PassengerForm from '../components/PassengerForm';
import { SeatDescription, SeatPlan } from '../components/Seat';
import Error from '../components/Error';
import { Center } from '../components/Styled';
import { FlightDetails } from "../components/Flight";

export const BookingContext = createContext({});

const steps = [
  <PassengerForm />,
  <SeatSelection />,
  <Payment />
];

const fiftyfifty = () => Math.random() > 0.5;
const randomOccupation = Array(99).fill(false).map(fiftyfifty);
const plan = chunk(chunk(randomOccupation, 3), 3);

export function Booking() {
  const { flight, seats, plan } = useLoaderData();
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
    gender: 'Male',
    birth_date: '',
    disabled: 0,
  });

  const nextStep = () => setStep(step + 1)
  const context = { step, setStep, nextStep, flight, booking, updateBooking };

  return (
    <BookingContext.Provider value={context}>
      <Page>
        <Box padding={2} display='flex' justifyContent='center'>
          <Stack sx={{ width: '900px' }} spacing={3} alignItems='stretch'>
            <FlightDetails
              from={flight.departure_airport}
              to={flight.destination_airport}
              date={flight.departure_time}
            />

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
            ? <Error title="Invalid parameters">A scheduled flight can not be found or your ticket type is invalid.</Error>
            : <Error title="Something went wrong">It appears that a network error has occurred.</Error>
        }
      </Center >
    </Page>
  );
}

export async function bookingLoader({ params: { flight_number, plan } }) {
  const [{ data: [flight] }, { data: seats }] = await Promise.all([
    axios.get(`/flight/${flight_number}`),
    axios.get(`/flight/seats?id=${flight_number}`),
  ]);

  if (!["Essentials", "Advantage", "comfort"].includes(plan))
    throw new Error(`Invalid ticket type "${plan}"`);

  return { flight, seats, plan };
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
      <Step>
        <StepButton onClick={() => setStep(0)}>
          Passenger information
        </StepButton>
      </Step>
      <Step>
        <StepButton onClick={() => setStep(1)}>
          Seat selection
        </StepButton>
      </Step>
      <Step>
        <StepButton onClick={() => setStep(2)}>
          Payment
        </StepButton>
      </Step>
    </Stepper>
  )
}

function Payment() {
  const { booking } = useContext(BookingContext);

  return (
    <Typography>Payment!!</Typography>
  )
}