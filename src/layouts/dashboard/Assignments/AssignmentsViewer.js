import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
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
  TablePagination
} from '@mui/material';
// components
import { setDoc, doc, getDoc, getDocs, collection, query } from 'firebase/firestore';
import moment from 'moment';
import downloadFill from '@iconify/icons-eva/edit-fill';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/_dashboard/user';

import { MyContext } from '../../../utils/context';
import { db } from '../../../firebase/initFirebase';
//
import docs from '../../../_mocks_/user';
import { descendingComparator, getComparator, applySortFilter } from './viewerFunctions';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  // { id: 'score', label: 'Score', alignRight: false },
  { id: 'total', label: 'Total Score', alignRight: false },
  { id: 'average', label: 'Average Score', alignRight: false },
  { id: 'deadline', label: 'Deadline', alignRight: false },

  { id: 'download', label: 'Download Assignment', alignRight: false },
  { id: 'submissions', label: 'Submissions', alignRight: false },
  { id: 'number-submissions', label: 'Number of Submissions', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function AssignmentsViewer() {
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
      // ...
    } else {
      navigate('/login');
    }
  });
  React.useEffect(() => {
    if (auth) {
      const docRef = doc(db, 'classes', classSelected);
      getDoc(docRef).then((classDetails) => {
        console.log(classDetails?.data());
        setDocs(classDetails?.data()?.assignments);
      });
    } else {
      navigate('/login');
    }
  }, [auth, classSelected, navigate]);

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
  const handleAssignmentDownload = (name, url) => {
    console.log(name, url);
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
                      const { name, score, deadline, publishedAt, weightage, url } = row;
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
                          <TableCell align="left">{score}</TableCell>
                          <TableCell align="left">dunno</TableCell>
                          {/* <TableCell align="left">{}</TableCell> */}
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === 'banned' && 'error') || 'success'}
                            >
                              {deadlineConverted}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <Button variant="contained">
                              {/* <a href={url} target="_blank" rel="noreferrer"> */}
                              <Icon icon={downloadFill} width={24} height={24} />
                              {/* </a> */}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained">
                              {/* <a href={url} target="_blank" rel="noreferrer"> */}
                              <Icon icon={downloadFill} width={24} height={24} />
                              {/* </a> */}
                            </Button>
                          </TableCell>
                          <TableCell align="right">
                            <UserMoreMenu />
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
