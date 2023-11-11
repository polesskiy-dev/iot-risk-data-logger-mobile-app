import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Snackbar,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { SIGN_IN_SCREEN } from '../navigation/navigation.constants';
import { clearError, signUp } from '../store/slices/auth/auth.slice';
import { AppDispatch } from '../store/store';
import {
  authErrorSelector,
  isAuthLoadingStatusSelector,
} from '../store/selectors/auth.selectors';

type Props = {
  navigation: any;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch: AppDispatch = useDispatch();
  const isLoading = useSelector(isAuthLoadingStatusSelector, shallowEqual);
  const error = useSelector(authErrorSelector, shallowEqual);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const submitSignUp = () => dispatch(signUp({ email, password }));

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
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={submitSignUp}
        style={styles.button}
        loading={isLoading}
        disabled={isLoading}>
        Sign Up
      </Button>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableRipple onPress={() => navigation.navigate(SIGN_IN_SCREEN)}>
          <Text style={styles.signInButtonText}>Sign In</Text>
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

const styles = StyleSheet.create({
  // Same styles as SignInScreen for consistency
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
  // Add the footer styles from the previous SignInScreen example
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#000',
  },
  signInButtonText: {
    fontSize: 16,
    color: '#673AB7', // TODO take from theme
    fontWeight: 'bold',
  },
  // ...any other styles you may need
});

export default SignUpScreen;
