import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ScreensNames } from './navigation.constants';
import SignInScreen from '../screens/SignIn.screen';
import SignUpScreen from '../screens/SignUp.screen';

const AuthStack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name={ScreensNames.SIGN_IN_SCREEN}
        component={SignInScreen}
      />
      <AuthStack.Screen
        name={ScreensNames.SIGN_UP_SCREEN}
        component={SignUpScreen}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
