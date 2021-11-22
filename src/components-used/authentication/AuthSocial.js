import React from 'react';
import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import githubFill from '@iconify/icons-eva/github-fill';

import { getAuth, signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import Grid from '@mui/material/Grid';
import { doc, setDoc } from 'firebase/firestore';
// material
import { Stack, Button, Select, MenuItem } from '@mui/material';
import { BrowserRouter as Router, Route, Switch, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/initFirebase';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const auth = getAuth();

  const navigate = useNavigate();
  if (auth?.currentUser) {
    navigate('/dashboard/assignments');
  }
  const githubProvider = new GithubAuthProvider();
  const googleProvider = new GoogleAuthProvider();
  const [curUser, setUser] = React.useState();
  const [typeValue, setTypeValue] = React.useState('instructor');
  const handleGithubSignIn = () => {
    if (typeValue == null) {
      console.log('provide type!');
    } else {
      signInWithPopup(auth, githubProvider)
        .then((result) => {
          // This gives you a GitHub Access Token. You can use it to access the GitHub API.
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const { user } = result;
          setUser(user);
          try {
            const docRef = doc(db, 'users', user?.email);
            setDoc(
              docRef,
              {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                type: typeValue
              },
              { merge: true }
            );
            console.log('Document written with ID: ', docRef.id);
            navigate('/dashboard/assignments');
          } catch (e) {
            console.error('Error adding document: ', e);
          }
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleGoogleSignIn = () => {
    if (typeValue == null) {
      console.log('provide type!');
    } else {
      const auth = getAuth();
      signInWithPopup(auth, googleProvider)
        .then((result) => {
          // This gives you a GitHub Access Token. You can use it to access the GitHub API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const { user } = result;
          setUser(user);
          try {
            const docRef = doc(db, 'users', user?.email);
            setDoc(
              docRef,
              {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                type: typeValue
              },
              { merge: true }
            );
            console.log('Document written with ID: ', docRef.id);
            navigate('/dashboard/assignments');
          } catch (e) {
            console.error('Error adding document: ', e);
          }
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <>
      <Stack direction="column" spacing={2}>
        {auth?.currentUser && <div>You are already signed in {auth?.currentUser.displayName}</div>}
        <Select
          required
          labelId="type"
          id="type"
          value={typeValue}
          label="Type"
          name="type"
          onChange={(event) => setTypeValue(event.target.value)}
        >
          <MenuItem value="instructor">Instructor</MenuItem>
          <MenuItem value="student">Student</MenuItem>
        </Select>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={handleGoogleSignIn}
          >
            <Icon icon={googleFill} color="#DF3E30" height={24} />
          </Button>

          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={handleGithubSignIn}
          >
            <Icon icon={githubFill} color="#fffff" height={24} />
          </Button>

          {/* <Button fullWidth size="large" color="inherit" variant="outlined">
          <Icon icon={twitterFill} color="#1C9CEA" height={24} />
        </Button> */}
        </Stack>

        {/* <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider> */}
      </Stack>
    </>
  );
}
