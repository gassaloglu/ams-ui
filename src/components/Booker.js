import { useState } from 'react';

import Box from '@mui/material/Box';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Stack from '@mui/material/Stack';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { SwapHoriz as SwapHorizIcon, Flight as FlightIcon, AirplaneTicket as AirplaneTicketIcon } from '@mui/icons-material'

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Booker() {
  const [activeTab, setActiveTab] = useState('1');

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '900px' }}>
      <TabContext value={activeTab}>
        <TabList onChange={handleChange} variant='fullWidth'>
          <Tab icon={<FlightIcon />} iconPosition='start' label="Flights" value="1" />
          <Tab icon={<AirplaneTicketIcon />} iconPosition='start' label="Check-in" value="2" />
        </TabList>
        <TabPanel value="1"> <FlightsTab /> </TabPanel>
        <TabPanel value="2"> <CheckInTab /> </TabPanel>
      </TabContext>
    </Box>
  );
}

function FlightsTab() {
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);

  return (
    <Stack direction="row" spacing={2} justifyContent="space-evenly">
      <AirportSelection
        label="From"
        airport={fromAirport}
        setAirport={setFromAirport}
        disabledAirport={toAirport}
      />

      <IconButton
        aria-label="swap"
        onClick={(_) => {
          const tmp = fromAirport;
          setFromAirport(toAirport);
          setToAirport(tmp);
        }}
      >
        <SwapHorizIcon />
      </IconButton>

      <AirportSelection
        label="To"
        airport={toAirport}
        setAirport={setToAirport}
        disabledAirport={fromAirport}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Departure date"
          value={departureDate}
          onChange={(value) => setDepartureDate(value)}
          minDate={dayjs()}
        />
      </LocalizationProvider>

      <Button
        variant="contained"
        onClick={(e) => console.log("TODO: Handle Flights click here")}
      >
        Search flights
      </Button>
    </Stack>
  );
}

// TODO: Fetch these from database.
const airports = ['Izmir', 'Istanbul', 'Ankara', 'Adana']

function AirportSelection({ label, airport, setAirport, disabledAirport }) {
  return (
    <Autocomplete
      disablePortal
      value={airport}
      onChange={(event, value) => setAirport(value)}
      options={airports}
      getOptionDisabled={airport => airport === disabledAirport}
      sx={{ width: 150 }}
      renderInput={params => <TextField {...params} label={label} />}
    />
  );
}

function CheckInTab() {
  const [surname, setSurname] = useState('');
  const [pnr, setPnr] = useState('');

  return (
    <Stack direction="row" spacing={2} justifyContent="space-evenly">
      <TextField
        value={pnr}
        onChange={(e) => setPnr(e.target.value)}
        sx={{ width: '300px' }}
        label="Reservation number (PNR)"
      />

      <TextField
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        sx={{ width: '300px' }}
        label="Surname"
      />

      <Button
        sx={{ width: '150px' }}
        variant="contained"
        onClick={(e) => console.log("TODO: Handle Check-in click here")}
      >
        Continue
      </Button>
    </Stack>
  );
}