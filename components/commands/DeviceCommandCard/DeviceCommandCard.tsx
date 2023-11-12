import React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { StyleSheet, Text, Vibration, View } from 'react-native';

import { AppTheme, useAppTheme } from '../../../AppTheme';

type DeviceCommandCardProps = {
  title: string;
  description: string;
  iconName: string;
  onPress: () => void;
};

const DeviceCommandCard: React.FC<DeviceCommandCardProps> = ({
  title,
  iconName,
  onPress,
  description,
}) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const handlePress = () => {
    Vibration.vibrate();
    return onPress();
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <Avatar.Icon icon={iconName} size={48} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </Card>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      width: '90%',
      marginVertical: 8,
      padding: 16,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      color: theme.colors.primary,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.fonts.titleMedium.fontSize,
      fontWeight: theme.fonts.titleMedium.fontWeight,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: theme.colors.secondary,
    },
  });

export default DeviceCommandCard;
