import { Paper, TextField, Stack, Typography, Alert, Grow } from "@mui/material"
import { EmptyPage } from "../../components/Page"
import { Center } from "../../components/Styled"
import { LoadingButton } from "@mui/lab"
import { useState } from "react"
import { axios } from '../../index'

export default function AddPlane() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [registration, setRegistration] = useState('');
  const [model, setModel] = useState('');

  const checkInputs = () => {
    if (!registration) {
      setError('Please enter a plane registration.');
    } else if (!model) {
      setError('Please enter a plane model.');
    } else {
      setError('');
      return true
    }

    return false;
  }

  const submit = event => {
    setAlert(null);

    if (!checkInputs()) return event.preventDefault();

    setLoading(true);

    axios.post('/plane/add', { registration, model })
      .then(() => {
        setAlert({ severity: 'success', message: 'Plane successfully added.' });
      })
      .catch(error => {
        if (error.response) {
          setAlert({ severity: 'error', message: 'Error returned: ' + error.response.data })
        } else {
          setAlert({ severity: 'warning', message: 'It seems that your connection is lost.' })
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <EmptyPage>
      <Center>
        <Paper sx={{ p: 2, borderRadius: 3 }} elevation={3}>
          {
            alert && <Grow in={Boolean(alert)}>
              <Alert
                sx={{ mb: 2 }}
                severity={alert.severity}
              >
                {alert.message}
              </Alert>
            </Grow>
          }

          <Stack spacing={1} sx={{ width: '450px' }}>
            <TextField
              label="Registration"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              inputProps={{ maxLength: 6 }}
            />

            <TextField
              label="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />

            <Stack direction='row' spacing={1}>
              <Typography
                color='error'
                variant="caption"
                fontWeight='bold'
                flexGrow={1}
              >
                {error}
              </Typography>

              <LoadingButton
                variant='contained'
                sx={{
                  width: '150px',
                  height: '50px',
                }}
                onClick={submit}
                loading={loading}
              >
                Add Plane
              </LoadingButton>
            </Stack>
          </Stack>
        </Paper>
      </Center>
    </EmptyPage>
  )
}