import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
import React from 'react';
import { setDoc, doc, getDoc, getDocs, collection, query } from 'firebase/firestore';
import moment from 'moment';
import { MyContext } from '../utils/context';
import { db } from '../firebase/initFirebase';
import { mockImgCover } from '../utils/mockImages';
//
import Scrollbar from '../components/Scrollbar';
// ----------------------------------------------------------------------

const NEWS = [...Array(5)].map((_, index) => {
  const setIndex = index + 1;
  return {
    title: faker.name.title(),
    description: faker.lorem.paragraphs(),
    image: mockImgCover(setIndex),
    postedAt: faker.date.soon()
  };
});

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.object.isRequired
};

function NewsItem({ news }) {
  const { name, score, weightage, deadline, publishedAt } = news;
  const deadlineDate = moment(deadline).format('DD-MM-YYYY h:mm:ss');
  const publishedAtDate = moment(publishedAt).format('DD-MM-YYYY h:mm:ss');
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {`${name} | Deadline: ${deadlineDate}`}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {`Score:${score} | Weightage:${weightage}`}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {`Published at : ${publishedAtDate}`}
      </Typography>
    </Stack>
  );
}

export default function Announcements() {
  const [docs, setDocs] = React.useState([]);
  const { classSelected } = React.useContext(MyContext);
  React.useEffect(() => {
    const docRef = doc(db, 'classes', classSelected);
    getDoc(docRef).then((classDetails) => {
      console.log(classDetails?.data());
      setDocs(classDetails?.data()?.announcements);
    });
  }, []);
  return (
    <Card>
      <CardHeader title="Announcements" />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {docs?.map((news) => (
            <NewsItem key={news.deadline} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      {/* <Divider /> */}

      {/* <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="#"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          View all
        </Button>
      </Box> */}
    </Card>
  );
}
