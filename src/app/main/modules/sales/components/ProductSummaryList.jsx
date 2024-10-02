// import React from 'react';
// import {
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
//   Divider,
//   IconButton,
//   Paper,
//   Box,
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// const ProductSummaryList = ({ items, quantities, onRemove }) => {
//   const calculateSubtotal = (item) => {
//     const quantity = quantities[item.name] || 0;
//     const price = parseFloat(item.sale_price.replace('Q', ''));
//     return quantity * price;
//   };

//   const calculateTotal = () => {
//     return items.reduce((total, item) => {
//       return total + calculateSubtotal(item);
//     }, 0);
//   };

//   const total = calculateTotal();

//   return (
//     <Paper
//       sx={{
//         padding: '20px',
//         borderRadius: '16px',
//         height: '90vh',
//         overflow: 'auto',
//         paddingTop: '0px',
//       }}
//       elevation={0}
//     >
//       <Box
//         position={'sticky'}
//         top={0}
//         bgcolor={'white'}
//         borderRadius={'12px'}
//         zIndex={999}
//         paddingTop={'20px'}
//       >
//         <Typography variant="subtitle1" mb={2} sx={{}}>
//           Total: Q
//           {total.toLocaleString(undefined, {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}
//         </Typography>
//       </Box>
//       <List sx={{ width: '100%' }}>
//         {items.map((item) => {
//           const quantity = quantities[item.name] || 0;
//           if (quantity === 0) return null;

//           const subtotal = calculateSubtotal(item);
//           return (
//             <React.Fragment key={item.name}>
//               <ListItem>
//                 <ListItemText
//                   primary={item.name}
//                   secondary={`Cantidad: ${quantity} | Subtotal: Q${subtotal.toLocaleString(
//                     undefined,
//                     { minimumFractionDigits: 2, maximumFractionDigits: 2 }
//                   )}`}
//                 />
//                 <IconButton edge="end" onClick={() => onRemove(item.name)}>
//                   <DeleteIcon color="error" />
//                 </IconButton>
//               </ListItem>
//               <Divider />
//             </React.Fragment>
//           );
//         })}
//       </List>
//     </Paper>
//   );
// };

// export default ProductSummaryList;

import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Paper,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductImageViewer from './ProducImageViewer';

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/100'; // Fallback image if no product image is provided

const ProductSummaryList = ({ items, quantities, onRemove }) => {
  const [currentPhoto, setCurrentPhoto] = useState(undefined);

  const calculateSubtotal = (item) => {
    const quantity = quantities[item.name] || 0;
    const price = parseFloat(item.sale_price.replace('Q', ''));
    return quantity * price;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + calculateSubtotal(item);
    }, 0);
  };

  const total = calculateTotal();

  return (
    <Paper
      sx={{
        padding: '20px',
        borderRadius: '16px',
        height: '90vh',
        overflow: 'auto',
        paddingTop: '0px',
      }}
      elevation={0}
    >
      <Box
        position={'sticky'}
        top={0}
        bgcolor={'white'}
        borderRadius={'12px'}
        zIndex={999}
        paddingTop={'20px'}
      >
        <Typography variant="subtitle1" mb={2} sx={{}}>
          Total: Q
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Box>
      <List sx={{ width: '100%' }}>
        {items.map((item) => {
          const quantity = quantities[item.name] || 0;
          if (quantity === 0) return null;

          const subtotal = calculateSubtotal(item);
          return (
            <React.Fragment key={item.name}>
              <ListItem>
                <ListItemAvatar
                  onClick={() => {
                    setCurrentPhoto(item.photo);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <Avatar
                    alt={item.name}
                    src={item.photo || DEFAULT_IMAGE_URL} // Use the product's photo or fallback to default
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`Cantidad: ${quantity} | Subtotal: Q${subtotal.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}`}
                />
                <IconButton edge="end" onClick={() => onRemove(item.name)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
      <ProductImageViewer
        src={currentPhoto}
        open={Boolean(currentPhoto)}
        handleClose={() => setCurrentPhoto(undefined)}
      />
    </Paper>
  );
};

export default ProductSummaryList;
