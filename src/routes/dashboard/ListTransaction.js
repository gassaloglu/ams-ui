import { axios } from '../../index';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Chip } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { EmptyPage } from '../../components/Page';
import dayjs from 'dayjs';
import { green, orange, blue, red } from '@mui/material/colors';

const transactionTypes = {
    credit: {
        label: 'Credit',
        style: {
            backgroundColor: green[500],
            color: 'white',
        },
    },
    debit: {
        label: 'Debit',
        style: {
            backgroundColor: orange[500],
            color: 'white',
        },
    },
    refund: {
        label: 'Refund',
        style: {
            backgroundColor: blue[500],
            color: 'white',
        },
    },
};

const TransactionTypeChip = ({ value }) => {
    const type = transactionTypes[value] || { label: value, style: {} };
    return <Chip label={type.label} sx={type.style} size="small" />;
};

const PotentiallyFraudChip = ({ value }) => {
    if (!value) return null;
    return <Chip label="Fraud" sx={{ backgroundColor: red[500], color: 'white' }} size="small" />;
};

const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'credit_card_id', headerName: 'Credit Card ID', flex: 1.5 },
    { field: 'type', headerName: 'Type', flex: 1, renderCell: params => <TransactionTypeChip value={params.value} /> },
    { field: 'amount', headerName: 'Amount', flex: 1, valueFormatter: params => params.value.toFixed(2) + ' ₺' },
    { field: 'created_at', headerName: 'Created At', flex: 1, valueFormatter: params => dayjs(params.value).format('DD/MM/YYYY HH:mm') },
    { field: 'potentially_fraud', headerName: 'Potentially Fraud', flex: 1, renderCell: params => <PotentiallyFraudChip value={params.value} /> },
];

export function ListTransaction() {
    const rows = useLoaderData().map(row => ({ ...row, id: row.id }));
    return (
        <EmptyPage>
            <Box flexGrow={1} height='100vh'>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>
        </EmptyPage>
    );
}

export async function listTransactionLoader() {
    const response = await axios.get('/transactions');
    return response.data;
} 