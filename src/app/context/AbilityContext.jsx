import { createContext } from 'react';
import { createMongoAbility } from '@casl/ability';

const ability = new createMongoAbility([]);

/* Create new context */
export const AbilityContext = createContext();

/* Create provider for application*/
export const AbilityProvider = ({ children }) => {
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};
