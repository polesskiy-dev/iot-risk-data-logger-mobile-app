import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ScreensNames } from '../navigation/navigation.constants';
import { useSelector } from 'react-redux';
import { deviceInfoSelector } from '../store/selectors/deviceInfo.selectors';
//
// type RootStackParamList = {
//   DeviceInfo: { tag: TagEvent };
// };

// type DeviceInfoScreenRouteProp = RouteProp<RootStackParamList, 'DeviceInfo'>;

const DeviceInfoScreen = () => {
  // const route = useRoute<DeviceInfoScreenRouteProp>();
  // const { tag } = route.params;
  const navigation = useNavigation();

  const deviceInfo = useSelector(deviceInfoSelector);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Title>Device Information</Title>
        {deviceInfo?.tag ? (
          <>
            <Paragraph>UID: {deviceInfo.tag.id}</Paragraph>
          </>
        ) : (
          <Paragraph>No tag information available</Paragraph>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
});

export default DeviceInfoScreen;
