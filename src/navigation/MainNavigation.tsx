import React from 'react';
import { useSelector } from 'react-redux';

import DrawerNavigator from './DrawerNavigator';
import AuthNavigator from './AuthNavigator';
import { isAuthenticatedSelector } from '../store/selectors/auth.selectors';

const MainNavigation = () => {
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  // return isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />;
  return <DrawerNavigator />;
};

export default MainNavigation;
