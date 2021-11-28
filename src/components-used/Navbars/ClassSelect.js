import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MyContext } from '../../utils/context';
import { auth, db } from '../../firebase/initFirebase';

export default function ClassSelect() {
  const { classSelected, classSelectedCallback, options } = React.useContext(MyContext);
  const classSelectedLocal = localStorage.getItem('selectedID');
  const handleChange = (event) => {
    classSelectedCallback(event.target.value);
    localStorage.setItem('selectedID', event.target.value);
  };
  return (
    <Box sx={{ minWidth: 120, ml: 3, mr: 3, m: 2 }}>
      {!!options?.length && (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Class ID</InputLabel>
          {classSelected && (
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={classSelectedLocal || classSelected}
              label="ClassID"
              onChange={handleChange}
            >
              {options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option} {console.log(option)}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      )}
    </Box>
  );
}
