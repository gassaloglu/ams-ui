import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { useContext, useState } from 'react';
import { BookingContext } from '../routes/Booking';
import dayjs from 'dayjs';

const isValidName = name => (/^[a-zA-Z]{2,}[a-zA-Z ]*$/).test(name);
const isValidId = id => (/^[1-9][0-9]{10}$/).test(id);

export default function PassengerForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const { nextStep, booking, updateBooking } = useContext(BookingContext);
  const { name, surname, id, phone, gender, birth, male, disabled, child } = booking.passenger;

  const handleSubmit = () => {
    if (!isValidName(name)) {
      setErrorMessage('Please enter a valid name.')
    } else if (!isValidName(surname)) {
      setErrorMessage('Please enter a valid surname.')
    } else if (!birth) {
      setErrorMessage('Please enter your birthday.')
    } else if (!isValidId(id)) {
      setErrorMessage('Please enter a valid id.')
    } else if (!matchIsValidTel(phone)) {
      setErrorMessage('Please enter a phone number.')
    } else {
      nextStep();
    }
  }

  const updatePassenger = (passenger) => {
    updateBooking(draft => {
      Object.assign(draft.passenger, passenger);
    });
  }

  return (
    <Stack spacing={1} sx={{ m: 'auto', maxWidth: '300px' }}>
      <TextField label="Name" value={name} onChange={(e) => updatePassenger({ name: e.target.value })} />
      <TextField label="Surname" value={surname} onChange={(e) => updatePassenger({ surname: e.target.value })} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker maxDate={dayjs()} value={birth} onChange={b => updatePassenger({ birth: b })} />
      </LocalizationProvider>
      <TextField label="Turkish ID Number" inputProps={{ maxLength: 11 }} value={id} onChange={(e) => updatePassenger({ id: e.target.value })} />
      <MuiTelInput label="Phone number" disableDropdown forceCallingCode defaultCountry='TR' value={phone} onChange={phone => updatePassenger({ phone })} />
      <GenderSelection value={male ? 'male' : 'female'} onChange={e => updatePassenger({ male: e.target.value === 'male' })} />
      <Button
        size='large'
        variant='contained'
        onClick={handleSubmit}
      >
        Submit
      </Button>
      <Typography align='center' color='error'> {errorMessage} </Typography>
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
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="female" control={<Radio />} label="Female" />
      </RadioGroup>
    </FormControl>
  );
}