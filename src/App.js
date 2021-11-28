import React from 'react';
import _ from 'lodash';
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
  const [options, setOptions] = React.useState([]);
  const classSelectedCallback = React.useCallback((classID) => {
    setClassSelected(classID);
  }, []);
  const callbackSetOptions = React.useCallback((newOptions) => {
    console.log('before', newOptions);
    setOptions((prevOptions) => [...new Set([...newOptions, ...prevOptions])]);
  }, []);
  console.log('after', options);
  return (
    <MyContext.Provider
      value={{ classSelected, classSelectedCallback, options, callbackSetOptions }}
    >
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </ThemeConfig>
    </MyContext.Provider>
  );
}
