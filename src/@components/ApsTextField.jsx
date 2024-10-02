import React, { Fragment, useState } from 'react';
import {
  Grid,
  MenuItem,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { Add as AddIcon, CheckCircleOutlineSharp } from '@mui/icons-material';
import { useUpdateEffect } from '@hooks';
import Close from '@mui/icons-material/Close';

const ApsTextField = ({
  gridItem = false,
  gridProps = {},
  options = [],
  addItemOption,
  ...props
}) => {
  const [isAddClicked, setAddClick] = useState(false);

  useUpdateEffect(() => {
    if (!addItemOption?.loading) {
      setAddClick(false);
    }
  }, [addItemOption?.loading]);

  const _changeValue = (e) =>
    props.onChange ? props.onChange(e.target.value) : undefined;
  const _formikConfig = () => {
    const { name, formik } = props;
    if (!formik || !name) return {};

    return {
      value: formik.values[name],
      onChange: formik.handleChange,
      error: /* formik.touched[name] && */ Boolean(formik.errors[name]),
      helperText: /* formik.touched[name] &&  */ formik.errors[name],
    };
  };
  const Container = gridItem ? Grid : Fragment;
  const propsGrid = gridItem
    ? {
        item: true,
        md: 6,
        sm: 12,
        xs: 12,
        ...gridProps,
      }
    : {};

  const DefaultItem = () => (
    <MenuItem
      disableTouchRipple={isAddClicked}
      onClick={() => {
        !isAddClicked && setAddClick(true);
      }}
    >
      <Box
        width={'100%'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        {!isAddClicked ? (
          <>
            <Typography>Agregar nuevo</Typography>
            <AddIcon></AddIcon>
          </>
        ) : (
          <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <TextField
              onChange={({ target: { value } }) => {
                addItemOption?.onChange && addItemOption.onChange(value);
              }}
              name="name"
              type="search"
              placeholder="Nuevo item"
              sx={{
                '& .MuiOutlinedInput-root': { maxHeight: '36px' },
              }}
            />
            {addItemOption?.loading ? (
              <CircularProgress size={'28px'} />
            ) : addItemOption?.value?.length ? (
              <IconButton
                onClick={() => {
                  addItemOption &&
                    addItemOption?.onClick &&
                    addItemOption.onClick();
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                children={<CheckCircleOutlineSharp color={'success'} />}
              />
            ) : (
              <IconButton
                onClick={() => {
                  setAddClick((v) => !v);
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                children={<Close />}
              />
            )}
          </Box>
        )}
      </Box>
    </MenuItem>
  );

  const _selectProps = () => {
    let selectItems = options.length
      ? {
          children: options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={isAddClicked}
            >
              {option.label}
            </MenuItem>
          )),
        }
      : {
          children: addItemOption ? [<DefaultItem key={Math.random()} />] : [],
        };

    addItemOption &&
      selectItems?.children?.push(<DefaultItem key={Math.random()} />);

    return selectItems;
  };

  return (
    <Container {...propsGrid}>
      <TextField
        fullWidth
        {...props}
        onChange={_changeValue}
        {..._formikConfig()}
        {..._selectProps()}
        inputProps={{
          autoComplete: 'new-password',
          form: {
            autocomplete: 'off',
          },
        }}
      />
    </Container>
  );
};

export default React.memo(ApsTextField);
