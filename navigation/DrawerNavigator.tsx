import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator>
      {/*<Drawer.Screen name="Home" component={HomeScreen} />*/}
      {/* ... other screens */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
