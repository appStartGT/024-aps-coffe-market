import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { AccountBalanceWallet as AccountBalanceWalletIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import { getBudgetAction } from '../../../../store/modules/budget';
import BudgetContent from './BudgetContent';
import { useSelector } from 'react-redux';
import { formatFirebaseTimestamp } from '@utils/dates';

const DailyBudget = () => {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budget.budget);

  const handleOpenModal = () => {
    dispatch(getBudgetAction()); // get updated budget each time the modal is opened
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Presupuesto',
        description: `Administrar Presupuesto ${formatFirebaseTimestamp(
          budget?.createdAt
        )}`,
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
