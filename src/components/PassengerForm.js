import { Button, Stack, TextField, Typography, Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { useContext, useState } from 'react';
import { BookingContext } from '../routes/Booking';
import dayjs from 'dayjs';
import { GenderSelection, DisabledSelection } from './Selection';
import { Person as PersonIcon } from '@mui/icons-material';

export const isValidName = name => /^[\p{L}-]+$/ug.test(name);
export const isValidId = id => (/^[1-9][0-9]{10}$/).test(id);
export const isValidEmail = email => /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(email);

export default function PassengerForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const { nextStep, booking, updateBooking } = useContext(BookingContext);
  const { name, surname, national_id, phone, email, gender, birth_date, disabled } = booking;

  const handleSubmit = () => {
    if (!isValidName(name)) {
      setErrorMessage('Please enter a valid name.')
    } else if (!isValidName(surname)) {
      setErrorMessage('Please enter a valid surname.')
    } else if (!birth_date) {
      setErrorMessage('Please enter your birthday.')
    } else if (!isValidId(national_id)) {
      setErrorMessage('Please enter a valid id.')
    } else if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email.')
    } else if (!matchIsValidTel(phone)) {
      setErrorMessage('Please enter a phone number.')
    } else {
      nextStep();
    }
  }

  const updatePassenger = (passenger) => {
    updateBooking(draft => {
      Object.assign(draft, passenger);
    });
  }

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: '600px' }}>
      <Typography variant='h6' sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        fontWeight: 'bold'
      }}> 
        <PersonIcon /> Passenger Information
      </Typography>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField 
            label="Name" 
            value={name} 
            onChange={(e) => updatePassenger({ name: e.target.value.trim() })}
            fullWidth
          />
          <TextField 
            label="Surname" 
            value={surname} 
            onChange={(e) => updatePassenger({ surname: e.target.value.trim() })}
            fullWidth
          />
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            maxDate={dayjs()}
            value={birth_date}
            onChange={birth_date => updatePassenger({ birth_date })}
            label="Birthday"
            format='DD/MM/YYYY'
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>

        <TextField 
          label="Turkish ID Number" 
          inputProps={{ maxLength: 11 }} 
          value={national_id} 
          onChange={(e) => updatePassenger({ national_id: e.target.value.trim() })}
          fullWidth
        />

        <TextField 
          label="Email" 
          type='email' 
          value={email} 
          onChange={(e) => updatePassenger({ email: e.target.value.trim() })}
          fullWidth
        />

        <MuiTelInput 
          label="Phone number" 
          disableDropdown 
          forceCallingCode 
          defaultCountry='TR' 
          value={phone} 
          onChange={phone => updatePassenger({ phone })}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <GenderSelection value={gender} onChange={gender => updatePassenger({ gender })} />
          <DisabledSelection value={disabled} onChange={disabled => updatePassenger({ disabled })} />
        </Stack>
      </Stack>

      <Button
        size='large'
        variant='contained'
        onClick={handleSubmit}
        fullWidth
      >
        Continue
      </Button>

      {errorMessage && (
        <Typography align='center' color='error' sx={{ fontWeight: 'medium' }}>
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
}