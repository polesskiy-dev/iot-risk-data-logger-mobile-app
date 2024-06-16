import 'react-native-get-random-values';
import { CognitoUserPool, ICognitoUserData } from 'amazon-cognito-identity-js';

/** @note: all FE code are public, EAS Build will inline the env variables */
const poolData = {
  UserPoolId: process.env.EXPO_PUBLIC_USERPOOL_ID as string,
  ClientId: process.env.EXPO_PUBLIC_CLIENT_ID as string,
};

export const userPool = new CognitoUserPool(poolData);

export const getUserDataByUsername = (username: string): ICognitoUserData => ({
  Username: username,
  Pool: userPool,
});
