import React, { useState, useEffect } from 'react';
// styles
import { Resolution } from "../../store/dl"
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';


const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [resolutions, setResolutions] = useState<Resolution[]>([])
  const handleClose = () => {
      setIsShow(false)
  }

  useEffect(() => {
        global.dlManager.resolutions$
        .subscribe(
            value => {
                if(value.length > 0) {
                    setIsShow(true)
                    setResolutions(value)
                }
            },
            error => console.log(`2 onError: ${error}`),
            () => console.log('2 onCompleted')
        );
  }, [])

  const handleResolutionClick = (resolution: Resolution) => {
    global.dlManager.selectResolution(resolution)
    setIsShow(false)
  }

  return (
      <Dialog fullWidth maxWidth="md" open={isShow} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle id="simple-dialog-title">Select Resolution</DialogTitle>
            <List>
                {
                    resolutions.map((value, index) => {
                        return (
                            <ListItem button onClick={() => handleResolutionClick(value)} key={value.url}>
                                <ListItemText primary={`${value.width} x ${value.height} - ${value.bitrate} bps`} />
                            </ListItem>
                        )
                    })
                }
            </List>
      </Dialog>
  );
}