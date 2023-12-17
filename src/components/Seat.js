import { EventSeat as SeatIcon } from '@mui/icons-material';

const color = {
  occupied: 'primary.main',
  vacant: 'grey',
  selected: 'orange',
}

export function Seat({ variant, onClick }) {
  return (
    <Box>
      <IconButton onClick={onClick}>
        <SeatIcon sx={{ fontSize: 60, color: color[variant] }} />
      </IconButton>
    </Box >
  );
}

export function SeatDescription({ color, label }) {
  return (
    <Stack spacing={1} direction='row' alignItems='center'>
      <SeatIcon sx={{ fontSize: 60, color }} />
      <Typography fontWeight='bold'> {label} </Typography>
    </Stack>
  );
}

export function SeatPlan({ columns, rows, selected, onSelect }) {
  return (
    <Grid container item xs={columns}>
      {[...Array(columns * rows).keys()].map(i => {
        const seatNumber = offset + (i % columns) + step * Math.floor(i / columns);

        return (
          <Grid item xs={12 / columns} key={seatNumber}>
            <Box display='flex' alignItems="center" justifyContent="center">
              <Seat number={seatNumber} />
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}
