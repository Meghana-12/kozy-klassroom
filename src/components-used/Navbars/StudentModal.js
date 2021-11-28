import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material

import { Box, Button, Card, TextField, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
// components
import { getDoc, doc, arrayUnion } from 'firebase/firestore';
import { updateDoc } from '@firebase/firestore';
import { db, auth } from '../../firebase/initFirebase';
import { MyContext } from '../../utils/context';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4
};
function StudentModal({ curUser, setOptions, setOpen }) {
  const { classSelectedCallback } = React.useContext(MyContext);
  const classSelected = localStorage.getItem('selectedID');
  const [classExists, setClassExists] = React.useState(false);
  const [pwdCheck, setPwdCheck] = React.useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const classID = data.get('classID');
    const password = data.get('password');
    try {
      const docRef = doc(db, 'classes', classID.trim());
      console.log(docRef);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.data() && curUser) {
          setClassExists(true);
          if (docSnap.data().password === password) {
            setPwdCheck(true);
            const classRef = doc(db, 'classes', classID);
            const userDocRef = doc(db, 'users', curUser?.email);
            const userDocData = {
              classes: arrayUnion(
                ...[
                  {
                    classID
                  }
                ]
              )
            };
            const classDocData = {
              students: arrayUnion(
                ...[
                  {
                    email: curUser.email
                  }
                ]
              )
            };
            updateDoc(userDocRef, userDocData);
            updateDoc(classRef, classDocData).then((res) => {
              alert(`Addded you to ${classID}  successfully!`);
              setOptions([classID]);
            });
          }
        } else {
          alert(`Class ${classID} doesn't Exist!`);
        }
        setOpen(false);
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Card sx={style}>
        <Box component="form" onSubmit={(e) => handleSubmit(e)}>
          <Typography variant="h4" sx={{ mt: 3, textAlign: 'center' }}>
            {' '}
            + Join Class
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                label="Class ID"
                id="classID"
                name="classID"
                style={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                label="Password"
                id="password"
                name="password"
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Join Class
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
}

export default StudentModal;
