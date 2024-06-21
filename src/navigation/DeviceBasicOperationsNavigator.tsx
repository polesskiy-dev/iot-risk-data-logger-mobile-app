import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ScreensNames } from './navigation.constants';
import DeviceCommandsScreen from '../screens/DeviceBasicOperations/DeviceCommands.screen';
import DeviceInfoScreen from '../screens/DeviceInfo.screen';

const Stack = createStackNavigator();

const DeviceBasicOperationsNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreensNames.DEVICE_COMMANDS_SCREEN}
        component={DeviceCommandsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreensNames.DEVICE_INFO_SCREEN}
        component={DeviceInfoScreen}
        options={{ title: 'Device Info' }}
      />
    </Stack.Navigator>
  );
};

export default DeviceBasicOperationsNavigator;
