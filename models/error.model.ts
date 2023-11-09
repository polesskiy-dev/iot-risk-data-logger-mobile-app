export interface CognitoError extends Error {
  code?: string; // Error code (e.g., 'NotAuthorizedException')
  name: string;
  message: string;
}
