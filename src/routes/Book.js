import { Box, Button, Accordion, AccordionSummary, AccordionDetails, Divider, Paper, Stack, Step, StepLabel, Stepper, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { ArrowCircleRightOutlined, ExpandMore, TrendingFlat, Luggage, Restaurant, FlightClass, RestartAltOutlined } from '@mui/icons-material';
import { red, green, blue } from '@mui/material/colors';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AppBar from "../components/AppBar";

// TODO: Use styled-components
// TODO: Phone number input

export default function Book() {
  return (
    <>
      <AppBar />
      <Stack spacing={2} alignItems='stretch' sx={{ m: 'auto', p: 2, width: '900px' }}>
        <Details />
        <Steps />
        {/* <PassengerForm /> */}
        <Flights />
      </Stack >
    </>
  );
}

function PassengerForm() {
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
  return (
    <Stepper alternativeLabel>
      <Step>
        <StepLabel> Flight </StepLabel>
      </Step>
      <Step>
        <StepLabel> Passenger Information </StepLabel>
      </Step>
      <Step>
        <StepLabel> Personalisation </StepLabel>
      </Step>
      <Step>
        <StepLabel> Payment </StepLabel>
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


function Flight({ from, to, departure, arrival, price }) {
  return (
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Stack sx={{ p: 1, width: '100%' }} direction='row' justifyContent='space-between' alignItems='center'>
          <Stack flex={7} direction='row' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography fontWeight='bold' color="grey.500"> {from} </Typography>
              <Typography fontWeight='bold' variant='h5'> 08:30 </Typography>
            </Box>
            <TrendingFlat />
            <Box>
              <Typography fontWeight='bold' color="grey.500"> {to} </Typography>
              <Typography fontWeight='bold' variant='h5'> 10:30 </Typography>
            </Box>
          </Stack>
          <Typography fontWeight='bold' flex={6} textAlign='right' variant="h5"> {price} ₺ </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack sx={{ paddingBottom: 1 }} direction='row' justifyContent='space-evenly'>
          <Plan label='essentials' dash={blue[500]} price={price}>
            <Benefit icon={<Luggage />}> 15 Kg. Luggage </Benefit>
          </Plan>
          <Plan label='advantage' dash={green[500]} price={price + 200}>
            <Benefit icon={<Luggage />}> 25 Kg. Luggage </Benefit>
            <Benefit icon={<FlightClass />}> Standard Seat Selection </Benefit>
            <Benefit icon={<Restaurant />}> Sandwich </Benefit>
          </Plan>
          <Plan label='comfort' dash={red[500]} price={price + 400}>
            <Benefit icon={<Luggage />}> 45 Kg. Luggage </Benefit>
            <Benefit icon={<FlightClass />}>  Seat Selection </Benefit>
            <Benefit icon={<Restaurant />}> Sandwich </Benefit>
          </Plan>
        </Stack>
      </AccordionDetails>
    </Accordion >
  );
}

function Plan({ label, price, dash, children }) {
  return (
    <Paper
      sx={{
        p: 2,
        width: '270px',
        backgroundColor: 'grey.50',
        borderTop: 10,
        borderColor: dash
      }}
    >
      <Stack spacing={1} alignItems='center' justifyContent='center'>
        <Typography
          fontWeight='bold'
          textTransform='uppercase'
          variant='h6'
        >
          {label}
        </Typography>

        <Stack
          direction='column'
          spacing={1}
          sx={{
            minWidth: '190px',
            height: '160px'
          }}
        >
          {children}
        </Stack>

        <Button
          sx={{ minWidth: '190px' }}
          variant='contained'
        >
          {price} ₺
        </Button>
      </Stack>
    </Paper>
  )
}

function Benefit({ icon, children }) {
  return (
    <Stack spacing={1} direction='row' alignItems='center'>
      {icon}
      <Typography> {children} </Typography>
    </Stack>
  );
}