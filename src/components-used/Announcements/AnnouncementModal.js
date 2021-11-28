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
function AnnouncementModal({ curUser, setOpen, setChange }) {
  // const { classSelected } = React.useContext(MyContext);
  const classSelected = localStorage.getItem('selectedID');
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = data.get('message');
    const title = data.get('title');
    const docRef = doc(db, 'classes', classSelected, 'announcements', title);
    const docData = {
      title,
      message,
      replies: [],
      author: curUser.email,
      photoURL: curUser.photoURL,
      publishedDate: Timestamp.fromDate(new Date())
    };

    setDoc(docRef, docData, { merge: true });
    setOpen(false);
    setChange((prev) => !prev);
  };
  return (
    <>
      <Card sx={style}>
        <Box component="form" onSubmit={(e) => handleSubmit(e)}>
          <Typography variant="h4" sx={{ mt: 3, textAlign: 'center' }}>
            {' '}
            Post an Announcement
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                label="title"
                id="title"
                name="title"
                fullWidth
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="message"
                id="message"
                name="message"
                fullWidth
                style={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Post
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
}

export default AnnouncementModal;
