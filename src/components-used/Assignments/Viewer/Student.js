import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import downloadOutline from '@iconify/icons-eva/download-outline';
import cloudUploadOutline from '@iconify/icons-eva/cloud-upload-outline';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Button
} from '@mui/material';
// components
import { setDoc, doc, getDoc, getDocs, collection, Timestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Input from '@mui/material/Input';
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../../../components/_dashboard/user';

import { MyContext } from '../../../utils/context';
import { db, storage } from '../../../firebase/initFirebase';
/// / material
// components
import { getComparator, applySortFilter } from '../viewerFunctions';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'total', label: 'Total Score', alignRight: false },
  { id: 'deadline', label: 'Deadline', alignRight: false },

  { id: 'download', label: 'Download Assignment', alignRight: false },
  { id: 'submit', label: 'Submit Assignment', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function StudentAssignmentsViewer() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [curUser, setCurUser] = React.useState();
  const [docs, setDocs] = React.useState();

  // const { classSelected } = React.useContext(MyContext);
  const classSelected = localStorage.getItem('selectedID');
  const auth = getAuth();
  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurUser(user);
    }
  });
  React.useEffect(() => {
    if (curUser && classSelected !== null && db) {
      const docRef = collection(db, 'classes', classSelected, 'assignments');
      if (docRef) {
        getDocs(docRef).then((querySnapshot) => {
          const assignments = [];
          querySnapshot.forEach((doc) => {
            console.log('query', doc.data());
            assignments.push(doc?.data());
          });
          console.log('assignments', assignments);
          setDocs(assignments);
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
        try {
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
                  console.log('Upload is running');
                  break;
                default:
                  break;
              }
            },
            (error) => {
              console.log(error);
            },
            () => {
              const currentDate = new Date();
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                const getDocRef = doc(
                  db,
                  'classes',
                  classSelected,
                  'assignments',
                  assignmentName,
                  'submissions',
                  auth?.currentUser?.email
                );

                getDoc(getDocRef).then((docSnap) => {
                  console.log(docSnap?.data());
                  if (docSnap?.data()) {
                    alert(`You've already submitted to the assignment${assignmentName}`);
                  } else {
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
                    alert('done!');
                  }
                });
              });
            }
          );
        } catch (err) {
          alert('Please Provide File!');
        }
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
                      const status = deadline.toDate() > cur ? 'success' : 'banned';
                      const deadlineConverted = deadline.toDate().toLocaleString();

                      console.log(deadlineConverted, cur, status);
                      return (
                        <TableRow
                          hover
                          key={JSON.stringify(publishedAt)}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap sx={{ pl: 2 }}>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{totalScore}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === 'banned' && 'error') || 'success'}
                            >
                              {status === 'banned' ? `Deadline passed : ` : `Open till :`}
                              {`${deadlineConverted}`}
                            </Label>
                          </TableCell>
                          <TableCell align="center">
                            <a href={url} target="_blank" rel="noreferrer">
                              <Button variant="contained">
                                <Icon icon={downloadOutline} width={24} height={24} />
                              </Button>
                            </a>
                          </TableCell>
                          <TableCell align="center">
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
