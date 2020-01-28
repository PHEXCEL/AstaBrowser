import React from 'react';

// redux
import { useSelector, useDispatch } from "react-redux"
import { RootReducerType } from "../../store"
import uiSlice, { UIState } from "../../store/ui"
import { CatchVideo, DLState, downloadThunk} from "../../store/dl"

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
import { ListItemIcon } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

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
  const classes = useStyles();
  const uiState: UIState = useSelector((state: RootReducerType) => state.ui)
  const dlState: DLState = useSelector((state: RootReducerType) => state.dl)
  const dispatch = useDispatch()
  const handleClose = () => {
    dispatch(uiSlice.actions.openCatchWindow({isOpen: false}))
  }

  const handleVideoClick = (index: number) => {
    const catchVideo = dlState.catchVideos[index]

    console.log('====================================');
    console.log(catchVideo);
    console.log('====================================');
    // DEBUG: reduxへ送る
    dispatch(downloadThunk(catchVideo))
    dispatch(uiSlice.actions.openDLStartToast({isOpen: true}))
    dispatch(uiSlice.actions.openCatchWindow({isOpen: false}))
  }

  return (
      <Dialog fullWidth maxWidth="md" open={uiState.isOpenCatchWindow} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Catch videos
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {
            dlState.catchVideos.map((value: CatchVideo, index: number)=>{
              return(
                <ListItem button onClick={()=>{handleVideoClick(index)}}>
                  <ListItemIcon>
                    <CloudDownloadIcon/>
                  </ListItemIcon>
                  <ListItemText primary={value.videoUrl} secondary={value.type} />
                </ListItem>
              )
            })
          }
        </List>
      </Dialog>
  );
}
