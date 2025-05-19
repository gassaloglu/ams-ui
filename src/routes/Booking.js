import { createContext, useContext, useMemo, useState } from "react";
import { useLoaderData, useRouteError, Link } from 'react-router-dom';
import { chunk, isEqual } from 'underscore';
import { useImmer } from 'use-immer';
import { axios } from '../index';
import dayjs from "dayjs";

import { Box, Button, Divider, Stack, Step, StepButton, Stepper, Typography, Grid, TextField, MenuItem, Paper } from "@mui/material";
import { ArrowRight, ErrorOutline, CheckCircleOutline, WarningAmber, CreditCard } from '@mui/icons-material';

import Page from "../components/Page";
import PassengerForm from '../components/PassengerForm';
import { SeatDescription, SeatPlan, seatToAlphaIndex, seatToIndex } from '../components/Seat';
import Error from '../components/Error';
import { Center } from '../components/Styled';
import { FlightDetails, getPrice } from "../components/Flight";
import { LoadingButton } from "@mui/lab";

export const BookingContext = createContext({});

const NUMBER_OF_SEATS = 270;

const steps = [
  <PassengerForm />,
  <SeatSelection />,
  <Payment />
];

export function Booking() {
  const { flight, occupation, plan } = useLoaderData();
  const [step, setStep] = useState(0);
  const [booking, updateBooking] = useImmer({
    flight_number: flight.flight_number,
    fare_type: plan.toLowerCase(),
    national_id: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    gender: 'male',
    disabled: 0,
    seat: null,
    birth_date: null,
  });

  const nextStep = () => setStep(step + 1)

  const seats = useMemo(() => {
    const seats = Array(NUMBER_OF_SEATS).fill(false);
    occupation.forEach(seat => seats[seat] = true);
    return chunk(chunk(seats, 3), 3);
  }, [occupation]);

  const context = { step, setStep, nextStep, booking, updateBooking, seats, flight };

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
            ? <Error title="Flight not found">A scheduled flight can not be found or your ticket type is invalid.</Error>
            : <Error title="Something went wrong">It appears that a network error has occurred.</Error>
        }
      </Center >
    </Page>
  );
}

export async function bookingLoader({ params: { id, plan } }) {
  if (!["essentials", "advantage", "comfort"].includes(plan))
    throw new Error(`Invalid ticket type "${plan}"`);

  const [{ data: flight }, { data: occupation }] = await Promise.all([
    axios.get(`/flights/${id}`),
    axios.get(`/flights/${id}/seats`),
  ]);

  return { flight, occupation, plan };
}

function SeatSelection() {
  const { nextStep, updateBooking, seats } = useContext(BookingContext);
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

      <SeatPlan
        plan={seats}
        isSelected={seat => isEqual(seat, selectedSeat)}
        onSelect={setSelectedSeat}
      />
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

const Detail = ({ label, children }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  }}>
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
      {children}
    </Typography>
  </Box>
);

const Status = ({ Icon, children }) => (
  <Stack sx={{ minHeight: '200px' }} alignItems='center'>
    <Icon sx={{ fontSize: '100px', color: 'grey.500', mb: 1 }} />
    {children}
  </Stack>
);

