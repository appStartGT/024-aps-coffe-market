import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Box } from '@mui/material';
import MainAppBar from '../components/MainAppBar';
import MainDrawer from '../components/MainDrawer';
import { useRoutes } from 'react-router-dom';
import { useRouter } from '@hooks';

const Main = () => {
  /* Hooks */
  const ref = useRef();
  const { subNavigation } = useRouter();
  const navigation = useRoutes(subNavigation);

  /* States */
  const [openDrawer, setOpenDrawer] = useState(true);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  // The scroll listener
  const handleScroll = useCallback((e) => {
    setIsScrollingUp(e.target.scrollTop > 0);
  }, []);

  // Attach the scroll listener to the div
  useEffect(() => {
    const div = ref.current;
    div.addEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Box display="flex">
      <MainAppBar
        sx={() => ({
          backgroundColor: {
            special: 'transparent',
            zIndex: 999,
          },
        })}
        setOpenDrawer={setOpenDrawer}
        isScrollingUp={isScrollingUp}
      />
      <MainDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <Box
        ref={ref}
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.secondary['50'],
          backgroundSize: { special: 'cover' },
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Box sx={{ marginTop: '85px' }}>
          <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
            {navigation}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
