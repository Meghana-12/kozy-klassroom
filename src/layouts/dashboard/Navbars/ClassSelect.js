import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import { MyContext } from '../../../utils/context';

export default function ClassSelect(props) {
  const { classSelected, setClassSelected } = React.useContext(MyContext);
  const [classID, setClass] = React.useState(classSelected || 'Select Class');
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
          // label="ClassID"
          onChange={handleChange}
        >
          {props.options?.map((option) => (
            <MenuItem key={option?.classID} value={option?.classID}>
              {option?.classID}
            </MenuItem>
          ))}
        </Select>
        {/* <FormControl fullWidth> */}
        {/* <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Class ID
        </InputLabel>
        <NativeSelect
          defaultValue={30}
          inputProps={{
            name: 'age',
            id: 'uncontrolled-native'
          }}
          onChange={handleChange}
        >
          {props.options?.map((option) => (
            <MenuItem key={option?.classID} value={option?.classID}>
              {option?.classID}
            </MenuItem>
          ))}
        </NativeSelect> */}
        {/* </FormControl> */}
      </FormControl>
    </Box>
  );
}
