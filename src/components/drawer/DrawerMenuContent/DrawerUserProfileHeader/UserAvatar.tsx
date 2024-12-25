import React from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-paper';

import { useAppSelector } from '@/src/hooks';
import { userInitialsSelector } from '@/src/store/selectors/user.selectors';

const UserAvatar = () => {
  const userInitials = useAppSelector(userInitialsSelector);

  // TODO - add user Avatar in case of existence

  return (
    <View>
      <Avatar.Text size={48} label={userInitials} />
    </View>
  );
};

export default UserAvatar;
