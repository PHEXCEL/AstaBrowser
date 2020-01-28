import React from "react"
import TopBar from "./TopBar"
import DLWindow from "./DLWindow"
import SettingWindow from "./SettingWindow"
import AboutWindow from "./AboutWindow"
import CatchWindow from "./CatchWindow"
import SnackBars from "./SnackBars"
import Browser from "./Browser"
import Box from "@material-ui/core/Box"
import ResolutionsWindow from "./Resolutions"
import DLErrorWindow from "./DLErrorWindow"

export default function MainScreen(): JSX.Element {
  return (
    <div>
      <Box display='flex' flex='1'>
        <TopBar />
      </Box>
      <Box height={`calc(100% - 64px)`}>
        <Browser/>
      </Box>
      <DLWindow/>
      <SettingWindow/>
      <AboutWindow/>
      <CatchWindow/>
      <SnackBars/>
      <ResolutionsWindow/>
      <DLErrorWindow/>
    </div>
  )
}
