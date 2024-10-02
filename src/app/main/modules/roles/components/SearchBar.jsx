import Paper from '@mui/material/Paper';
import _SearchBar from '@components/SearchBar';

const SearchBar = ({
  label,
  searchList = [],
  searchKey = '',
  searchResults = null,
  resetText = false,
  handleIsReseted,
  rightButton,
}) => {
  return (
    <_SearchBar
      label={label}
      color={'primary'}
      type={'text'}
      searchList={searchList}
      searchKey={searchKey}
      searchResults={searchResults}
      resetText={resetText}
      handleIsReseted={handleIsReseted}
      rightButton={rightButton}
      wrapperProps={{
        component: Paper,
        elevation: 0,
        borderRadius: '12px',
      }}
      outlinedInputStyles={{
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      }}
    />
  );
};

export default SearchBar;
