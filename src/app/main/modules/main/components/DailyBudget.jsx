import React from 'react';
import { IconButton, Tooltip, Typography, Chip, Box } from '@mui/material';
import { AccountBalanceWallet as AccountBalanceWalletIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import BudgetContent from './BudgetContent';
import { useSelector } from 'react-redux';
import { formatFirebaseTimestamp } from '@utils/dates';

const DailyBudget = () => {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budget.budget);

  const handleOpenModal = () => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Presupuesto',

        content: (
          <>
            <Box
              width={'100%'}
              display={'flex'}
              alignItems="center"
              gap={1}
              justifyContent={'space-between'}
              mb={2}
              paddingLeft={2}
              paddingRight={2}
            >
              <Typography>
                Administrar Presupuesto
                {formatFirebaseTimestamp(budget?.createdAt)}
              </Typography>
              {budget?.isClosed ? (
                <Chip label="Cerrado" color="error" size="small" />
              ) : (
                <Chip label="Abierto" color="success" size="small" />
              )}
            </Box>
            <BudgetContent />
          </>
        ),
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
