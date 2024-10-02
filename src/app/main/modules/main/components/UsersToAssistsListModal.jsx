import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconButton, ListItemButton, Box } from '@mui/material';
import ApsModal from '@components/ApsModal';
import SearchBar from '@components/SearchBar';
import { useState } from 'react';

const UsersToassistList = ({
  usersToAssist = [],
  selected = () => Boolean,
  onClick = () => null,
}) => {
  const [searchList, setSearchList] = useState([]);
  const propsSearchBarButton = {
    label: 'Buscar por nombre ',
    type: 'text',
    searchList: usersToAssist,
    searchKey: 'name',
    searchResults: (results) => setSearchList(results),
  };

  return (
    <>
      {usersToAssist.length > 9 && (
        <Box
          sx={(theme) => ({
            bgcolor: 'background.paper',
            zIndex: theme.zIndex.appBar,
            position: 'sticky',
            top: '0',
            marginTop: '16px',
          })}
        >
          <SearchBar {...propsSearchBarButton} />
        </Box>
      )}
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          margin: '0px auto',
          maxHeight: '500px',
        }}
      >
        {(searchList.length ? searchList : usersToAssist).map((user, index) => {
          return (
            <ListItem
              component={ListItemButton}
              sx={{ width: '100%' }}
              key={`user-${index}`}
              secondaryAction={
                selected(user) && (
                  <IconButton edge="end" aria-label="delete">
                    <CheckCircleIcon color="success" />
                  </IconButton>
                )
              }
              onClick={() => onClick(user)}
            >
              <ListItemAvatar>
                <Avatar src={user?.photo || ''}>
                  <ImageIcon color="secondary" fontSize="large" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${user.person.names} ${user.person.surNames}`}
                secondary={user?.email}
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

const UsersToassistListModal = ({ auth, showModal, setShowModal }) => (
  <ApsModal
    closeBtn
    open={showModal}
    onClose={() => setShowModal((v) => !v)}
    maxWidth="xs"
    title="Elija el usuario a asistir"
    content={
      <>
        <UsersToassistList
          usersToAssist={auth?.user?.usersToAssist}
          selected={(user) => user.id_user == auth?.assitSession?.id_user}
          onClick={(selectedUser) => {
            auth.setAssitSession(
              auth?.assitSession?.id_user == selectedUser.id_user
                ? null //deseleccionar al hacer click de nuevo
                : selectedUser
            );
            location.reload(); //reload to clean local cache
          }}
        />
      </>
    }
  />
);

export default UsersToassistListModal;
