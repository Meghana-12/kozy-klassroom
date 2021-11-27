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
  const [dbUser, setdbUser] = React.useState();
  onAuthStateChanged(auth, (user) => {
    if (user && auth) {
      setCurUser(user);
    }
  });
  React.useEffect(() => {
    if (curUser) {
      // console.log('abcd');
      const docRef = doc(db, 'users', curUser?.email);
      getDoc(docRef).then((docSnap) => {
        setdbUser(docSnap?.data());
      });
    } else {
      // console.log('dashboard nav err -2');
    }
  }, [curUser]);
  React.useEffect(() => {
    if (curUser && auth) {
      const docRef = doc(db, 'users', curUser.email);
      getDoc(docRef).then((docSnap) => {
        if (docSnap?.data()?.classes) {
          setOptions(docSnap.data().classes);
          classSelectedCallback(docSnap.data().classes[0].classID);
        }
      });
    }
  }, [curUser, classSelectedCallback, dbUser]);
  const handleChange = (event) => {
    classSelectedCallback(event.target.value);
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
      )}
    </Box>
  );
}
