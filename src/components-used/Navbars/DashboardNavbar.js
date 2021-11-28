import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Button, Modal, Typography } from '@mui/material';
// components
import { getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ClassSelect from './ClassSelect';
import { MHidden } from '../../components/@material-extend';
//

import { MyContext } from '../../utils/context';
import AccountPopover from './AccountPopover';
import { db, auth } from '../../firebase/initFirebase';
import InstructorModal from './InstructorModal';
import StudentModal from './StudentModal';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const [curUser, setCurUser] = React.useState(null);
  const [dbUser, setdbUser] = React.useState();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);
  const { classSelectedCallback, options, callbackSetOptions } = React.useContext(MyContext);
  const classSelected = localStorage.getItem('selectedID');
  onAuthStateChanged(auth, (user) => {
    if (user && auth) {
      setCurUser(user);
    }
  });
  React.useEffect(() => {
    if (curUser) {
      const docRef = doc(db, 'users', curUser?.email);
      getDoc(docRef).then((docSnap) => {
        setdbUser(docSnap?.data());
      });
    }
  }, [curUser]);
  const handleAddClass = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    if (curUser && auth) {
      const docRef = doc(db, 'users', curUser.email);
      getDoc(docRef).then((docSnap) => {
        if (docSnap?.data()?.classes) {
          const array = [...docSnap.data().classes.map((classDetails) => classDetails.classID)];
          callbackSetOptions(array);
          if (!!localStorage.getItem('selectedID') === false) {
            classSelectedCallback(docSnap.data().classes[0].classID);
            localStorage.setItem('selectedID', docSnap.data().classes[0].classID);
          } else {
            classSelectedCallback(localStorage.getItem('selectedID'));
          }
        }
      });
    }
  }, [curUser, classSelectedCallback, dbUser, callbackSetOptions]);
  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>
        <Typography>{classSelected?.name}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <ClassSelect id="class-id" />

        <Button variant="contained" onClick={handleAddClass} sx={{ minWidth: 120, ml: 3, mr: 5 }}>
          {' '}
          {dbUser?.type === 'instructor' ? '+ Create Class' : '+ Join Class'}
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {dbUser?.type === 'instructor' ? (
            <InstructorModal curUser={curUser} setOpen={setOpen} setOptions={callbackSetOptions} />
          ) : (
            <StudentModal curUser={curUser} setOpen={setOpen} setOptions={callbackSetOptions} />
          )}
        </Modal>

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
