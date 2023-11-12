import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppTheme, useAppTheme } from '../AppTheme';
import DeviceCommandCard from '../components/commands/DeviceCommandCard/DeviceCommandCard';

type Props = {
  navigation: any;
};

const DeviceCommandsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const handleCommand = (command: string) => {
    console.log(`Executing command: ${command}`);
    // Add logic to execute the command
  };

  return (
    <View style={styles.container}>
      <DeviceCommandCard
        title="Start Logging"
        iconName="play"
        onPress={() => handleCommand('startLogging')}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      />
      <DeviceCommandCard
        title="Stop Logging"
        iconName="stop"
        onPress={() => handleCommand('stopLogging')}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      />
      <DeviceCommandCard
        title="Pull Log"
        iconName="cloud-upload"
        onPress={() => handleCommand('pullLog')}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      />
      <DeviceCommandCard
        title="Apply Logging Settings"
        iconName="content-save-cog"
        onPress={() => handleCommand('pullLog')}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      />
      {/* Repeat for other commands */}
    </View>
    // <View style={styles.container}>
    //   <Button
    //     mode="elevated"
    //     icon={() => (
    //       <MaterialCommunityIcons name="play" size={24} style={styles.icon} />
    //     )}
    //     style={styles.button}
    //     onPress={handleStartLogging}>
    //     Start Logging
    //   </Button>
    //
    //   <Button
    //     mode="elevated"
    //     icon={() => (
    //       <MaterialCommunityIcons name="stop" size={24} style={styles.icon} />
    //     )}
    //     style={styles.button}
    //     onPress={handleStopLogging}>
    //     Stop Logging
    //   </Button>
    //
    //   <Button
    //     mode="elevated"
    //     icon={() => (
    //       <MaterialCommunityIcons
    //         name="download"
    //         size={24}
    //         style={styles.icon}
    //       />
    //     )}
    //     style={styles.button}
    //     onPress={handlePullLog}>
    //     Pull Log
    //   </Button>
    //
    //   <Button
    //     mode="elevated"
    //     icon={() => (
    //       <MaterialCommunityIcons
    //         name="content-save-cog"
    //         size={24}
    //         style={styles.icon}
    //       />
    //     )}
    //     style={styles.button}
    //     onPress={handleApplySettings}>
    //     Apply Logging Settings
    //   </Button>
    // </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
    },
  });
export default DeviceCommandsScreen;
