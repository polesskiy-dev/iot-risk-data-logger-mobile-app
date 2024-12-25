import React from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';

import { store } from './store/store';
import MainNavigation from './navigation/MainNavigation';
import { appTheme, navigationLightTheme } from './AppTheme';
import DrawerNavigator from '@/src/navigation/DrawerNavigator';

// theme={navigationLightTheme}

export default function App() {

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Provider store={store}>
        <PaperProvider theme={appTheme}>
          {/*<NavigationContainer theme={navigationLightTheme}>*/}
            <DrawerNavigator  />
          {/*</NavigationContainer>*/}
        </PaperProvider>
      </Provider>
    </>
  );
}
