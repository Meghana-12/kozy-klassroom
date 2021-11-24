import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Card,
  TextField,
  Grid
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// components
import { getDoc, doc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { setDoc, Timestamp, updateDoc } from '@firebase/firestore';
import ClassSelect from './ClassSelect';
import { MHidden } from '../../components/@material-extend';
//
import Searchbar from '../../layouts/dashboard/Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from '../../layouts/dashboard/LanguagePopover';
import NotificationsPopover from '../../layouts/dashboard/NotificationsPopover';
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
function StudentModal({ curUser }) {
  const { classSelectedCallback } = React.useContext(MyContext);
  const [classExists, setClassExists] = React.useState(false);
  const [pwdCheck, setPwdCheck] = React.useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const classID = data.get('classID');
    const password = data.get('password');
    try {
      const docRef = doc(db, 'classes', classID);
      console.log(docRef);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.data()) {
          setClassExists(true);
          if (docSnap.data().password === password) {
            setPwdCheck(true);
            const classRef = doc(db, 'classes', classID);
            const userDocRef = doc(db, 'users', curUser.email);
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
            updateDoc(classRef, classDocData);
            alert(`Addded you to ${classID}  successfully!`);
          }
          console.log('here', docSnap.data());
        } else {
          console.log("Class doesn't Exist!");
        }
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
