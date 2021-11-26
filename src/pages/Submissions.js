import React from 'react';

import { Box, Container, Typography, Card, Grid } from '@mui/material';
// components
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Route, useNavigate } from 'react-router';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import SubmissionsAssignment from '../components-used/SubmissionsAssignment';
import AssignmentCard from '../components-used/Assignments/AssignmentCard';
import SubmissionsViewer from '../components-used/Assignments/Viewer/Submissions';
import InstructorAssignmentsViewer from '../components-used/Assignments/Viewer/Instructor';
import StudentAssignmentsViewer from '../components-used/Assignments/Viewer/Student';
import { MyContext } from '../utils/context';
import Page from '../components/Page';
import { auth, storage, db } from '../firebase/initFirebase';
import { AssignmentUploader } from '../components-used/Assignments/AssignmentUploader';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
export const Submissions = () => {
  const [curUser, setCurUser] = React.useState();
  const [docs, setDocs] = React.useState([]);
  const queryName = useQuery();
  const { classSelected } = React.useContext(MyContext);

  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
    }
  });
  React.useEffect(() => {
    if (curUser && classSelected) {
      const docRef = doc(db, 'classes', classSelected);
      if (docRef) {
        getDoc(docRef).then((classDetails) => {
          console.log(classDetails?.data());
          setDocs(classDetails?.data()?.assignments);
        });
      }
    }
  }, [curUser, classSelected, navigate]);
  return (
    <div>
      <Grid container spacing={3}>
        {docs?.length > 0
          ? docs?.map((item) => (
              // <Route>

              <Grid item xs={4} key={item.name}>
                <AssignmentCard
                  name={item.name}
                  deadline={moment(item.deadline).format('DD-MM-YYYY h:mm:ss')}
                  // numberOfSubmissions,
                  // averageScore={item.averageScore}
                  totalScore={item.totalScore}
                  weightage={item.weightage}
                />
              </Grid>
            ))
          : 'There are no active assignments'}
      </Grid>
      {/* <SubmissionsAssignment name={queryName.get('name')} /> */}
      {/* <div>{queryName.get('name')}</div> */}
    </div>
  );
};
