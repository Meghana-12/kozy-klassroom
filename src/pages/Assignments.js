// material
import React from 'react';
import { Box, Container, Typography, Card } from '@mui/material';
// components
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import InstructorAssignmentsViewer from '../components-used/Assignments/Viewer/Instructor';
import StudentAssignmentsViewer from '../components-used/Assignments/Viewer/Student';
import { MyContext } from '../utils/context';
import Page from '../components/Page';
import { auth, storage, db } from '../firebase/initFirebase';
import { AssignmentUploader } from '../components-used/Assignments/AssignmentUploader';
// ----------------------------------------------------------------------

export default function Assignments() {
  // const { classSelected } = React.useContext(MyContext);
  const classSelected = localStorage.getItem('selectedID');
  const [curUser, setCurUser] = React.useState(null);
  const [dbUser, setdbUser] = React.useState();
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
      // console.log('abcd');
      const docRef = doc(db, 'users', curUser?.email);
      getDoc(docRef).then((docSnap) => {
        setdbUser(docSnap?.data());
      });
    } else {
      // console.log('dashboard nav err -2');
    }
  }, [curUser]);

  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        {classSelected ? (
          <>
            <Box sx={{ pb: 5 }}>
              <Typography variant="h4">
                Hi, {curUser?.displayName} .
                {classSelected && <div> Selected Class : {classSelected} </div>}
              </Typography>
            </Box>
            {dbUser?.type === 'instructor' && (
              <Card sx={{ p: 5, mb: 5 }}>
                <AssignmentUploader
                  classSelected={classSelected}
                  user={curUser}
                  storage={storage}
                  curUser={curUser}
                />
              </Card>
            )}

            {dbUser?.type === 'instructor' ? (
              <InstructorAssignmentsViewer />
            ) : (
              <StudentAssignmentsViewer classID={classSelected} />
            )}
          </>
        ) : (
          'Please Join a class!'
        )}
      </Container>
    </Page>
  );
}
