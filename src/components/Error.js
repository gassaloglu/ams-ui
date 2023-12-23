import { Paper, Typography } from "@mui/material";

export default function Error({ title, children }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3} >
      <Typography variant='h3'>
        {title}
      </Typography>
      <Typography>
        {children}
      </Typography>
    </Paper>
  )
}