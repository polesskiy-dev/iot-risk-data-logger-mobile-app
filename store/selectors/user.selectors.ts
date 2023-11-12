import { RootState } from '../store';

export const userSelector = (state: RootState) => state.user.user;
export const userNameSelector = (state: RootState): string =>
  state.user.user?.Username ?? '';

export const userInitialsSelector = (state: RootState): string => {
  const userName = userNameSelector(state);
  const [firstName, lastName] = userName.split('');
  const firstNameInitial = firstName.charAt(0).toUpperCase();
  const secondNameInitial = lastName.charAt(0).toUpperCase();
  return `${firstNameInitial}${secondNameInitial}`;
};

export const userEmailSelector = (state: RootState): string =>
  state.user.user?.UserAttributes?.find((attr) => attr.Name === 'email')?.Value ?? '';
