import React from "react";
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from "@react-navigation/native";

import AuthNavigator from "./navigation/AuthNavigator";

export default function App() {
    return (
        // TODO place <StoreProvider store={store}> here (above <PaperProvider>)
        <NavigationContainer>
            <PaperProvider>
                <AuthNavigator/>
                {/*{isSignedIn ? <DrawerNavigator /> : <AuthNavigator />}*/}
            </PaperProvider>
        </NavigationContainer>
    );
};
