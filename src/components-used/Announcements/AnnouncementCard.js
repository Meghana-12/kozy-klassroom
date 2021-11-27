import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import {
  Box,
  Stack,
  Link,
  Card,
  Button,
  Divider,
  Typography,
  CardHeader,
  CardContent,
  Avatar
} from '@mui/material';
// utils
import React from 'react';
import { setDoc, doc, getDoc, getDocs, collection, query } from 'firebase/firestore';
import moment from 'moment';
// ----------------------------------------------------------------------

AnnouncementCard.propTypes = {
  data: PropTypes.object.isRequired
};

export default function AnnouncementCard({ data }) {
  const deadlineDate = data.deadline?.toDate();
  const publishedAtDate = data.publishedDate?.toDate();
  return (
    <Card sx={{ p: 1, mb: 2, mt: 2, minWidth: '100%' }}>
      <CardContent>
        <Box sx={{ minWidth: 240 }}>
          <Typography variant="h4">
            {data.type !== 'assignment' && <Avatar src={data.photoURL} />}
            {data.type === 'assignment' ? `${data.name} ` : data.title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {data.type === 'assignment'
            ? `Score:${data.totalScore} | Deadline: ${deadlineDate}`
            : data.message}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="caption" sx={{ flexShrink: 0, color: 'text.secondary' }}>
          {`Author : ${data.author} | Published at : ${publishedAtDate}`}
        </Typography>
      </CardContent>
    </Card>
  );
}
