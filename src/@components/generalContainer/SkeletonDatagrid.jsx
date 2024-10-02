import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';

const SkeletonDatagrid = ({ props }) => {
  return (
    <Skeleton variant="rounded" width={'100%'} height={'420px'} {...props} />
  );
};

export default SkeletonDatagrid;
