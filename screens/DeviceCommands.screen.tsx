import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Stagger } from '@animatereactnative/stagger';
import { StackNavigationProp } from '@react-navigation/stack';

import { AppTheme, useAppTheme } from '../AppTheme';
import DeviceCommandCard from '../components/commands/DeviceCommandCard/DeviceCommandCard';
import {
  RootStackParamList,
  ScreensNames,
} from '../navigation/navigation.constants';

type Props = {
  navigation: StackNavigationProp<
    RootStackParamList,
    ScreensNames.DEVICE_COMMANDS_SCREEN
  >;
};

const DeviceCommandsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const isFocused = useIsFocused();
  const handleCommand = (command: string) => {
    console.log(`Executing command: ${command}`);
    // TODO Add logic to execute the command
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <Stagger
          stagger={50}
          duration={300}
          exitDirection={-1}
          // entering={() => ZoomInEasyDown.springify()}
          // exiting={() => FadeOutDown.springify()}
          style={{ ...styles.cardContainer }}>
          <DeviceCommandCard
            title="Start Logging"
            iconName="play"
            onPress={() => handleCommand('startLogging')}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          />
          ,
          <DeviceCommandCard
            title="Stop Logging"
            iconName="stop"
            onPress={() => handleCommand('stopLogging')}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          />
          ,
          <DeviceCommandCard
            title="Pull Log"
            iconName="cloud-upload"
            onPress={() => handleCommand('pullLog')}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          />
          ,
          <DeviceCommandCard
            title="Apply Logging Settings"
            iconName="content-save-cog"
            onPress={() => handleCommand('pullLog')}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          />
        </Stagger>
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    cardContainer: {
      flexDirection: 'column',
      gap: 8,
    },
  });
export default DeviceCommandsScreen;
