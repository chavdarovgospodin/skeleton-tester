export const getProfileId = () => localStorage.getItem('profile_id');
export const deleteProfileId = () => localStorage.removeItem('profile_id');
export const setProfileId = (profileId: string) =>
  localStorage.setItem('profile_id', profileId);
export const setProfileBalance = (balance: string) =>
  localStorage.setItem('profile_balance', balance);
export const getProfileBalance = () => localStorage.getItem('profile_balance');
export const deleteProfileBalance = () =>
  localStorage.removeItem('profile_balance');
