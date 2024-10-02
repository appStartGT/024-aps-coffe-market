import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';

const SkeletonBodyContainer = ({ props }) => {
  return (
    <Skeleton variant="rounded" width={'100%'} height={'50VH'} {...props} />
  );
};

export default SkeletonBodyContainer;
