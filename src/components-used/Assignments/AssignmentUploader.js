// material
import React from 'react';
import { Grid, Button, TextField, Input, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// components
import { doc, setDoc, arrayUnion, Timestamp, getDoc, collection, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db } from '../../firebase/initFirebase';

export const AssignmentUploader = (props) => {
  const today = new Date();
  const { user, storage, classSelected, curUser, setChangeCallback } = props;
  const [dbUser, setdbUser] = React.useState();
  const [file, setFile] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', score: '-1', deadline: today });
  const handleChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };
  React.useEffect(() => {
    if (curUser) {
      const docRef = doc(db, 'users', curUser?.email);
      getDoc(docRef).then((docSnap) => {
        setdbUser(docSnap?.data());
      });
    }
  }, [curUser]);
  const handleUpload = (e) => {
    e.preventDefault();
    if (classSelected) {
      const storageRef = ref(
        storage,
        `/classes/${classSelected}/assignments/${form.name}/assignment/${file.name}`
      );
      console.log(storageRef);
      if (file) {
        const currentDate = new Date();
        const metadata = {
          deadline: form.deadline,
          name: form.name,
          class: classSelected,
          author: user?.email,
          score: form.score,
          weightage: form.weightage,
          publishedDate: currentDate
        };
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            switch (snapshot.state) {
              case 'paused':
                alert('Upload is paused');
                break;
              case 'running':
                // alert('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              const assignmentRef = doc(db, 'classes', classSelected, 'assignments', form?.name);
              getDoc(assignmentRef).then((docSnap) => {
                if (docSnap?.data()) {
                  alert(
                    `Assignment with name "${form?.name}" already exists! Please give another name.`
                  );
                } else {
                  const assignmentData = {
                    name: form?.name,
                    deadline: Timestamp.fromDate(form?.deadline),
                    author: curUser?.email,
                    totalScore: form?.score,
                    publishedAt: Timestamp.fromDate(new Date()),
                    url
                  };
                  setDoc(assignmentRef, assignmentData);
                  const announcementRef = doc(
                    db,
                    'classes',
                    classSelected,
                    'announcements',
                    form?.name
                  );
                  const annnouncementData = {
                    type: 'assignment',
                    name: form?.name,
                    deadline: Timestamp.fromDate(form?.deadline),
                    author: curUser?.email,
                    totalScore: form?.score,
                    publishedAt: Timestamp.fromDate(new Date()),
                    url
                  };
                  setDoc(announcementRef, annnouncementData);
                  setChangeCallback((prev) => !prev);
                  alert('done!');
                }
              });
            });
          }
        );
      }
    }
  };

  return (
    <form onSubmit={handleUpload}>
      {/* <Typography variant="h4" noWrap>
        {' '}
        Upload an Assignment!
      </Typography> */}
      <Grid container spacing={3}>
        <Grid item>
          <TextField
            label="Name of the Assignment"
            name="Name of the Assignment"
            id="name-of-the-assignment"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Total Score"
            name="Total Score"
            id="total-score"
            value={form.score}
            onChange={(e) => setForm({ ...form, score: e.target.value })}
            fullWidth
          />
        </Grid>

        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="DateTimePicker"
              value={form.deadline}
              onChange={(newValue) => {
                setForm({ ...form, deadline: newValue });
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
  );
};
