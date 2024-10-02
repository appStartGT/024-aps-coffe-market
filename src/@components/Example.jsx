import React, { useEffect, useContext } from 'react';
import { AbilityContext } from '../app/context/AbilityContext';
import { Button } from '@mui/material';
import Can from '@components/permissions/Can';

const Example = ({ ...props }) => {
  /* Hooks */
  //contexto ability objeto al cual se le sobreescriviran los permisos
  const ability = useContext(AbilityContext);

  useEffect(() => {
    console.log('cargando');
    updateAbility(ability, 'admin');
  }, [ability]);

  function updateAbility(ability /* user */) {
    /* Actualizacion de las habilidades */
    ability.update([
      {
        action: ['Read', 'Delete', 'Create'],
        subject: 'Ventas',
      },
    ]);
  }

  return (
    /* Puedo: read(leer) a(un) Example */
    <Can I="Read" this="Ventas">
      <div className="App">
        <header className="App-header">
          <Can I={props.I} this={props.this}>
            <Button {...props.button} color="primary" variant="outlined">
              {props.button?.name}
            </Button>
          </Can>
        </header>
      </div>
    </Can>
  );
};

export default Example;
