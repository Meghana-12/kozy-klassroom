import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { MyContext } from '../../../utils/context';

export default function ClassSelect(props) {
  const { classSelect, setClassSelected } = React.useContext(MyContext);
  const [classID, setClass] = React.useState('class ID' || props?.options[0]?.classID);
  setClassSelected(classID);
  const handleChange = (event) => {
    setClass(event.target.value);
    setClassSelected(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Class ID</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={classID}
          label="ClassID"
          onChange={handleChange}
        >
          {props.options?.map((option) => (
            <MenuItem key={option?.classID} value={option?.classID}>
              {option?.classID}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
