import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, Avatar, Divider } from 'react-native-paper';

import {
  userEmailSelector,
  userInitialsSelector,
  userNameSelector,
} from '../../../../store/selectors/user.selectors';
import { useAppSelector } from '../../../../hooks';
import UserAvatar from './UserAvatar';

const DrawerUserProfileHeader: React.FC = props => {
  const userName = useAppSelector(userNameSelector);
  const userEmail = useAppSelector(userEmailSelector);
  const navigateToUserProfile = () => {};

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={navigateToUserProfile}
        style={styles.userProfile}>
        <View style={styles.userPreview}>
          <UserAvatar />
        </View>
        <Text style={styles.name} numberOfLines={1} variant="headlineSmall">
          {userName}
        </Text>
        <Text style={styles.name} numberOfLines={1}>
          {userEmail}
        </Text>
      </TouchableOpacity>
      <Divider style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginRight: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
  userPreview: {
    marginBottom: 16
  },
  name: {},
  userProfile: {},
  divider: { marginTop: 16 },
});

export default DrawerUserProfileHeader;
