import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Button } from 'react-native-paper';

import { useAppDispatch } from '../../hooks';
import { signOut } from '../../store/slices/auth/auth.slice';

const MenuDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.signOutContainer}>
        <Button mode="outlined" onPress={handleSignOut}>
          Sign Out
        </Button>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  signOutContainer: {
    margin: 10,
  },
});

export default MenuDrawerContent;
