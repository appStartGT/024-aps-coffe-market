export const averagePriceListDto = (purchaseDetails) => {
  // Group purchase details by price
  const groupedByPrice = purchaseDetails.reduce((acc, detail) => {
    const price = detail.price;
    if (price && price !== 0) {
      if (!acc[price]) {
        acc[price] = {
          price: price,
          totalQuantity: 0,
          purchases: [],
        };
      }
      acc[price].totalQuantity += Number(detail.quantity) || 0;
      if (!detail.id_average_price) {
        acc[price].purchases.push(detail.id_purchase_detail);
      }
    }
    return acc;
  }, {});
  // Convert to array and sort by price ascending
  const sortedPrices = Object.values(groupedByPrice).sort(
    (a, b) => a.price - b.price
  );
  // Format numbers
  return sortedPrices.map((group) => ({
    price: !isNaN(group.price) ? Number(group.price).toFixed(2) : '',
    totalQuantity: group.totalQuantity,
    purchases: group.purchases,
  }));
};
