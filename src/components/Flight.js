import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Stack, Paper, Button, Divider } from '@mui/material';
import { ExpandMore, TrendingFlat, Luggage, FlightClass, Restaurant, ArrowCircleRightOutlined, PriceChange } from '@mui/icons-material';
import { red, green, blue } from '@mui/material/colors';
import dayjs from 'dayjs';

const PRICE_CONSTANT = 1.2;

export const getPrice = (basePrice, ticketType) => {
  switch (ticketType) {
    case 'essentials':
      return parseFloat(basePrice).toFixed(2);
    case 'advantage':
      return (parseFloat(basePrice) * PRICE_CONSTANT).toFixed(2);
    case 'comfort':
      return (parseFloat(basePrice) * PRICE_CONSTANT * PRICE_CONSTANT).toFixed(2);
  }
}

export function Flight({ id, flight_number, departure_airport, destination_airport, departure_datetime, arrival_datetime, departure_gate_number, destination_gate_number, plane_registration, price }) {
  const navigate = useNavigate();
  const handleClick = plan => {
    navigate(`/booking/${id}/${plan}`);
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
            <Typography fontWeight='bold' color="grey.500"> {flight_number} </Typography>
            <Box>
              <Typography fontWeight='bold' color="grey.500"> {departure_airport} </Typography>
              <Typography fontWeight='bold' variant='h5'> {dayjs(departure_datetime).format('LT')} </Typography>
            </Box>
            <TrendingFlat />
            <Box>
              <Typography fontWeight='bold' color="grey.500"> {destination_airport} </Typography>
              <Typography fontWeight='bold' variant='h5'> {dayjs(arrival_datetime).format('LT')} </Typography>
            </Box>
          </Stack>
          <Typography fontWeight='bold' flex={6} textAlign='right' variant="h5"> {price} ₺ </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1} sx={{ paddingBottom: 1 }} direction='row' justifyContent='space-evenly'>
          <Plan label='essentials' dash={blue[500]} price={getPrice(price, 'essentials')} onClick={() => handleClick('essentials')}>
            <Benefit icon={<Luggage />}> 15 Kg. Luggage </Benefit>
            <Benefit icon={<FlightClass />}> Seat Selection </Benefit>
          </Plan>
          <Plan label='advantage' dash={green[500]} price={getPrice(price, 'advantage')} onClick={() => handleClick('advantage')}>
            <Benefit icon={<Luggage />}> 25 Kg. Luggage </Benefit>
            <Benefit icon={<FlightClass />}> Seat Selection </Benefit>
            <Benefit icon={<Restaurant />}> Sandwich </Benefit>
          </Plan>
          <Plan label='comfort' dash={red[500]} price={getPrice(price, 'comfort')} onClick={() => handleClick('comfort')}>
            <Benefit icon={<Luggage />}> 45 Kg. Luggage </Benefit>
            <Benefit icon={<FlightClass />}>  Seat Selection </Benefit>
            <Benefit icon={<Restaurant />}> Sandwich </Benefit>
          </Plan>
        </Stack>
      </AccordionDetails>
    </Accordion >
  );
}

export function FlightDetails({ flight_number, from, to, date }) {
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
          <Typography fontWeight='bold' variant='h4'> {from} </Typography>
          <ArrowCircleRightOutlined sx={{ color: 'grey.500' }} />
          <Typography fontWeight='bold' variant='h4'> {to} </Typography>
        </Stack>

        <Stack direction='column'>
          <Typography>{flight_number}</Typography>
          <Typography><strong>{dayjs(date).format('ddd, MMM D, YYYY, HH:MM')}</strong></Typography>
        </Stack>
      </Stack>
    </Box>
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
