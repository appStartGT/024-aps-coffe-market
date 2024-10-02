import { AbilityContext } from '../../app/context/AbilityContext';
import { createContextualCan, useAbility } from '@casl/react';

/* 
 Crear consumidor del contexto ability,
 utilizado para envolver los componentes que requieran 
 proteccion por medio de permsisos
*/
const Can = createContextualCan(AbilityContext.Consumer);
export const Ability = () => useAbility(AbilityContext);

export default Can;
