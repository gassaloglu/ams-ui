import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Login() {
  const [role, setRole] = useState("user");

  return (
    <Paper sx={{ width: '320px', p: 2 }} variant="outlined">
      <Stack sx={{ width: '100%' }} spacing={2} justifyContent="center">
        <Typography variant="h4">
          Welcome!
        </Typography>

        <Typography level="body2" color="#7B91A7">
          Please sign in to continue.
        </Typography>


        {
          role === 'user'
            ? <TextField label="Email" type='email' size="small" />
            : <TextField label="Personnel number" size="small" />
        }
        
        <TextField
          label="Password"
          type='password'
          size="small"
        />

        <ToggleButtonGroup
          exclusive
          color="primary"
          size='small'
          fullWidth
          value={role}
          onChange={(e, v) => setRole(v)}
        >
          <ToggleButton value="user">User</ToggleButton>
          <ToggleButton value="employee">Employee</ToggleButton>
        </ToggleButtonGroup>

        <Button fullWidth variant='contained'>Log in</Button>
        
        <Typography
          fontSize="small"
          sx={{ alignSelf: 'center' }}
        >
          Don&apos;t have an account?
          <Link underline="none" href="/signup"> Sign up</Link>
        </Typography>
      </Stack>
    </Paper>
  )
}