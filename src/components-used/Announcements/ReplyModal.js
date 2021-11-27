import React from 'react';
import { Box, Button, Card, TextField, Grid } from '@mui/material';
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
function AnnouncementModal({ setOpen, title }) {
  const { classSelected } = React.useContext(MyContext);
  const [curUser, setCurUser] = React.useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
    }
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reply = data.get('reply');
    const docRef = doc(db, 'classes', classSelected, 'announcements', title);
    const docData = {
      replies: arrayUnion(
        ...[
          {
            reply,
            author: curUser?.email,
            photoURL: curUser?.photoURL,
            postedAt: Timestamp.fromDate(new Date())
          }
        ]
      )
    };
    updateDoc(docRef, docData, { merge: true });
    setOpen(false);
  };
  return (
    <>
      <Card sx={style}>
        <Box component="form" onSubmit={(e) => handleSubmit(e)}>
          <Typography variant="h4" sx={{ mt: 3, textAlign: 'center' }}>
            {' '}
            Post a Reply to {title}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                label="reply"
                id="reply"
                name="reply"
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
