import React from 'react';

// electron
import {remote} from 'electron'
const dialog = remote.dialog


// redux
import { useSelector, useDispatch } from "react-redux"
import { RootReducerType } from "../../store"
import uiSlice, { UIState } from "../../store/ui"
import settingSlice, { SettingState } from "../../store/setting"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// styles
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

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
  const [isShowInputDialog, setIsShowInputDialog] = React.useState<boolean>(false)
  const uiState: UIState = useSelector((state: RootReducerType) => state.ui)
  const settingState: SettingState = useSelector((state: RootReducerType) => state.setting)
  const dispatch = useDispatch()
  const handleClose = () => {
    dispatch(uiSlice.actions.openSettingWindow({isOpen: false}))
  }

  // actions
  const handleSavePath = () => {
    const win = remote.getCurrentWindow()
    const dirs = dialog.showOpenDialogSync(win, { properties: ['openDirectory', 'createDirectory']});
    if(dirs) {
      if (Array.isArray(dirs) && dirs.length > 0) {
        const path = dirs[0];
        dispatch(settingSlice.actions.changeSavePath({value: path}))
      }
    }
  }
  const handleSubmit = (value: string) => {
    if(value === "") {
        console.log('');
    } else {
      console.log('====================================');
      console.log(value);
      console.log('====================================');
      dispatch(settingSlice.actions.changeUserAgent({value: value}))
    }
    setIsShowInputDialog(false)
  }

  const handleSetDefaultSettings = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(settingSlice.actions.setDefaultSettings())
  }

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="md" open={uiState.isOpenSettingWindow} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Settings
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button onClick={handleSavePath}>
            <ListItemText primary="SavePath" secondary={settingState.savePath} />
          </ListItem>
          <ListItem button onClick={() => setIsShowInputDialog(true)}>
            <ListItemText primary="UserAgent" secondary={settingState.userAgent} />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleSetDefaultSettings}>
            <ListItemText primary="Reset settings" />
          </ListItem>
        </List>
      </Dialog>
      <InputDialog isShow={isShowInputDialog} callback={handleSubmit} title="Change UserAgent"/>
    </React.Fragment>
  );
}

interface InputDialogProps {
  callback: (value: string) => void
  isShow: boolean
  title: string
}

function InputDialog(props: InputDialogProps) {
  const [inputValue, setInputValue] = React.useState<string>("")
  const handleClose = () => {
    props.callback("")
  }
  const handleSubmit = () => {
    props.callback(inputValue)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value)
  }
  return (
    <Dialog fullWidth maxWidth="md" open={props.isShow} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
          <TextField placeholder="Enter UserAgent" style={{width: '100%'}} value={inputValue} onChange={onChange}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}