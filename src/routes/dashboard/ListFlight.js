import { axios } from '../../index';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { EmptyPage } from '../../components/Page';
import dayjs from 'dayjs';

const dateFormatter = params => dayjs(params.value).format('llll');

const columns = [
  {
    field: 'id',
    headerName: 'ID',
  },
  {
    field: 'flight_number',
    headerName: 'Flight Number',
    flex: 1,
  },
  {
    field: 'departure_airport',
    headerName: 'From',
    flex: 1,
  },
  {
    field: 'destination_airport',
    headerName: 'To',
    flex: 1,
  },
  {
    field: 'departure_time',
    headerName: 'Departure',
    flex: 2,
    valueFormatter: dateFormatter,
  },
  {
    field: 'arrival_time',
    headerName: 'Arrival',
    flex: 2,
    valueFormatter: dateFormatter,
  },
  {
    field: 'gate_number',
    headerName: 'Gate',
    flex: 1,
  },
  {
    field: 'plane_registration',
    headerName: 'Registration',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
  },
];

export function ListFlight() {
  const rows = useLoaderData();

  return (
    <EmptyPage>
      <Box flexGrow={1} height='100vh'>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </Box>
    </EmptyPage>
  );
}

export async function listFlightLoader() {
  const response = await axios.get('/flight/all');
  return response.data;
}