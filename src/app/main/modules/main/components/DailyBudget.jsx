import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { AccountBalanceWallet as AccountBalanceWalletIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import BudgetContent from './BudgetContent';

const DailyBudget = () => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Presupuesto',
        description: 'Administrar Presupuesto',
        content: <BudgetContent />,
        closeBtn: true,
      })
    );
  };

  return (
    <Tooltip title="Presupuesto">
      <IconButton
        color="primary"
        sx={{
          minHeight: '48px',
          minWidth: '48px',
          margin: '8px',
        }}
        onClick={handleOpenModal}
      >
        <AccountBalanceWalletIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DailyBudget;
