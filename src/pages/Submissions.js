import React from 'react';

import { Grid, Typography, Button } from '@mui/material';
// components
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AssignmentCard from '../components-used/Assignments/AssignmentCard';
import { MyContext } from '../utils/context';
import { auth, db } from '../firebase/initFirebase';

export const Submissions = () => {
  const [curUser, setCurUser] = React.useState();
  const [docs, setDocs] = React.useState([]);
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
        {docs?.length > 0 ? (
          docs?.map((item) => (
            <Grid item xs={4} key={item.name}>
              <AssignmentCard
                name={item.name}
                deadline={item?.deadline}
                totalScore={item.totalScore}
                weightage={item.weightage}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="subtitle" component="div" sx={{ m: 'auto', mt: 10 }}>
            There are no active assignments.
            <br /> Please
            <Button href="/dashboard/assignments" size="large">
              Create assignments
            </Button>
            in the class
            <Typography variant="h5" color="text.primary">
              {classSelected}
            </Typography>
            to view the student submissions here!
          </Typography>
        )}
      </Grid>
    </div>
  );
};
