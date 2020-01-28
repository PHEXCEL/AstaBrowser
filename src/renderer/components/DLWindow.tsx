import React, { useState, useEffect } from 'react';

// redux
import { useSelector, useDispatch } from "react-redux"
import { RootReducerType } from "../../store"
import uiSlice, { UIState } from "../../store/ui"
import { DLState, DLVideo, cancelThunk } from "../../store/dl"

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { ListItemIcon, CircularProgress } from '@material-ui/core';

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
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelIndexNumber, setCancelIndexNumber] = useState<number>(-1)
  const uiState: UIState = useSelector((state: RootReducerType) => state.ui)
  const dlState: DLState = useSelector((state: RootReducerType) => state.dl)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(dlState.dlVideos.filter((value) => !value.isCancel).length <= 0) {
      dispatch(uiSlice.actions.openDLWindow({isOpen: false}))
    } else {
      dispatch(uiSlice.actions.openDLWindow({isOpen: true}))
    }
  }, [dlState.dlVideos])

  // const handleClose = () => {
  //   dispatch(uiSlice.actions.openDLWindow({isOpen: false}))
  // }

  const handleVideo = (index: number) => {
    setCancelIndexNumber(index)
    setCancelOpen(true)
  }

  const onCancelClose = () => {
    setCancelOpen(false)
  }

  const onCancel = () => {
    setCancelOpen(false)
    // send to redux
    dispatch(cancelThunk(cancelIndexNumber))
  }

  return (
      <Dialog fullWidth maxWidth="md" open={uiState.isOpenDLWindow} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Downloads
            </Typography>
          </Toolbar>
        </AppBar>
        <List style={{minHeight: 100}}>
          {
            dlState.dlVideos.filter((value, index) => !value.isCancel ).map((value: DLVideo, index: number) => {
              return (
                <ListItem button onClick={()=>{handleVideo(value.videoIndex)}}>
                  <ListItemIcon>
                    <CircularProgress variant="static" value={value.progress}/>
                  </ListItemIcon>
                  <ListItemText primary={value.title} secondary={`${value.progress}% - ${value.done} / ${value.total} - ${value.pageUrl}`} />
                </ListItem>
              )
            })
          }
        </List>
        <CancelDialog open={cancelOpen} onClose={onCancelClose} onSelectCancel={onCancel} />
      </Dialog>
  );
}

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSelectCancel: () => void
}

function CancelDialog(props: DialogProps) {
  const { onClose, onSelectCancel, open } = props;
  const handleClose = () => {
    onClose();
  };
  const handleListItemClick = () => {
    onSelectCancel();
  };
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <List>
        <ListItem autoFocus button onClick={handleListItemClick}>
          <ListItemText primary="Cancel download" />
        </ListItem>
      </List>
    </Dialog>
  )
}