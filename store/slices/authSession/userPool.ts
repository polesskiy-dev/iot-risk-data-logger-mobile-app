import 'react-native-get-random-values';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.EXPO_PUBLIC_USERPOOL_ID as string,
  ClientId: process.env.EXPO_PUBLIC_CLIENT_ID as string,
};

export const userPool = new CognitoUserPool(poolData);
