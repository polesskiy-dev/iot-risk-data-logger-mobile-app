import React from 'react';
import { useSelector } from 'react-redux';

import DrawerNavigator from '../navigation/DrawerNavigator';
import AuthNavigator from '../navigation/AuthNavigator';
import { isAuthenticatedSelector } from '../store/selectors/auth.selectors';

const Main = () => {
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  return isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />;
};

export default Main;
