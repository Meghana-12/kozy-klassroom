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
function InstructorModal({ curUser, setOpen, setOptions }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const classID = data.get('classID');
    const className = data.get('className');
    const password = data.get('password');
    if (curUser?.email && db) {
      const docData = {
        classID,
        className,
        password,
        createdOn: Timestamp.fromDate(new Date()),
        students: [],
        instructor: curUser.email
      };
      console.log(docData, curUser);

      const docRef = doc(db, 'classes', classID);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.data()) {
          console.log(docSnap.data());
          alert(`Please give another name, ${classID} exists`);
        } else {
          setDoc(docRef, docData, { merge: true });
          const userDocRef = doc(db, 'users', curUser.email);
          const userDocData = {
            classes: arrayUnion(
              ...[
                {
                  classID,
                  className
                }
              ]
            )
          };
          updateDoc(userDocRef, userDocData);
          alert(`Class ${classID} is created successfully!`);
          setOptions([classID]);
        }
      });
    }
    setOpen(false);
  };
  return (
    <>
      <Card sx={style}>
        <Box component="form" onSubmit={(e) => handleSubmit(e)}>
          <Typography variant="h4" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
            {' '}
            Create New Class
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
                label="Class Name"
                id="className"
                name="className"
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
                Add Class!
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
          Please share this Unique ID and Password with the students you want to admit only.
        </Typography>
      </Card>
    </>
  );
}

export default InstructorModal;
