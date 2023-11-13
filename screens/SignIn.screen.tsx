import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Snackbar,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import { shallowEqual } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  RootStackParamList,
  ScreensNames,
} from '../navigation/navigation.constants';
import { clearError, signIn } from '../store/slices/auth/auth.slice';
import {
  authErrorSelector,
  isAuthLoadingStatusSelector,
} from '../store/selectors/auth.selectors';
import { useAppDispatch, useAppSelector } from '../hooks';
import { AppTheme, useAppTheme } from '../AppTheme';

type SignInScreenProps = {
  navigation: StackNavigationProp<
    RootStackParamList,
    ScreensNames.SIGN_IN_SCREEN
  >;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const isLoading = useAppSelector(isAuthLoadingStatusSelector, shallowEqual);
  const error = useAppSelector(authErrorSelector, shallowEqual);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submitSignIn = () => dispatch(signIn({ email, password }));

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={submitSignIn}
        style={styles.button}
        disabled={isLoading}
        loading={isLoading}>
        Sign In
      </Button>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableRipple
          onPress={() => navigation.navigate(ScreensNames.SIGN_UP_SCREEN)}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableRipple>
      </View>
      <Snackbar
        visible={!!error}
        onDismiss={() => dispatch(clearError())}
        action={{
          label: 'Close',
          onPress: () => {
            dispatch(clearError());
          },
        }}>
        {error}
      </Snackbar>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    input: {
      marginBottom: 10,
    },
    button: {
      marginTop: 10,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    footerText: {
      fontSize: 16,
      color: '#000', // or any color that suits your design
    },
    signUpButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
  });

export default SignInScreen;
