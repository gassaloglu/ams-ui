import { createContext, useContext, useState } from "react";
import { chunk, isEqual } from 'underscore';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Box, Button, Divider, Stack, Step, StepButton, Stepper, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { ArrowRight, ArrowCircleRightOutlined } from '@mui/icons-material';

import AppBar from "../components/AppBar";
import { SeatPlan, SeatDescription } from '../components/Seat';
import Flight from '../components/Flight';

// TODO: Use styled-components
// TODO: Phone number input

const BookingContext = createContext({});

const fiftyfifty = () => Math.random() > 0.5;
const randomOccupation = Array(99).fill(false).map(fiftyfifty);
const plan = chunk(chunk(randomOccupation, 3), 3);

export default function Booking() {
  const [step, setStep] = useState(0);
  const context = { step, setStep };

  return (
    <>
      <AppBar />
      <BookingContext.Provider value={context}>
        <Box padding={2} display='flex' justifyContent='center'>
          <Stack sx={{ width: '900px' }} spacing={3} alignItems='stretch'>
            <Details />
            <Steps />
            <Stack alignItems='center'>
              <SeatSelection />
            </Stack>
          </Stack >
        </Box >
      </BookingContext.Provider>
    </>
  );
}

function SeatSelection() {
  const { step, setStep } = useContext(BookingContext);
  const [selectedSeat, setSelectedSeat] = useState(null);

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
          onClick={() => setStep(step + 1)}
        >
          Continue
        </Button>
      </Stack>

      <SeatPlan plan={plan} isSelected={seat => isEqual(seat, selectedSeat)} onSelect={setSelectedSeat} />
    </>
  );
}

function PassengerForm() {
  const { step, setStep } = useContext(BookingContext);

  return (
    <Stack spacing={1} sx={{ m: 'auto', maxWidth: '300px' }}>
      <TextField label="Name" />
      <TextField label="Surname" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker />
      </LocalizationProvider>
      <TextField label="Turkish ID Number" />
      <TextField label="Phone number" />
      <GenderSelection value='female' onChange={() => { }} />
      <Button
        size='large'
        variant='contained'
        onClick={() => setStep(step + 1)}
      >
        Submit
      </Button>
    </Stack>
  );
}

function GenderSelection({ value, onChange }) {
  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={onChange}
        row
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
      </RadioGroup>
    </FormControl>
  );
}

function Steps() {
  const { step, setStep } = useContext(BookingContext);

  return (
    <Stepper alternativeLabel activeStep={step}>
      <Step>
        <StepButton onClick={setStep(0)}>
          Flight
        </StepButton>
      </Step>
      <Step>
        <StepButton onClick={setStep(1)}>
          Passenger Information
        </StepButton>
      </Step>
      <Step>
        <StepButton onClick={setStep(2)}>
          Personalisation
        </StepButton>
      </Step>
      <Step>
        <StepButton onClick={setStep(3)}>
          Payment
        </StepButton>
      </Step>
    </Stepper>
  )
}

function Details() {
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
          <strong> Departure flight:</strong>
          14 Dec 2023, Thu
        </Typography>
      </Stack>
    </Box>
  );
}

const flights = [
  { id: 0, from: 'ADA', to: 'ADB', departure: new Date(), arrival: new Date(), price: 1092.49 },
  { id: 1, from: 'ADA', to: 'ADB', departure: new Date(), arrival: new Date(), price: 1092.49 },
  { id: 2, from: 'ADA', to: 'ADB', departure: new Date(), arrival: new Date(), price: 1092.49 },
  { id: 3, from: 'ADA', to: 'ADB', departure: new Date(), arrival: new Date(), price: 1092.49 },
  { id: 4, from: 'ADA', to: 'ADB', departure: new Date(), arrival: new Date(), price: 1092.49 },
  { id: 5, from: 'ADA', to: 'ADB', departure: new Date(), arrival: new Date(), price: 1092.49 },
]

function Flights() {
  return (
    <Stack spacing={0}>
      {flights.map(({ id, ...props }) => <Flight key={id} {...props} />)}
    </Stack>
  );
}