import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  RootStackParamList,
  ScreensNames,
} from '../navigation/navigation.constants';

type Props = {
  navigation: StackNavigationProp<
    RootStackParamList,
    ScreensNames.DEVICE_SETTINGS_SCREEN
  >;
};

const DeviceSettingsScreen: React.FC<Props> = ({ navigation }) => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {},
});
export default DeviceSettingsScreen;
