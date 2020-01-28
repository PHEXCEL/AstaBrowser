import { shell } from 'electron'
import React, { useState, useEffect } from "react"

//redux
import { useSelector, useDispatch } from "react-redux"
import { RootReducerType } from "../../store"
import browserSlice, { ROOT_URL, BrowserState } from "../../store/browser"
import uiSlice from "../../store/ui"
import { AppState } from "../../store/app"
import { DLState } from "../../store/dl"

// style
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Menu, MenuItem } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LanguageIcon from '@material-ui/icons/Language';
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ReplayIcon from '@material-ui/icons/Replay';

const makeMyStyles = makeStyles((theme: Theme) =>
  createStyles({
  logo: {
    maxHeight: 50
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
    display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    },
    textAlign: 'left',
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    width: '100%',
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  icon: {
    color: 'white',
  }
  }),
);

export default function TopBar(): JSX.Element {
    const classes = makeMyStyles({});
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [inputIcon, setInputIcon] = useState((<SearchIcon/>))
    const browserState: BrowserState = useSelector((state: RootReducerType) => state.browser)
    const dlState: DLState = useSelector((state: RootReducerType)=>state.dl)
    const appState: AppState = useSelector((state: RootReducerType)=>state.app)
    const [inputString, setInputString] = useState<string>("")
    const dispatch = useDispatch()

    useEffect(() => {
      const lastUrl = browserState.history[browserState.history.length - 1]
      console.log(lastUrl)
      if(lastUrl === ROOT_URL) {
        setInputString("")
      } else {
        setInputString(lastUrl)
      }
    }, [browserState])

    const setStringInNoDataInput = () => {
      const lastUrl = browserState.history[browserState.history.length - 1]
      if(lastUrl === ROOT_URL) {
        setInputString("")
      } else {
        setInputString(lastUrl)
      }
    }

    // action
    const onClickBeforeBtn = (e: React.MouseEvent<HTMLElement>) => {
      console.log('onClickBeforeBtn');

      // reduxへ送る
      dispatch(browserSlice.actions.pop())
    }
    const onClickCatchVideoButton = (e: React.MouseEvent<HTMLElement>) => {
      console.log('onClickAddVideoBtn')

      // send redux
      dispatch(uiSlice.actions.openCatchWindow({isOpen: true}))
    }
    // const onClickDLBtn = (e: React.MouseEvent<HTMLElement>) => {
    //   console.log('onClickDLBtn');

    //   // reduxへ送る
    //   dispatch(uiSlice.actions.openDLWindow({isOpen: true}))
    // }
    const onClickMoreBtn = (e: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(e.currentTarget);
    }
    const onClickOtherMoreBtn = () => {
      setAnchorEl(null)
    }
    const onClickSettingBtn = () => {
      console.log('====================================');
      console.log("onClickSettingBtn");
      console.log('====================================');
      dispatch(uiSlice.actions.openSettingWindow({isOpen: true}))
    }
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if(e.currentTarget.search.value === "") {
        setStringInNoDataInput()
        return
      }
      if(browserState.history[browserState.history.length - 1] === e.currentTarget.search.value) {  // reload
        dispatch(browserSlice.actions.reload())
        return
      }
      setInputString(e.currentTarget.search.value)
      console.log('====================================');
      console.log(inputString);
      console.log('====================================');
      e.currentTarget.search.blur()
      dispatch(browserSlice.actions.push({url: inputString}))
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value
      setInputString(val)
      console.log('====================================');
      console.log(inputString);
      console.log('====================================');
      if (val.startsWith('http')) {
        setInputIcon(
          <LanguageIcon/>
        )
      } else {
        setInputIcon(
          <SearchIcon/>
        )
      }
    }
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setStringInNoDataInput()
    }
    const onClickInput = (e: React.MouseEvent<HTMLInputElement>) => {
      (e.target as HTMLInputElement).select()
    }
    const onClickAboutButton = () => {
      dispatch(uiSlice.actions.openAboutWindow({isOpen: true}))
    }
    const onClickReloadButton = (e: React.MouseEvent<HTMLElement>) => {
      dispatch(browserSlice.actions.reload())
    }
    return (
      <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
        <IconButton className={classes.icon} onClick={onClickBeforeBtn} disabled={browserState.history.length <= 1}>
          <ArrowBackIosIcon/>
        </IconButton>
        <IconButton className={classes.icon} onClick={onClickReloadButton}>
          <ReplayIcon/>
        </IconButton>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            {inputIcon}
          </div>
          <form onSubmit={onSubmit}>
            <InputBase
            placeholder="URL or Keywords"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            name="search"
            onChange={onChange}
            onClick={onClickInput}
            onBlur={onBlur}
            inputProps={{ 'aria-label': 'search' }}
            value={inputString}
            />
          </form>
        </div>
        <IconButton className={classes.icon} onClick={onClickCatchVideoButton} disabled={dlState.catchVideos.length <= 0}>
          <CloudDownloadIcon/>
        </IconButton>
        <IconButton className={classes.icon} onClick={onClickMoreBtn}>
          <MoreVertIcon/>
        </IconButton>
        <Menu
          id="moreMenu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={onClickOtherMoreBtn}
        >
          <MenuItem onClick={()=>{onClickOtherMoreBtn(); onClickSettingBtn();}}>Settings...</MenuItem>
          <MenuItem onClick={()=>{onClickOtherMoreBtn(); onClickAboutButton();}}>About...</MenuItem>
          <MenuItem onClick={()=>{shell.openExternal(appState.reportUrl);}}>Report Bugs<OpenInNewIcon/></MenuItem>
          <MenuItem onClick={()=>{shell.openExternal(appState.requestUrl);}}>Request<OpenInNewIcon/></MenuItem>
        </Menu>
        </Toolbar>
      </AppBar>
      </div>
    )
  }
