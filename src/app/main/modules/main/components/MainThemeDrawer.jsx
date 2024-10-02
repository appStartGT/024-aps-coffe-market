import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Drawer, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Box } from '@mui/system';
import { useAuth, useLocalStorage } from '@hooks';
import { setTheme } from './../../../../store/theme';
import { setUserThemeAction } from '../../../../store/modules/user';

// Definimos los colores que se mostrarán en el listado
const COLORS = [
  { name: 'Orange', color: '#FA896B', ID: 'Orange' },
  { name: 'Purple', color: '#763FBD', ID: 'Purple' },
  { name: 'Blue', color: '#5D87FF', ID: 'Blue' },
  { name: 'Pink', color: '#FC4B6B', ID: 'Pink' },
  { name: 'Default', color: '#ECEDEF', ID: 'defaultPalette' },
];

const MainThemeDrawer = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const localStorage = useLocalStorage();
  const auth = useAuth();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '256px',
            padding: '24px',
          },
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          color="primary"
          style={{
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          Theme colors
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            justifyItems: 'center',
            gap: '20px',
          }}
        >
          {COLORS.map((color) => (
            <div
              key={color.color}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Box
                onClick={() => {
                  dispatch(setTheme(color.ID));
                  setSelectedColor(color.color);
                  localStorage.setItem('theme', color.ID);
                  dispatch(
                    setUserThemeAction({
                      id_user: auth.user?.id_user,
                      theme: color.ID,
                    })
                  );
                }} // set theme
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '92px',
                  height: '64px',
                  border: '1px solid rgba(145, 158, 171, 0.20)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color.color,
                  }}
                >
                  <CheckIcon
                    sx={{
                      color:
                        selectedColor == color.color ? '#ffffff' : color.color,
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="caption" color="primary">
                {color.name}
              </Typography>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default MainThemeDrawer;
