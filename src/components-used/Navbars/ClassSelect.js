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
  const { classSelected, classSelectedCallback } = React.useContext(MyContext);
  const [options, setOptions] = React.useState();
  const [curUser, setCurUser] = React.useState();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
    }
  });
  React.useEffect(() => {
    if (curUser) {
      const docRef = doc(db, 'users', curUser.email);
      getDoc(docRef).then((docSnap) => {
        setOptions(docSnap.data().classes);
        classSelectedCallback(docSnap.data().classes[0].classID);
      });
    }
  }, [curUser, classSelectedCallback]);
  const handleChange = (event) => {
    classSelectedCallback(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, ml: 3, mr: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Class ID</InputLabel>
        {classSelected && (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={classSelected}
            label="ClassID"
            onChange={handleChange}
          >
            {options?.map((option) => (
              <MenuItem key={option?.classID} value={option?.classID}>
                {option?.classID}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
    </Box>
  );
}
