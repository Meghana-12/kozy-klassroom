// material
import React from 'react';
import {
  Box,
  Grid,
  Container,
  Typography,
  Button,
  FormControl,
  TextField,
  Card
} from '@mui/material';
// components
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, listAll } from 'firebase/storage';
import Input from '@mui/material/Input';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import FormControlLabel from '@mui/material/FormControlLabel';
import AssignmentsViewer from '../layouts/dashboard/AssignmentsViewer';
import { MyContext } from '../utils/context';
import Page from '../components/Page';
import { AppTasks, Announcements, Classes } from '../components/_dashboard/app';
import { db } from '../firebase/initFirebase';
import { AssignmentUploader } from '../layouts/dashboard/AssignmentUploader';
// import Box from '@mui/material/Box';
// ----------------------------------------------------------------------

export default function Assignments() {
  const { classSelected } = React.useContext(MyContext);

  const [checked, setChecked] = React.useState(false);
  const [assignments, setAssignments] = React.useState([]);
  // const [downloadURL, setDownloadURL] = React.useState('');
  const containerRef = React.useRef(null);

  const handleShow = () => {
    setChecked((prev) => !prev);
  };

  const auth = getAuth();
  const user = auth?.currentUser;
  React.useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [auth]);
  const navigate = useNavigate();
  console.log(user);

  const storage = getStorage();
  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            Hi, {user?.displayName} .
            {classSelected && <div> Selected Class : {classSelected} </div>}
          </Typography>
        </Box>
        <Card sx={{ p: 5, mb: 5 }}>
          {' '}
          <AssignmentUploader classSelected={classSelected} user={user} storage={storage} />{' '}
        </Card>

        {/* <Grid item xs={12} md={6} lg={4}>
            <Classes classes={classes} />
          </Grid> */}

        {/* <Grid item xs={12} md={6} lg={8}>
            <Announcements />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        <AssignmentsViewer assignments={assignments} />
      </Container>
    </Page>
  );
}
