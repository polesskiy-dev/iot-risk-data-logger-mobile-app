import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home.screen';
import {
  ACCOUNT_SCREEN,
  DEVICE_SETTINGS_SCREEN,
  COMMANDS_HISTORY_SCREEN,
  DEVICE_COMMANDS_SCREEN, REVIEW_LOG_SCREEN
} from "./navigation.constants";
import DrawerMenuContent from '../components/drawer/DrawerMenuContent/DrawerMenuContent';
import AccountScreen from '../screens/Account.screen';
import DeviceSettingsScreen from '../screens/DeviceSettings.screen';
import HistoryScreen from '../screens/History.screen';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerMenuContent {...props} />}>
      <Drawer.Screen
        name={DEVICE_COMMANDS_SCREEN}
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="nfc" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={REVIEW_LOG_SCREEN}
        component={HistoryScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="math-log" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen // TODO disable on untrusted user
        name={DEVICE_SETTINGS_SCREEN}
        component={DeviceSettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={COMMANDS_HISTORY_SCREEN}
        component={HistoryScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={ACCOUNT_SCREEN}
        component={AccountScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
