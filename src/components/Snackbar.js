// $common/Snackbar.tsx
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import { Snackbar as PaperSnackbar } from 'react-native-paper';

import SnackbarManager from '../utils/SnackbarManager';
import { darkTheme, lightTheme } from '../utils/styles/theme';

const Snackbar = () => {
  const theme = {
    ...DefaultTheme,
    colors: useColorScheme() === 'dark' ? darkTheme : lightTheme,
  };
  const [state, setState] = useState({ visible: false, title: null });

  useEffect(() => {
    SnackbarManager.setListener((title) => setState({ visible: true, title: title }));
    return () => SnackbarManager.setListener(null);
  }, []);

  return (
    <PaperSnackbar
      style={{borderRadius: 30, backgroundColor: theme.colors.onSurface, color: theme.colors.surface, width: '80%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', textAlign: 'center'}}
      visible={state.visible}
      duration={1000}
      onDismiss={() => setState({ ...state, visible: false, title: null })}>
      {state.title}
    </PaperSnackbar>
  );
};

export default Snackbar;