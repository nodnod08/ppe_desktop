import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Dialog,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { blue } from "@material-ui/core/colors";

import { logout } from "./../../actions/actions";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

const Account = ({ handleToggle, open, user }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <Dialog onClose={handleToggle} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Current Account Logged In</DialogTitle>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.user_credentials.fullName} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <AlternateEmailIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.user_credentials.email} />
        </ListItem>

        <ListItem
          onClick={() => {
            localStorage.removeItem("ppe_desktop_user");
            dispatch(logout());
          }}
          autoFocus
          button
        >
          <ListItemAvatar>
            <Avatar>
              <ExitToAppIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Dialog>
  );
};

export default Account;
