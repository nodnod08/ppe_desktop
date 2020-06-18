import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { setAlert } from './../../../actions/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CustomAlert = ({ type, header, message }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div className={classes.root}>
      <Alert
        onClose={() => {
          dispatch(
            setAlert({
              isShow: false,
              message: '',
              type: '',
            })
          );
        }}
        severity={type}
      >
        {message}
      </Alert>
    </div>
  );
};

export default CustomAlert;
