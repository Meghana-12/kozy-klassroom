import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
import downloadOutline from '@iconify/icons-eva/download-outline';
import cloudUploadOutline from '@iconify/icons-eva/cloud-upload-outline';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField
} from '@mui/material';
// components
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  arrayUnion,
  Timestamp,
  where
} from 'firebase/firestore';
import moment from 'moment';
import downloadFill from '@iconify/icons-eva/edit-fill';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Input from '@mui/material/Input';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/_dashboard/user';

import { MyContext } from '../../../utils/context';
import { db, storage } from '../../../firebase/initFirebase';
/// / material
// components
import docs from '../../../_mocks_/user';
import { descendingComparator, getComparator, applySortFilter } from '../viewerFunctions';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'student', label: 'Student', alignRight: false },
  { id: 'download', label: 'Download Submission', alignRight: false },
  { id: 'score', label: 'Score', alignRight: false },
  // { id: 'total', label: 'Total Score', alignRight: false },
  //   { id: 'average', label: 'Average Score', alignRight: false },
  // { id: 'submissionTime', label: 'Submitted at', alignRight: false },

  //   { id: 'submit', label: 'Submit Assignment', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function SubmissionsViewer({ assignmentName }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('email');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [curUser, setCurUser] = React.useState();
  const [docs, setDocs] = React.useState([]);
  // const [assignmentName, setAssignmentName] = React.useState();
  const { classSelected } = React.useContext(MyContext);
  console.log(assignmentName);
  const auth = getAuth();
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
    }
  });
  React.useEffect(() => {
    if (curUser && classSelected) {
      const docRef = doc(db, 'classes', classSelected);
      // query(docRef, where('email', '==', assignmentName));
      console.log(assignmentName);
      if (docRef) {
        getDoc(docRef).then((classDetails) => {
          console.log(classDetails?.data());
          const submissionData = classDetails?.data()?.assignments[0]?.name;
          console.log(submissionData, submissionData?.submissions, assignmentName);
          setDocs(
            classDetails?.data()?.assignments.find((item) => item.name === assignmentName)
              ?.submissions || []
          );
        });
      }
    }
  }, [curUser, classSelected, navigate, assignmentName]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = docs?.map((n) => n.email);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, email) => {
    const selectedIndex = selected.indexOf(email);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, email);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - docs?.length) : 0;

  const filteredUsers = applySortFilter(docs, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers?.length === 0;

  return (
    <Page title="User | Minimal-UI">
      {/* {assignmentName} */}
      <Container>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={docs?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((row) => {
                      const { email, score, submissionURL } = row;
                      const isItemSelected = selected.indexOf(email) !== -1;
                      // const cur = new Date();
                      // const status = deadline > cur ? 'success' : 'banned';
                      // const deadlineConverted = moment(deadline).format('DD-MM-YYYY h:mm:ss');
                      // console.log(deadlineConverted, cur, status);
                      // add number of students submitted, average score, highest score, difficulty level based on scores
                      return (
                        <TableRow
                          hover
                          key={email}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, email)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/* <Avatar alt={email} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
                                {email}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <a href={submissionURL} target="_blank" rel="noreferrer">
                              <Button variant="contained">
                                <Icon icon={downloadOutline} width={24} height={24} />
                              </Button>
                            </a>
                          </TableCell>
                          <TableCell align="left">
                            <TextField value={score} />
                          </TableCell>

                          <TableCell>
                            <Button variant="outlined" onClick={() => {}}>
                              Save
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={docs?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
