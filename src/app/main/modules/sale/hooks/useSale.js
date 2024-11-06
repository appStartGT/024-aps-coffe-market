import React from 'react';
import AveragePriceList from '../tabs/averagePrice/pages/AveragePriceList';
import BeneficioListPage from '../tabs/beneficios/pages/BeneficioListPage';

const useSale = () => {
  const tabProps = [
    {
      title: 'Beneficios',
      content: <BeneficioListPage />,
    },
    {
      title: 'Promedios',
      content: <AveragePriceList />,
    },
  ];

  return {
    tabProps,
  };
};

export default useSale;
