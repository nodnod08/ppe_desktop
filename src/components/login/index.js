import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Typography, Grid, TextField, Button, CircularProgress } from "@material-ui/core";
import axios from "axios";

import handleState from "./hooks/setValue";
import { setLoading, login } from "./../../actions/actions";
import { useStyles } from "./styles";

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.main);
  const { APP_URL, loading } = data;

  const [values, setValues, reset] = handleState({
    email: "",
    password: "",
  });

  const login_attempt = () => {
    dispatch(setLoading(true));
    axios
      .post(`${APP_URL}/api-user/login-admin`, {
        email: values.email,
        password: values.password,
      })
      .then((result) => {
        if (result.data.success) {
          let credentials = {
            error: false,
            token: result.data.data.token,
            user_credentials: result.data.data.user_credentials,
            isLoggedIn: true,
          };
          dispatch(login(credentials, "user"));
          localStorage.setItem("ppe_desktop_user", JSON.stringify(credentials));
        } else {
          dispatch(login({ error: true }, "user"));
        }
        dispatch(setLoading(false));
      });
  };

  return (
    <React.Fragment>
      <Paper square className={classes.root} variant="outlined">
        <img
          className={classes.center}
          src={require("../../public/images/logo.png")}
          width="90px"
          height="40px"
          alt=""
        />
        <Grid className={classes.intro}>
          <Typography variant="h6" gutterBottom>
            Login Management
          </Typography>
          <small>Create an account with your Administrator</small>
        </Grid>
        <br />
        <br />
        <br />
        <Grid className={classes.field}>
          <TextField
            id="outlined-basic"
            size="small"
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            name="email"
            value={values.username}
            onChange={setValues}
          />
          <br />
          <br />
          <br />
          <TextField
            id="outlined-basic"
            size="small"
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            value={values.password}
            onChange={setValues}
          />
          <br />
          <br />
          {loading ? (
            <CircularProgress />
          ) : (
            <Button size="small" variant="outlined" color="primary" onClick={login_attempt}>
              Login
            </Button>
          )}
        </Grid>
        <Grid>
          <br />
          <br />
          <small>
            <b>Note: </b>You must accompanied by your Administrator before creating your user
            account. Privacy policy.
          </small>
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default Login;
