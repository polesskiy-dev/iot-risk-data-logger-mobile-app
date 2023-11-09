import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SIGN_IN_SCREEN, SIGN_UP_SCREEN } from './navigation.constants';
import SignInScreen from '../screens/SignIn.screen';
import SignUpScreen from '../screens/SignUp.screen';

const AuthStack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name={SIGN_IN_SCREEN} component={SignInScreen} />
      <AuthStack.Screen name={SIGN_UP_SCREEN} component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
