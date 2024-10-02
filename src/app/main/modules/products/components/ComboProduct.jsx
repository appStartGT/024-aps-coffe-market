import SearchBar from '@components/SearchBar';
import { Box } from '@mui/material';

const ComboProduct = () => {
  const propsSearchBarButton = {
    label: 'Buscar productos',
    type: 'text',
    onChange: (value) => console.log(value),
  };

  return (
    <Box maxHeight={'100vh'} height={'100%'} width={'100%'}>
      <SearchBar {...propsSearchBarButton} /* skeleton */ />
    </Box>
  );
};

export default ComboProduct;
