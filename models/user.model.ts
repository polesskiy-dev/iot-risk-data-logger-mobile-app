interface IUserSignIn {
  email: string;
  password: string;
}

interface IUserSignUp extends IUserSignIn {
  fullName: string;
}
