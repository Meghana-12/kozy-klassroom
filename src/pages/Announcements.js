import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import {
  Box,
  Stack,
  Link,
  Card,
  Button,
  Divider,
  Typography,
  CardHeader,
  Grid,
  TextField,
  Modal
} from '@mui/material';
// utils
import React from 'react';
import { setDoc, doc, getDoc, getDocs, collection, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';
import AnnouncementModal from '../components-used/Announcements/AnnouncementModal';
import { MyContext } from '../utils/context';
import { db, auth } from '../firebase/initFirebase';
import { mockImgCover } from '../utils/mockImages';
//
import Scrollbar from '../components/Scrollbar';
import AnnouncementCard from '../components-used/Announcements/AnnouncementCard';

// ----------------------------------------------------------------------

export default function Announcements() {
  const [docs, setDocs] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [curUser, setCurUser] = React.useState();
  const { classSelected } = React.useContext(MyContext);
  const handleClose = () => setOpen(false);
  const handleAddPost = () => {
    setOpen(true);
  };
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
    }
  });
  React.useEffect(() => {
    if (classSelected) {
      const docRef = collection(db, 'classes', classSelected, 'announcements');
      getDocs(docRef).then((classDetails) => {
        const announcements = [];
        classDetails.forEach((doc) => {
          console.log(doc?.data());
          announcements.push(doc?.data());
        });
        setDocs(announcements);
      });
    }
  }, [classSelected]);

  return (
    <Grid container sx={{ p: 2 }} flexDirection="row">
      <Typography variant="h3" noWrap>
        {' '}
        Announcements
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Button onClick={handleAddPost}> + New Post</Button>
      <Grid item xs={12}>
        {docs?.map((data) => (
          <AnnouncementCard key={data.deadline} data={data} />
        ))}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AnnouncementModal curUser={curUser} setOpen={setOpen} />
      </Modal>
    </Grid>
  );
}
