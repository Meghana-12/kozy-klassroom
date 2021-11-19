import faker from 'faker';
import PropTypes from 'prop-types';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Box,
  Grid,
  Card,
  Paper,
  Typography,
  CardHeader,
  CardContent,
  getDialogContentTextUtilityClass,
  Button,
  CardActionArea
} from '@mui/material';
// utils
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/initFirebase';

import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const CLASSES = [
  {
    name: 'FaceBook',
    value: faker.datatype.number(),
    icon: <Icon icon={facebookFill} color="#1877F2" width={32} height={32} />
  },
  {
    name: 'Google',
    value: faker.datatype.number(),
    icon: <Icon icon={googleFill} color="#DF3E30" width={32} height={32} />
  },
  {
    name: 'Linkedin',
    value: faker.datatype.number(),
    icon: <Icon icon={linkedinFill} color="#006097" width={32} height={32} />
  },
  {
    name: 'Twitter',
    value: faker.datatype.number(),
    icon: <Icon icon={twitterFill} color="#1C9CEA" width={32} height={32} />
  }
];

// ----------------------------------------------------------------------

ClassCard.propTypes = {
  classDetails: PropTypes.object
};

function ClassCard(props) {
  // const { icon, value, name } = classDetails;
  console.log(props.classDetails.className);
  const handleOpenClass = () => {};
  return (
    <Card>
      <CardActionArea onClick={handleOpenClass}>
        <CardContent>
          <Typography variant="h6">{props.classDetails.classID} </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {props.classDetails.className}{' '}
          </Typography>
          View More details
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Classes(props) {
  console.log(props.classes);
  const handleNewClass = () => {};
  return (
    <div>
      <h3>Classes</h3>
      <div>
        {props.classes.map((classDetails) => (
          <ClassCard key={classDetails.className} classDetails={classDetails} />
        ))}
      </div>
      {/* </CardContent> */}
      <Button
        variant="contained"
        component={RouterLink}
        to="#"
        startIcon={<Icon icon={plusFill} />}
        onClick={handleNewClass}
      >
        New Class
      </Button>
    </div>
  );
}
