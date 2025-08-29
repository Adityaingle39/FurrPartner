/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {
  useNavigationContainerRef,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import remoteConfig from '@react-native-firebase/remote-config';

import {
  Provider as PaperProvider,
  MD3LightTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {darkTheme, lightTheme} from './src/utils/styles/theme';
import {AppProvider} from './src/services/states';

import AnimatedBootSplash from './src/components/AnimatedBootsplash';
import Snackbar from './src/components/Snackbar';
import config from './src/utils/config';
import Navigations from './Navigations';

const App = () => {
  const colorScheme = useColorScheme();
  const [visible, setVisible] = useState(true);

  const customColors = colorScheme === 'dark' ? darkTheme : lightTheme;

  const paperTheme = {
    ...PaperDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      ...customColors,
    },
  };

  const navigationTheme = {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...customColors,
    },
  };

  /**Firebase Routing Config */
  const handleRemoteConfig = () => {
    remoteConfig()
      .setDefaults(config.variables as any)
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
    handleRemoteConfig();
  }, []);

  return (
    <AppProvider>
      <PaperProvider theme={paperTheme}>
        {visible ? (
          // <AnimatedBootSplash onAnimationEnd={() => setVisible(false)} />
          <Navigations theme={navigationTheme} initialRoute="Welcome" />
        ) : (
          <Navigations theme={navigationTheme} initialRoute="Welcome" />
        )}
        <Snackbar />
      </PaperProvider>
    </AppProvider>
  );
};

export default App;
