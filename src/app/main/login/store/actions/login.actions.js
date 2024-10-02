export const ACTIONS = {
  SING_IN: '[LOGIN] SING_IN',
};

export const singIn = (isLoggin = false, setValue) => {
  setValue(isLoggin);
  return {
    type: ACTIONS.SING_IN,
    payload: { isLoggin },
  };
};
