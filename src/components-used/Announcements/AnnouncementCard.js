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
  Modal,
  Grid,
  CardActions
} from '@mui/material';
// utils
import React from 'react';

import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplyModal from './ReplyModal';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));
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
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <Card sx={{ p: 1, mb: 2, mt: 2, minWidth: '100%' }}>
        <CardContent>
          <Grid container flexDirection="row">
            {data.type !== 'assignment' && (
              <Grid item sx={{ pr: 2 }}>
                {' '}
                <Avatar src={data.photoURL} />
              </Grid>
            )}
            <Grid item>
              <Typography variant="h4">
                {data.type === 'assignment' ? `${data.name} ` : data.title}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ color: 'text.secondary', pt: 2 }}>
            {data.type === 'assignment'
              ? `Score:${data.totalScore} | Deadline: ${deadlineDate}`
              : data.message}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" sx={{ flexShrink: 0, color: 'text.secondary' }}>
            {`Author : ${data?.author} | Published at : ${publishedAtDate}`}
          </Typography>

          {data?.replies?.length > 0 && (
            <>
              <CardActions>
                {data?.type !== 'assignment' && (
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
                    {data?.replies?.length > 0 && <hr />}
                  </>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button type="text" size="small" onClick={handleExpandClick}>
                  View Replies
                  <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                    {' '}
                    <ExpandMoreIcon />
                  </ExpandMore>
                </Button>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  {data?.type !== 'assignment' &&
                    data?.replies?.map((item) => {
                      const replyPublishedAt = item?.postedAt?.toDate();
                      return (
                        <div key={String(item?.publishedDate)}>
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', pt: 1, pl: 1 }}
                          >
                            {item.reply}
                          </Typography>

                          <Grid container flexDirection="row" sx={{ p: 1 }} spacing={2}>
                            <Box sx={{ flexGrow: 1 }} />
                            <Grid item sx={{ alignSelf: 'center' }}>
                              <Typography
                                variant="caption"
                                sx={{ flexShrink: 0, color: 'text.secondary' }}
                              >
                                {' '}
                                {`Author : ${item?.author} | Published at : ${replyPublishedAt}`}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Avatar src={item?.photoURL} sx={{ width: 24, height: 24 }} />
                            </Grid>
                          </Grid>

                          <hr />
                        </div>
                      );
                    })}
                </CardContent>
              </Collapse>
            </>
          )}
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ReplyModal title={title} setOpen={setOpen} />
      </Modal>
    </>
  );
}
