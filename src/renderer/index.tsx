import React from "react";
import { render } from "react-dom";
import MainScreen from "./components/MainScreen"
import { Provider } from "react-redux";
import store from "../store"
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import setContextMenu from "./util/context"

import "../styles/main.scss";
import DLManager from "../DL";

const palette = { primary: { main: '#000000' } };

const adTheme = createMuiTheme({ palette });

global.dlManager = new DLManager(store)

setContextMenu(document.body)

function App() {
  return (
    <ThemeProvider theme={adTheme}>
      <Provider store={store}>
        <MainScreen />
      </Provider>
    </ThemeProvider>
  )
}

render(
  <App />,
  document.getElementById("app"),
);
