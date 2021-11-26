import React from 'react';

import { Box, Container, Typography, Card, Button } from '@mui/material';
// components
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
      const docRef = doc(db, 'classes', classSelected);
      if (docRef) {
        getDoc(docRef).then((classDetails) => {
          console.log(classDetails?.data());
          setDocs(
            classDetails?.data()?.assignments.find((item) => item.name === queryName.get('name'))
          );
        });
      }
    }
  }, [curUser, classSelected, navigate, queryName]);
  classSelectedCallback(queryName.get('classid'));
  //   const { name, deadline, totalScore, weightage }
  const formatedDeadline = moment(docs?.deadline).format('DD-MM-YYYY h:mm:ss');

  return (
    <div>
      <Button variant="outlined">back</Button>
      <h1> Assignment Name: {docs?.name}</h1>
      <h2>Deadline:{formatedDeadline} </h2>
      <h2>Total Score: {docs?.totalScore}</h2>
      <h2>Weightage : {docs?.weightage} </h2>
      {/* {queryName.get('name')} */}
      <SubmissionsViewer assignmentName={queryName.get('name')} submissions={docs?.submissions} />
    </div>
  );
}