function Payment() {
  const { booking, flight } = useContext(BookingContext);

  const [pnr, setPnr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [failMessage, setFailMessage] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    cardSurname: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 21 }, (_, i) => i + 25);

  const handleCardChange = (field) => (event) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleClick = () => {
    const payload = {
      passenger: {
        ...booking,
        phone: booking.phone.replaceAll(/\s/g,''),
        birth_date: dayjs(booking.birth_date).format("YYYY-MM-DD"),
        seat: seatToIndex(booking.seat),
        child: Boolean(dayjs().diff(booking.birth_date, 'year', true) < 10),
        disabled: Boolean(booking.disabled),
      },
      credit_card: {
        card_number: cardDetails.cardNumber,
        card_holder_name: cardDetails.cardHolder,
        card_holder_surname: cardDetails.cardSurname,
        expiration_month: cardDetails.expiryMonth,
        expiration_year: cardDetails.expiryYear,
        cvv: cardDetails.cvv,
      }
    }

    setLoading(true);

    axios.post('/passengers', payload)
      .then(({ data: { pnr_no } }) => {
        setPnr(pnr_no);
        setStatus('success');
      })
      .catch(error => {
        if (error.response) {
          setStatus('fail');
          setFailMessage(error.response.data.message);
        } else {
          setStatus('error');
        }
      })
      .finally(() => setLoading(false));
  }

  if (status) {
    return (
      <Box>
        {
          status === "fail" &&
          <Status Icon={ErrorOutline}>
            <Typography>
              Payment failed.
            </Typography>
            <Typography variant='caption'>
              Status: {failMessage}
            </Typography>
          </Status>
        }

        {
          status === "error" &&
          <Status Icon={WarningAmber}>
            <Typography>
              Something went wrong.
            </Typography>
          </Status>
        }

        {
          status === "success" &&
          <Status Icon={CheckCircleOutline}>
            <Typography>
              Your reservation number is: <strong> {pnr} </strong>
            </Typography>

            <Button
              sx={{ mt: 1 }}
              component={Link}
              to={`/checkin/${pnr}/${booking.surname}`}
              variant="contained">
              See check-in details
            </Button>
          </Status>
        }
      </Box>
    );
  } else {
    return (
      <Stack alignSelf='stretch' spacing={4} alignItems='center'>
        <Typography fontWeight='bold' variant='h5'>
          Overview of your booking details
        </Typography>

        <Stack direction="row" spacing={4} sx={{ width: '100%', maxWidth: '1200px' }} alignItems="stretch">
          <Stack spacing={3} sx={{ flex: 1 }} alignItems="stretch">
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Stack spacing={3}>
                <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCard /> Payment Details
                </Typography>
                <TextField
                  label="Card Number"
                  fullWidth
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange('cardNumber')}
                  placeholder="1234567890123456"
                  inputProps={{ maxLength: 16 }}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Card Holder Name"
                    fullWidth
                    value={cardDetails.cardHolder}
                    onChange={handleCardChange('cardHolder')}
                  />
                  <TextField
                    label="Card Holder Surname"
                    fullWidth
                    value={cardDetails.cardSurname}
                    onChange={handleCardChange('cardSurname')}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    label="Expiry Month"
                    fullWidth
                    value={cardDetails.expiryMonth}
                    onChange={handleCardChange('expiryMonth')}
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month.toString().padStart(2, '0')}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Expiry Year"
                    fullWidth
                    value={cardDetails.expiryYear}
                    onChange={handleCardChange('expiryYear')}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <TextField
                  label="CVV"
                  fullWidth
                  value={cardDetails.cvv}
                  onChange={handleCardChange('cvv')}
                  inputProps={{ maxLength: 3 }}
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  bgcolor: 'grey.50',
                  p: 2,
                  borderRadius: 1
                }}>
                  <Typography variant='h6' sx={{ 
                    color: 'text.secondary',
                    fontWeight: 'bold'
                  }}> 
                    Total Amount
                  </Typography>
                  <Typography variant='h5' sx={{ 
                    fontWeight: 'bold',
                    color: 'primary.main'
                  }}>
                    {getPrice(flight.price, booking.fare_type)} ₺
                  </Typography>
                </Box>

                <LoadingButton 
                  loading={loading} 
                  variant="contained" 
                  onClick={handleClick}
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Complete Payment
                </LoadingButton>
              </Stack>
            </Paper>
          </Stack>

          <Stack spacing={3} sx={{ flex: 1 }} alignItems="stretch">
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Stack spacing={3}>
                <Typography variant='h6' sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontWeight: 'bold'
                }}> 
                  <CreditCard /> Booking Summary 
                </Typography>
                
                <Box sx={{ 
                  bgcolor: 'grey.50', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant='subtitle1' sx={{ 
                    fontWeight: 'bold',
                    mb: 1,
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}> 
                    Passenger Information
                  </Typography>
                  <Stack spacing={2}>
                    <Detail label="Fullname">{booking.name + " " + booking.surname}</Detail>
                    <Detail label="National ID">{booking.national_id}</Detail>
                    <Detail label="Phone">{booking.phone}</Detail>
                    <Detail label="Email">{booking.email}</Detail>
                    <Detail label="Disabled">{booking.disabled ? "Yes" : "No"}</Detail>
                  </Stack>
                </Box>

                <Box sx={{ 
                  bgcolor: 'grey.50', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant='subtitle1' sx={{ 
                    fontWeight: 'bold',
                    mb: 1,
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}> 
                    Flight Details
                  </Typography>
                  <Stack spacing={2}>
                    <Detail label="From">{flight.departure_airport}</Detail>
                    <Detail label="To">{flight.destination_airport}</Detail>
                    <Detail label="Date">{dayjs(flight.departure_time).format("L LT")}</Detail>
                    <Detail label="Ticket type">{booking.fare_type}</Detail>
                    <Detail label="Seat">{seatToAlphaIndex(booking.seat)}</Detail>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Stack>
    );
  }
}
