import { useContext } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Stack, Paper, Button } from '@mui/material';
import { ExpandMore, TrendingFlat, Luggage, FlightClass, Restaurant } from '@mui/icons-material';
import { red, green, blue } from '@mui/material/colors';
import { BookingContext } from '../routes/Booking';
import dayjs from 'dayjs';

export default function Flight({ id, departure_airport, destination_airport, departure_time, arrival_time, price }) {
  const { updateBooking, nextStep } = useContext(BookingContext);

  const updateFlight = plan => {
    updateBooking(draft => {
      draft.flight.plan = plan;
      draft.flight.number = id;
    })

    nextStep();
  }

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
              <Typography fontWeight='bold' color="grey.500"> {departure_airport} </Typography>
              <Typography fontWeight='bold' variant='h5'> {dayjs(departure_time).format('LT')} </Typography>
            </Box>
            <TrendingFlat />
            <Box>
              <Typography fontWeight='bold' color="grey.500"> {destination_airport} </Typography>
              <Typography fontWeight='bold' variant='h5'> {dayjs(arrival_time).format('LT')} </Typography>
            </Box>
          </Stack>
          <Typography fontWeight='bold' flex={6} textAlign='right' variant="h5"> {price} ₺ </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1} sx={{ paddingBottom: 1 }} direction='row' justifyContent='space-evenly'>
          <Plan label='essentials' dash={blue[500]} price={price.toFixed(2)} onClick={() => updateFlight('essentials')}>
            <Benefit icon={<Luggage />}> 15 Kg. Luggage </Benefit>
          </Plan>
          <Plan label='advantage' dash={green[500]} price={(price * 1.2).toFixed(2)} onClick={() => updateFlight('advantage')}>
            <Benefit icon={<Luggage />}> 25 Kg. Luggage </Benefit>
            <Benefit icon={<FlightClass />}> Standard Seat Selection </Benefit>
            <Benefit icon={<Restaurant />}> Sandwich </Benefit>
          </Plan>
          <Plan label='comfort' dash={red[500]} price={(price * 1.2 * 1.2).toFixed(2)} onClick={() => updateFlight('comfort')}>
            <Benefit icon={<Luggage />}> 45 Kg. Luggage </Benefit>
            <Benefit icon={<FlightClass />}>  Seat Selection </Benefit>
            <Benefit icon={<Restaurant />}> Sandwich </Benefit>
          </Plan>
        </Stack>
      </AccordionDetails>
    </Accordion >
  );
}

function Plan({ label, price, dash, children, onClick }) {
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
          onClick={onClick}
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