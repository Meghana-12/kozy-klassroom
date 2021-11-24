// material
import React from 'react';
import { Box, Container, Typography, Card } from '@mui/material';
// components
import { onAuthStateChanged } from 'firebase/auth';
import AssignmentsViewer from '../components-used/Assignments/AssignmentsViewer';
import { MyContext } from '../utils/context';
import Page from '../components/Page';
import { auth, storage } from '../firebase/initFirebase';
import { AssignmentUploader } from '../components-used/Assignments/AssignmentUploader';
// ----------------------------------------------------------------------

export default function Assignments() {
  const { classSelected } = React.useContext(MyContext);
  const [curUser, setCurUser] = React.useState(null);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
      console.log('nav', user);
    } else {
      console.log('dashboard nav err');
    }
  });
  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            Hi, {curUser?.displayName} .
            {classSelected && <div> Selected Class : {classSelected} </div>}
          </Typography>
        </Box>
        <Card sx={{ p: 5, mb: 5 }}>
          {' '}
          <AssignmentUploader
            classSelected={classSelected}
            user={curUser}
            storage={storage}
            curUser={curUser}
          />{' '}
        </Card>
        <AssignmentsViewer />
      </Container>
    </Page>
  );
}
