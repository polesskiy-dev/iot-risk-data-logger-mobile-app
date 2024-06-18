import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Stagger } from '@animatereactnative/stagger';
import { StackNavigationProp } from '@react-navigation/stack';

import { AppTheme, useAppTheme } from '../../AppTheme';
import DeviceCommandCard from '../../components/commands/DeviceCommandCard/DeviceCommandCard';
import {
  RootStackParamList,
  ScreensNames,
} from '../../navigation/navigation.constants';
import { useAppDispatch } from '../../hooks';
import { nfcReadDeviceInfo } from '../../store/slices/deviceInfo/deviceInfo.thunks';
import nfcService from '../../services/nfc/nfc.service';

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

  const dispatch = useAppDispatch();

  const handleCommand = (command: string) => {
    console.log(`Executing command: ${command}`);
    // TODO Add logic to execute the command
  };

  // TODO navigation.navigate(ScreensNames.DEVICE_INFO_SCREEN)

  return (
    <SafeAreaView style={styles.container}>
      {isFocused && (
        <Stagger
          stagger={50}
          duration={300}
          exitDirection={-1}
          style={{ ...styles.cardContainer }}>
          <DeviceCommandCard
            title="Start Logging"
            iconName="play"
            // onPress={() => handleCommand('startLogging')}
            onPress={async () => await nfcService.testCmd()}
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
          ,
          <DeviceCommandCard
            title="Read Device Info"
            iconName="information"
            onPress={() => dispatch(nfcReadDeviceInfo(navigation))}
            description="Fetch device information: serial number, model, chips info etc."
          />
        </Stagger>
      )}
    </SafeAreaView>
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
