import React from 'react';

import { Box, Container, Typography, Card, Button, CardContent } from '@mui/material';
// components
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router';
import moment from 'moment';
import SubmissionsViewer from './Assignments/Viewer/Submissions';
import InstructorAssignmentsViewer from './Assignments/Viewer/Instructor';
import StudentAssignmentsViewer from './Assignments/Viewer/Student';
import { MyContext } from '../utils/context';
import Page from '../components/Page';
import { auth, storage, db } from '../firebase/initFirebase';
import { AssignmentUploader } from './Assignments/AssignmentUploader';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
export default function SubmissionsAssignment() {
  const [curUser, setCurUser] = React.useState();
  const [docs, setDocs] = React.useState([]);
  const queryName = useQuery();

  const { classSelected, classSelectedCallback } = React.useContext(MyContext);
  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
    }
  });
  React.useEffect(() => {
    if (curUser && classSelected) {
      const docRef = doc(db, 'classes', classSelected, 'assignments', queryName.get('name'));
      if (docRef) {
        getDoc(docRef).then((classDetails) => {
          console.log('here', classDetails.data());
          setDocs([classDetails?.data()]);
        });
      }
    }
  }, [curUser, classSelected, navigate, queryName]);
  classSelectedCallback(queryName.get('classid'));
  //   const { name, deadline, totalScore, weightage }
  const formatedDeadline = docs[0]?.deadline?.toDate();

  return (
    <div>
      <Button variant="outlined">back</Button>
      <Card sx={{ p: 2, m: 4 }}>
        <CardContent>
          <Typography variant="h4"> Assignment Name: {docs[0]?.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            Deadline: {String(formatedDeadline)}{' '}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            Total Score: {docs[0]?.totalScore}
          </Typography>
          {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            Weightage : {docs[0]?.weightage}{' '}
          </Typography> */}
          {/* {queryName.get('name')} */}
        </CardContent>
      </Card>
      <SubmissionsViewer
        assignmentName={queryName.get('name')}
        submissions={docs[0]?.submissions}
      />
    </div>
  );
}
