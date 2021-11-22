import React from 'react';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import { MyContext } from './utils/context';
import { auth } from './firebase/initFirebase';
// ----------------------------------------------------------------------

export default function App() {
  const [classSelected, setClassSelected] = React.useState();
  const [user, setUser] = React.useState();
  const [dbUser, setdbUser] = React.useState();
  return (
    <MyContext.Provider value={{ classSelected, setClassSelected, user, setUser }}>
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </ThemeConfig>
    </MyContext.Provider>
  );
}
