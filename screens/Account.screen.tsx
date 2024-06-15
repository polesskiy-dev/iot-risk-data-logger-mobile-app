import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  RootStackParamList,
  ScreensNames,
} from '../navigation/navigation.constants';

type Props = {
  navigation: StackNavigationProp<
    RootStackParamList,
    ScreensNames.ACCOUNT_SCREEN
  >;
};

const AccountScreen: React.FC<Props> = ({ navigation }) => {
  return <SafeAreaView style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {},
});
export default AccountScreen;
