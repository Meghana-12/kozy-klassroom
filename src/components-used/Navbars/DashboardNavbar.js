import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Card,
  TextField,
  Grid
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// components
import { getDoc, doc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { setDoc, Timestamp, updateDoc } from '@firebase/firestore';
import ClassSelect from './ClassSelect';
import { MHidden } from '../../components/@material-extend';
//
import Searchbar from '../../layouts/dashboard/Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from '../../layouts/dashboard/LanguagePopover';
import NotificationsPopover from '../../layouts/dashboard/NotificationsPopover';
import { db, auth } from '../../firebase/initFirebase';
import { MyContext } from '../../utils/context';
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4
};

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const [curUser, setCurUser] = React.useState(null);
  const [dbUser, setdbUser] = React.useState();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
      // console.log('nav', user);
    } else {
      // console.log('dashboard nav err');
    }
  });
  React.useEffect(() => {
    if (curUser) {
      // console.log('abcd');
      const docRef = doc(db, 'users', curUser?.email);
      getDoc(docRef).then((docSnap) => {
        setdbUser(docSnap?.data());
      });
    } else {
      // console.log('dashboard nav err -2');
    }
  }, [curUser]);
  const handleAddClass = () => {
    setOpen(true);
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>
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
            <InstructorModal curUser={curUser} setOpen={setOpen} />
          ) : (
            <StudentModal curUser={curUser} />
          )}
        </Modal>

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
