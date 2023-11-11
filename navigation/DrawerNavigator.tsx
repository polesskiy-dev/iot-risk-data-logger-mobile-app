import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainControlsScreen from '../screens/MainControls.screen';
import { MAIN_CONTROLS_SCREEN } from './navigation.constants';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name={MAIN_CONTROLS_SCREEN}
        component={MainControlsScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;