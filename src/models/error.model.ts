export interface ResponseError {
  message: string;
}

export interface CognitoError extends ResponseError {
  code?: string; // Error code (e.g., 'NotAuthorizedException')
  name: string;
  message: string;
}
