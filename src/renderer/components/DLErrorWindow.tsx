import React from 'react';

// redux
import { useSelector } from "react-redux"
import { RootReducerType } from "../../store"
import { DLState } from "../../store/dl"

// styles
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
      backgroundColor: '#e91e63',
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

export default function DLErrorDialog() {
  const classes = useStyles({});
  const [isShow, setIsShow] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | undefined>(undefined)
  const dlState: DLState = useSelector((state: RootReducerType) => state.dl)
  React.useEffect(() => {
    if(dlState.error !== error) {
        setError(dlState.error)
        setIsShow(true)
    }
  }, [dlState.error])

  return (
      <Dialog fullWidth maxWidth="md" open={isShow} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
                Error
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            {error?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setIsShow(false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
  );
}
