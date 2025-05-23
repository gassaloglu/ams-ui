import { axios } from '../../index';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Chip } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { EmptyPage } from '../../components/Page';

const Status = ({ active }) =>
  <Chip
    size='small'
    label={active ? "Active" : "Inactive"}
    sx={{
      backgroundColor: active ? 'primary.main' : '',
      color: active ? 'white' : '',
      width: '70px',
    }}
  />

const columns = [
  {
    field: 'registration',
    headerName: 'Registration',
    flex: 1,
  },
  {
    field: 'manufacturer',
    headerName: 'Manufacturer',
    flex: 1,
  },
  {
    field: 'model',
    headerName: 'Model',
    flex: 1,
  },
  {
    field: 'capacity',
    headerName: 'Capacity',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    renderCell: params => <Status active={params.value} />,
  },
];

export function ListPlane() {
  const rows = useLoaderData()
    .map(row => Object.assign(row, { id: row.id }));

  return (
    <EmptyPage>
      <Box flexGrow={1} height='100vh'>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </Box>
    </EmptyPage>
  );
}

export async function listPlaneLoader() {
  const response = await axios.get('/planes');
  return response.data;
}