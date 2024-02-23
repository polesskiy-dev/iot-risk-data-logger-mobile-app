import React from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { StatusBar, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

import { store } from './store/store';
import MainNavigation from './navigation/MainNavigation';
import { appTheme, navigationLightTheme } from './AppTheme';

// Pre-step, call this before any NFC operations
NfcManager.start();

export default function App() {
  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Provider store={store}>
        <PaperProvider theme={appTheme}>
          <NavigationContainer theme={navigationLightTheme}>
            <MainNavigation />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
      <TouchableOpacity onPress={readNdef}>
        <Text>Scan a Tag</Text>
      </TouchableOpacity>
    </>
  );
}
