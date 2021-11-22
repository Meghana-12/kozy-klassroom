import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MyContext } from '../../../utils/context';
import { auth, db } from '../../../firebase/initFirebase';

export default function ClassSelect(props) {
  const { classSelected, setClassSelected } = React.useContext(MyContext);
  const [curUser, setCurUser] = React.useState();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
      console.log('nav', user);
    } else {
      console.log('dashboard nav err');
    }
  });
  React.useEffect(() => {
    if (curUser) {
      console.log('abcd');
      const docRef = doc(db, 'users', curUser.email);
      getDoc(docRef).then((docSnap) => {
        console.log(docSnap.data().classes[0].classID);
        setClassSelected(docSnap.data().classes[0].classID);
      });
    } else {
      console.log('dashboard nav err -2');
    }
  }, [curUser, setClassSelected]);
  const handleChange = (event) => {
    setClassSelected(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
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
            {props.options?.map((option) => (
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
