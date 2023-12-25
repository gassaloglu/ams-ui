import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';

export default function GenderSelection({ value, onChange }) {
  return (
    <FormControl >
      <FormLabel id="demo-controlled-radio-buttons-group"><Typography variant='body2'> Gender </Typography></FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={e => onChange(e.target.value)}
        row
      >
        <FormControlLabel value={1} control={<Radio />} label="Male" />
        <FormControlLabel value={0} control={<Radio />} label="Female" />
      </RadioGroup>
    </FormControl>
  );
}