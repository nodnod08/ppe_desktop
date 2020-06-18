import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      maxWidth: 400,
      minHeight: 500,
      marginLeft: "50%",
      transform: "translateX(-50%)",
      marginTop: 50,
      padding: "1%",
      fontFamily: "sans-serif",
      boxShadow: "0px 0px 20px rgb(235, 235, 235)"
    },
    center: {
      marginLeft: "50%",
      transform: "translateX(-50%)"
    },
    intro: {
      textAlign: "center"
    },
    field: {
      textAlign: "center",
      marginLeft: "2%",
      marginRight: "2%"
    }
  }));