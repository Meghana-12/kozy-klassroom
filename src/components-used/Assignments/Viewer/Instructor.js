import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
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
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import downloadOutline from '@iconify/icons-eva/download-outline';
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/_dashboard/user';

import { MyContext } from '../../../utils/context';
import { db } from '../../../firebase/initFirebase';
//
import { getComparator, applySortFilter } from '../viewerFunctions';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'total', label: 'Total Score', alignRight: false },
  { id: 'deadline', label: 'Deadline', alignRight: false },
  { id: 'download', lable: 'Download', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function InstructorAssignmentsViewer() {
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
          const assignments = [];
          querySnapshot.forEach((doc) => {
            console.log('query', doc.data());
            assignments.push(doc.data());
          });
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
      <Container>
        <Card>
          <UserListToolbar
            placeholder="Search Assignment ... "
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
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((row) => {
                      const { name, totalScore, deadline, publishedAt, url } = row;
                      const cur = new Date();
                      const status = deadline > cur ? 'success' : 'banned';
                      const deadlineConverted = deadline?.toDate();
                      return (
                        <TableRow hover key={JSON.stringify(publishedAt)} tabIndex={-1}>
                          <TableCell align="left">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
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
                              {String(deadlineConverted)}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <a href={url} target="_blank" rel="noreferrer">
                              <Button variant="contained">
                                <Icon icon={downloadOutline} width={24} height={24} />
                              </Button>
                            </a>
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
