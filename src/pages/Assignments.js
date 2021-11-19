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

// import Box from '@mui/material/Box';
// ----------------------------------------------------------------------

export default function Assignments() {
  const [file, setFile] = React.useState(null);
  const { classSelected } = React.useContext(MyContext);
  const [value, setValue] = React.useState('');
  const [score, setScore] = React.useState(-1);
  const [weightage, setWeightage] = React.useState(0);
  const [deadline, setDeadline] = React.useState();
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
  const handleChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (classSelected) {
      const storageRef = ref(
        storage,
        `/classes/${classSelected}/assignments/${`${value}-${file.name}`}`
      );
      console.log(storageRef);
      if (file) {
        const currentDate = new Date();
        const metadata = {
          deadline,
          name: value,
          class: classSelected,
          author: user?.email,
          score,
          weightage,
          publishedDate: currentDate
        };
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        // .then((snapshot) => {
        //   console.log('Uploaded a blob or file!');
        // })
        // .catch((err) => console.log(err));

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            switch (snapshot.state) {
              case 'paused':
                alert('Upload is paused');
                break;
              case 'running':
                alert('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            alert('done!');
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              // console.log('File available at', url);
              // setDownloadURL(url);
              const docRef = doc(db, 'classes', classSelected);
              // const q = query(docRef, where('class', '==', classSelected));
              // addDoc(collection(db, "classes" ))
              setDoc(
                docRef,
                {
                  assignments: arrayUnion({
                    name: value,
                    score,
                    // deadline: String(deadline),
                    weightage,
                    url
                  })
                },
                { merge: true }
              );
            });
          }
        );
      }
    }
  };

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
          <form onSubmit={handleUpload}>
            <Grid container spacing={3}>
              <Grid item>
                <TextField
                  label="Name of the Assignment"
                  name="Name of the Assignment"
                  id="name-of-the-assignment"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Total Score"
                  name="Total Score"
                  id="total-score"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Weightage"
                  name="Weightage"
                  id="weightage"
                  value={weightage}
                  onChange={(e) => setWeightage(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="DateTimePicker"
                    value={deadline}
                    onChange={(newValue) => {
                      setDeadline(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item>
                <Input required type="file" onChange={handleChange} />
              </Grid>
              <Grid item>
                <Button variant="contained" fullWidth disabled={!file} type="submit">
                  Upload File
                </Button>
              </Grid>
            </Grid>
          </form>
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
