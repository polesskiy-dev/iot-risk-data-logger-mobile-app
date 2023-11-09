import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, TouchableRipple } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { SIGN_IN_SCREEN } from '../navigation/navigation.constants';

type Props = {
  navigation: any;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSignUp = async () => {
    setLoading(true);

    // Perform validation, for example, check if passwords match
    if (password !== confirmPassword) {
      setLoading(false);
      setError('Passwords do not match.');
      return;
    }

    // Here you would normally call an API to handle sign up
    // For example purposes, I'll just set a timeout to simulate an async request
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

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
        onPress={handleSignUp}
        style={styles.button}
        loading={loading}
        disabled={loading}>
        Sign Up
      </Button>
      {/* If you want a link back to the sign-in screen */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableRipple onPress={() => navigation.navigate(SIGN_IN_SCREEN)}>
          <Text style={styles.signUpButtonText}>Sign In</Text>
        </TouchableRipple>
      </View>
      {/* Snackbar to show errors like password mismatch */}
      {/* ... */}
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
  signUpButtonText: {
    fontSize: 16,
    color: '#673AB7',
    fontWeight: 'bold',
  },
  // ...any other styles you may need
});

export default SignUpScreen;
