import React from 'react';

// redux
import { useSelector, useDispatch } from "react-redux"
import { RootReducerType } from "../../store"
import uiSlice, { UIState } from "../../store/ui"

// styles
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Snackbar from '@material-ui/core/Snackbar';

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const uiState: UIState = useSelector((state: RootReducerType) => state.ui)
  const dispatch = useDispatch()
  const handleStartDownloadClose = () => {
    dispatch(uiSlice.actions.openDLStartToast({isOpen: false}))
  }
  const handleEndDownloadClose = () => {
    dispatch(uiSlice.actions.openDLEndToast({isOpen: false}))
  }

  return (
    <React.Fragment>
      <Snackbar
        open={uiState.isOpenDLStartToast}
        onClose={handleStartDownloadClose}
        TransitionComponent={Transition}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Start Download...</span>}
      />
      <Snackbar
        open={uiState.isOpenDLEndToast}
        onClose={handleEndDownloadClose}
        TransitionComponent={Transition}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Finish Download...</span>}
      />
    </React.Fragment>
  );
}
