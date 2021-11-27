import React from 'react';

import { Box, Container, Typography, Card, Grid } from '@mui/material';
// components
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
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
      const docRef = collection(db, 'classes', classSelected, 'assignments');
      if (docRef) {
        getDocs(docRef).then((classDetails) => {
          const submissions = [];
          classDetails.forEach((doc) => {
            // console.log('submissions', doc?.data());
            submissions.push(doc.data());
            setDocs(submissions);
          });
        });
      }
    }
  }, [curUser, classSelected, navigate, docs]);
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
