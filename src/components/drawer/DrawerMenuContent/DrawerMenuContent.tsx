import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Button, Divider, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppDispatch } from '../../../hooks';
import { signOut } from '../../../store/slices/auth/auth.slice';
import DrawerUserProfileHeader from './DrawerUserProfileHeader/DrawerUserProfileHeader';
import { AppTheme, useAppTheme } from '../../../AppTheme';

const DrawerMenuContent: React.FC<DrawerContentComponentProps> = props => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <DrawerUserProfileHeader />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Divider />
      <DrawerItem
        label="Sign Out"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="logout" color={color} size={size} />
        )}
        onPress={handleSignOut}
      />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
  });

export default DrawerMenuContent;
