export const VALIDATIONS = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
  username:
    /^(?!.*[._]{2})[a-zA-Z0-9](?!.*[._]{2})[a-zA-Z0-9._]{1,28}[a-zA-Z0-9]$/,
};
