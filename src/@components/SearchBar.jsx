import React, { useEffect, useState } from 'react';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Fab,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
  Box,
} from '@mui/material';
// import Can from './permissions/Can';
import SkeletonSerchBar from './generalContainer/SkeletonSerchBar';

const SearchBar = ({
  searchList = [],
  searchKey,
  searchResults,
  resetText,
  skeleton = false,
  rightButton,
  dropdown,
  field,
  label,
  color,
  type = 'text',
  outlinedInputStyles,
  wrapperProps,
  ...props
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (resetText) setText('');
  }, [resetText]);

  useEffect(() => {
    if (text) handleOnChange(text);
  }, [searchList, text]);

  const handleOnChange = (enteredText) => {
    setText(enteredText);
    props.onChange && props.onChange(enteredText);
    /* Set search results */
    if (!enteredText);
    if (!enteredText && searchList.length) searchResults(searchList);
    if (searchList.length && searchKey && enteredText) {
      const keys = searchKey.split(',');
      const result = searchList.filter((element) => {
        return keys.some((key) => {
          const keyValue = element[key];
          // Check if the value of element[key] is a string
          if (typeof keyValue === 'string') {
            return keyValue.toLowerCase().includes(enteredText.toLowerCase());
          }
        });
      });

      searchResults(result);
    }
  };

  return skeleton ? (
    <SkeletonSerchBar />
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        marginBottom: '16px',
        alignItems: 'center',
        height: '100%',
        ...props.sx,
      }}
    >
      {dropdown && (
        <Box sx={{ flex: '0 0 auto', width: '200px' }}>
          <TextField
            select
            label={dropdown.label}
            helperText={dropdown.helperText}
            defaultValue={''}
            onChange={dropdown.onChange}
            value={dropdown.value}
            {...dropdown.dropdownProps}
            sx={{ width: '100%', ...dropdown.styles }}
          >
            {dropdown.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
      {field && (
        <Box sx={{ flex: '0 0 auto', width: '200px' }}>
          <TextField
            id="outlined-field"
            label={field.label}
            helperText={field.helperText}
            onChange={field.onChange}
            value={field.value}
            {...field.fieldProps}
            sx={{ width: '100%', ...field.styles }}
          >
            {props?.dropdown?.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      <Box
        sx={{
          flex: '1',
          height: '56px', // Match the height of the dropdown
        }}
        {...wrapperProps}
      >
        <FormControl
          variant="outlined"
          color="primary"
          sx={{ width: '100%', height: '100%', ...outlinedInputStyles }}
        >
          <InputLabel sx={{ fontSize: '12px' }}>{label}</InputLabel>
          <OutlinedInput
            sx={{
              borderRadius: '8px',
              height: '100%',
              '& .MuiOutlinedInput-input': {
                padding: '16.5px 14px',
                height: '100%',
              },
            }}
            type={type}
            value={text}
            onChange={(e) => handleOnChange(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                {text.length ? (
                  <IconButton onClick={() => handleOnChange('')}>
                    <CloseIcon color="icon.main" />
                  </IconButton>
                ) : (
                  <SearchIcon color="icon.main" />
                )}
              </InputAdornment>
            }
            label={label}
            color={color}
          />
        </FormControl>
      </Box>

      {rightButton && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/*  <Can {...rightButton.can}> */}
          <Fab
            onClick={rightButton.onClick}
            size="small"
            color={rightButton.color}
            sx={{ ...rightButton.styles }}
            disabled={rightButton.disabled}
          >
            <AddIcon />
          </Fab>
          {/*   </Can> */}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(SearchBar);
