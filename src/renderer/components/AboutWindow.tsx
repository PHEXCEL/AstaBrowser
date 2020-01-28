import { shell } from 'electron'
import React from 'react';

// redux
import { useSelector, useDispatch } from "react-redux"
import { RootReducerType } from "../../store"
import uiSlice, { UIState } from "../../store/ui"
import { AppState, getAppInfoThunk } from "../../store/app"

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { Divider } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const classes = useStyles({});
  const uiState: UIState = useSelector((state: RootReducerType) => state.ui)
  const appState: AppState = useSelector((state: RootReducerType) => state.app)
  const dispatch = useDispatch()
  const handleClose = () => {
    dispatch(uiSlice.actions.openAboutWindow({isOpen: false}))
  }
  React.useEffect(() => {
    dispatch(getAppInfoThunk())
  }, [])

  return (
      <Dialog fullWidth maxWidth="md" open={uiState.isOpenAboutWindow} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              About
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <ListItemText primary="AppName" secondary={appState.appName} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Version" secondary={appState.version} />
          </ListItem>
          <Divider/>
          <ListItem button onClick={() => {shell.openExternal(appState.hpUrl)}}>
            <ListItemText primary={(<React.Fragment>HomePage<OpenInNewIcon style={{fontSize: 16}}/></React.Fragment>)} secondary="ガジェットル" />
          </ListItem>
        </List>
      </Dialog>
  );
}
