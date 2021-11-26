import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { MyContext } from '../../utils/context';

export default function AssignmentCard({
  name,
  deadline,
  numberOfSubmissions,
  averageScore,
  totalScore,
  weightage
}) {
  const { classSelected } = React.useContext(MyContext);
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {deadline}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Total Score :{totalScore} | Weightage : {weightage}
        </Typography>
        <Typography variant="body2">Average Score : {averageScore}</Typography>
        {/* <Typography variant="body2">Number Of Submissions : {numberOfSubmissions}</Typography> */}
      </CardContent>
      <CardActions>
        <Link to={`assignment?classid=${classSelected}&name=${name}`}>
          <Button size="small" onClick={() => {}} fullWidth>
            Learn More
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
