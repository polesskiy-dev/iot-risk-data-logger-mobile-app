import { RootState } from '../store';

const GUEST_MODE_USER_NAME = 'Guest User';

export const userSelector = (state: RootState) => state.user.user;
export const userNameSelector = (state: RootState): string =>
  state.user.user?.UserAttributes?.find(attr => attr.Name === 'custom:FullName')
    ?.Value ?? GUEST_MODE_USER_NAME;

export const userInitialsSelector = (state: RootState): string => {
  const userName = userNameSelector(state);
  const [firstName, lastName] = userName.split(' ');
  const firstNameInitial = firstName.charAt(0).toUpperCase();
  const secondNameInitial = lastName.charAt(0).toUpperCase();
  return `${firstNameInitial}${secondNameInitial}`;
};

export const userEmailSelector = (state: RootState): string =>
  state.user.user?.UserAttributes?.find(attr => attr.Name === 'email')?.Value ??
  '';
