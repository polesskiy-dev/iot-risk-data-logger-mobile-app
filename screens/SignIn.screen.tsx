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

import { SIGN_UP_SCREEN } from '../navigation/navigation.constants';
import { clearError, signIn } from '../store/slices/authSession/auth.slice';
import {
  authErrorSelector,
  isAuthLoadingStatusSelector,
} from '../store/selectors/auth.selectors';
import {AppDispatch} from "../store/store";

// type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

type Props = {
  navigation: any; // SignInScreenNavigationProp
};

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch: AppDispatch = useDispatch();
  const isLoading = useSelector(isAuthLoadingStatusSelector, shallowEqual);
  const error = useSelector(authErrorSelector, shallowEqual);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submitSignIn = () => dispatch(signIn({ email, password }));

  return (
    <View style={styles.container}>
      {/*{loading && <ActivityIndicator size="large" />}*/}
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
        <TouchableRipple onPress={() => navigation.navigate(SIGN_UP_SCREEN)}>
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

const styles = StyleSheet.create({
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
    color: '#673AB7',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
