import { Paper, List, ListItemText, ListItemButton } from '@mui/material';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
  maxHeight: 'calc(100vh - 450px)',
};

const stylesList = {
  maxHeight: 'calc(100vh - 480px)',
  overflowY: 'auto',
};

const SubjectList = ({ list = [], onClick, handleSelected }) => {
  const handleOnclick = (subject) => {
    onClick && onClick(subject);
  };

  return (
    <Paper elevation={0} sx={stylesPaper}>
      <List sx={stylesList}>
        {list.map((subject, index) => (
          <ListItemButton
            key={`subject-${index}`}
            divider
            selected={handleSelected(subject)}
            onClick={() => handleOnclick(subject)}
          >
            <ListItemText
              primary={subject?.name} /* secondary="Jan 9, 2014" */
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default SubjectList;
