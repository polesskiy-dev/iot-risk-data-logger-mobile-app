import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  navigation: any;
};

const DeviceSettingsScreen: React.FC<Props> = ({ navigation }) => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {},
});
export default DeviceSettingsScreen;
