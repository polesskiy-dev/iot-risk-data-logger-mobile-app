import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
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
      <Divider style={styles.divider} />
      <View style={styles.footer}>
        <Button
          mode="text"
          onPress={handleSignOut}
          icon={() => (
            <MaterialCommunityIcons
              name="logout"
              size={24}
              style={styles.footer.icons}
            />
          )}
          labelStyle={styles.footer.buttonsText}
        >
          Sign Out
        </Button>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 8,
      marginLeft: 8,
      icons: {
        marginRight: 20,
        color: theme.colors.secondary
      },
      buttonsText: {
        color: theme.colors.secondary
      }
    },
    divider: {
      marginTop: 8,
      marginBottom: 8,
    },
  });

export default DrawerMenuContent;
