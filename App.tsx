/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {useNavigationContainerRef, DefaultTheme} from '@react-navigation/native';
import remoteConfig from '@react-native-firebase/remote-config';

import {Provider as PaperProvider} from 'react-native-paper';
import {darkTheme, lightTheme} from './src/utils/styles/theme';
import {AppContext, authState} from './src/services/states';

import AnimatedBootSplash from './src/components/AnimatedBootsplash';
import Snackbar from './src/components/Snackbar';
import config from './src/utils/config';
import Navigations from './Navigations';

const App = () => {
  const value = authState();
  const theme = {
    ...DefaultTheme,
    colors: useColorScheme() === 'dark' ? darkTheme : lightTheme,
  };

  const [visible, setVisible] = useState(true);

  /**Firebase Routing Config */
  const handleRemoteConfig = () => {
    remoteConfig()
      .setDefaults(config.variables)
      .then(() => remoteConfig().fetchAndActivate())
      .then(fetchedRemotely => {
        if (fetchedRemotely) {
          console.log('Configs were retrieved from the backend and activated.');
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      })
      .catch(error => console.log(error));
  };
  /**Firebase Routing Config */

  useEffect(() => {
    /**Remote Config */
    handleRemoteConfig();
    /**Remote Config */

    // return () => {};
  }, []);

  return (
    <PaperProvider theme={theme}>
      {visible ? (
        // <AnimatedBootSplash onAnimationEnd={() => setVisible(false)} />
                  <Navigations theme={theme} initialRoute="Welcome" />

      ) : (
        <AppContext.Provider value={value}>
          <Navigations theme={theme} initialRoute="Welcome" />
        </AppContext.Provider>
      )}
      <Snackbar />
    </PaperProvider>
  );
};

export default App;
