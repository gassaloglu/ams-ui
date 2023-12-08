import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Signup() {
  return (
    <Paper sx={{ width: '320px', p: 2 }} variant="outlined">
      <Stack sx={{ width: '100%' }} spacing={2} justifyContent="center">
        <Typography variant="h5">
            Create your account
        </Typography>

        <Typography level="caption" color="#7B91A7">
            Please fill the required information.
        </Typography>

        <Stack spacing={1}>
            <Stack direction='row' spacing={1}>
                <TextField label="Name" size="small" />
                <TextField label="Surname" size="small" />
            </Stack>
        
            <TextField label="Phone Number" type='tel' size="small" />
            <TextField label="Email" type='email' size="small" />
            <TextField label="Password" type='password' size="small" />
        </Stack>

        <Button fullWidth variant='contained'>Sign up</Button>
        
        <Typography
          fontSize="small"
          sx={{ alignSelf: 'center' }}
        >
          Already a member? 
          <Link underline="none" href="/login"> Log in</Link>
        </Typography>
      </Stack>
    </Paper>
  )
}