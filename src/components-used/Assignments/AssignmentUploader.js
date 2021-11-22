// material
import React from 'react';
import { Grid, Button, TextField } from '@mui/material';
// components
import { doc, setDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Input from '@mui/material/Input';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { db } from '../../firebase/initFirebase';

export const AssignmentUploader = (props) => {
  const today = new Date();
  const { user, storage, classSelected } = props;

  const [file, setFile] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', score: '-1', weightage: 0, deadline: today });
  const handleChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (classSelected) {
      const storageRef = ref(
        storage,
        `/classes/${classSelected}/assignments/${form.name}-${file.name}`
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
            alert('done!');
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              const docRef = doc(db, 'classes', classSelected);
              const docData = {
                assignments: arrayUnion(
                  ...[
                    {
                      name: form?.name,
                      score: form?.score,
                      deadline: Timestamp.fromDate(form.deadline),
                      weightage: form?.weightage,
                      publishedDate: Timestamp.fromDate(new Date()),
                      author: user?.email,
                      class: classSelected,
                      url
                    }
                  ]
                ),
                announcements: arrayUnion(
                  ...[
                    {
                      name: form?.name,
                      score: form?.score,
                      deadline: Timestamp.fromDate(form.deadline),
                      weightage: form?.weightage,
                      publishedDate: Timestamp.fromDate(new Date()),
                      author: user?.email,
                      class: classSelected,
                      url,
                      type: 'assignment'
                    }
                  ]
                )
              };
              setDoc(docRef, docData, { merge: true });
            });
          }
        );
      }
    }
  };

  return (
    <form onSubmit={handleUpload}>
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
          <TextField
            label="Weightage"
            name="Weightage"
            id="weightage"
            value={form.weightage}
            onChange={(e) => setForm({ ...form, weightage: e.target.value })}
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
          {/* <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" multiple type="file" />
            <Button variant="contained" component="span">
              Upload
            </Button>
          </label> */}
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
