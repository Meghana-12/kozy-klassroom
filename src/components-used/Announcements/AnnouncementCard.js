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
  Avatar,
  Modal
} from '@mui/material';
// utils
import React from 'react';
import { setDoc, doc, getDoc, getDocs, collection, query } from 'firebase/firestore';
import moment from 'moment';
import ReplyModal from './ReplyModal';
// ----------------------------------------------------------------------

AnnouncementCard.propTypes = {
  data: PropTypes.object.isRequired
};

export default function AnnouncementCard({ data }) {
  const deadlineDate = data.deadline?.toDate();
  const [open, setOpen] = React.useState(false);
  const publishedAtDate = data.publishedDate?.toDate();
  const [title, setTitle] = React.useState(data?.title);
  const handleClose = () => setOpen(false);
  return (
    <>
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
          {/* {data.type !== 'assignment' && (
            <>
              {' '}
              <Button
                onClick={() => {
                  setTitle(data.title);
                  setOpen(true);
                }}
              >
                {' '}
                Reply{' '}
              </Button>
              {data.replies.length > 0 && <hr />}
            </> */}
          {/* )} */}
          {/* {data.type !== 'assignment' &&
            data.replies.map((item) => <div key={JSON.stringify(item.postedAt)}>{item.reply}</div>)} */}
        </CardContent>
      </Card>
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ReplyModal title={title} setOpen={setOpen} />
      </Modal> */}
    </>
  );
}
