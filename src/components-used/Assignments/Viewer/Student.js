import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
import downloadOutline from '@iconify/icons-eva/download-outline';
import cloudUploadOutline from '@iconify/icons-eva/cloud-upload-outline';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Timestamp
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
  { id: 'name', label: 'Name', alignRight: false },
  // { id: 'score', label: 'Score', alignRight: false },
  { id: 'total', label: 'Total Score', alignRight: false },
  // { id: 'average', label: 'Average Score', alignRight: false },
  { id: 'deadline', label: 'Deadline', alignRight: false },

  { id: 'download', label: 'Download Assignment', alignRight: false },
  { id: 'submit', label: 'Submit Assignment', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function StudentAssignmentsViewer({ classID }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [curUser, setCurUser] = React.useState();
  const [docs, setDocs] = React.useState([]);

  const { classSelected } = React.useContext(MyContext);

  const auth = getAuth();
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
        getDocs(docRef).then((querySnapshot) => {
          // console.log('query', querySnapshot?.data());
          const assignments = [];
          querySnapshot.forEach((doc) => {
            console.log('query', doc.data());
            assignments.push(doc.data());
            setDocs(assignments);
          });
        });
      }
    }
  }, [curUser, classSelected, navigate]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = docs?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const [file, setFile] = React.useState(null);
  const handleChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };
  const handleSubmit = (e, assignmentName) => {
    e.preventDefault();
    if (classSelected) {
      const storageRef = ref(
        storage,
        `/classes/${classSelected}/assignments/${assignmentName}/submissions/${auth?.currentUser?.email}/${file.name}`
      );
      console.log(storageRef);
      if (file) {
        const uploadTask = uploadBytesResumable(storageRef, file);
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
            const currentDate = new Date();
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              const docRef = doc(
                db,
                'classes',
                classSelected,
                'assignments',
                assignmentName,
                'submissions',
                auth?.currentUser?.email
              );
              const docData = {
                email: auth?.currentUser?.email,
                submissionURL: url,
                score: -1,
                submissionTime: Timestamp.fromDate(currentDate)
              };

              setDoc(docRef, docData, { merge: true });
            });
          }
        );
      }
    }
  };
  return (
    <Page title="User | Minimal-UI">
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
                      const { name, totalScore, deadline, publishedAt, url } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;
                      const cur = new Date();
                      const status = deadline > cur ? 'success' : 'banned';
                      const deadlineConverted = moment(deadline).format('DD-MM-YYYY h:mm:ss');
                      console.log(deadlineConverted, cur, status);
                      // add number of students submitted, average score, highest score, difficulty level based on scores
                      return (
                        <TableRow
                          hover
                          key={JSON.stringify(publishedAt)}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/* <Avatar alt={name} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          {/* <TableCell align="left">{score}</TableCell> */}
                          <TableCell align="left">{totalScore}</TableCell>
                          {/* <TableCell align="left">{}</TableCell> */}
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === 'banned' && 'error') || 'success'}
                            >
                              {deadlineConverted}
                            </Label>
                          </TableCell>
                          <TableCell>
                            <a href={url} target="_blank" rel="noreferrer">
                              <Button variant="contained">
                                <Icon icon={downloadOutline} width={24} height={24} />
                              </Button>
                            </a>
                          </TableCell>
                          <TableCell align="right">
                            <Input type="file" onChange={handleChange} />
                            <Button
                              variant="contained"
                              onClick={(event) => handleSubmit(event, name)}
                            >
                              <Icon icon={cloudUploadOutline} width={24} height={24} />
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
