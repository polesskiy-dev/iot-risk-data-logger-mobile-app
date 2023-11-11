export interface CognitoError {
  code?: string; // Error code (e.g., 'NotAuthorizedException')
  name: string;
  message: string;
}
