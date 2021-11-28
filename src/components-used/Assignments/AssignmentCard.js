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
import Label from '../../components/Label';

export default function AssignmentCard({ name, deadline, totalScore }) {
  // const { classSelected } = React.useContext(MyContext);
  const classSelected = localStorage.getItem('selectedID');
  const cur = new Date();
  const status = deadline.toDate() > cur ? 'success' : 'banned';
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <Label variant="ghost" color={(status === 'banned' && 'error') || 'success'}>
            {status === 'banned' ? `Deadline passed : ` : `Open till :`}
            {deadline.toDate().toLocaleString()}
          </Label>
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography color="text.secondary">Total Score :{totalScore}</Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <Link
          to={`assignment?classid=${classSelected.replace(' ', '')}&name=${name.replace(' ', '')}`}
        >
          <Button size="small" onClick={() => {}} sx={{ mr: 2, mb: 1 }}>
            Learn More
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
