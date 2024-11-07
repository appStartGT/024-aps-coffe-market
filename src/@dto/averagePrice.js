export const averagePriceListDto = (purchaseDetails) => {
  // Group purchase details by price
  const groupedByPrice = purchaseDetails.reduce((acc, detail) => {
    const price = detail.price;
    if (price && price !== 0) {
      if (!acc[price]) {
        acc[price] = {
          price: price,
          totalQuantity: 0,
        };
      }
      acc[price].totalQuantity += Number(detail.quantity) || 0;
    }
    return acc;
  }, {});
  console.log({ groupedByPrice });
  // Convert to array and sort by price ascending
  const sortedPrices = Object.values(groupedByPrice).sort(
    (a, b) => a.price - b.price
  );
  console.log({ sortedPrices });
  // Format numbers
  return sortedPrices.map((group) => ({
    price: !isNaN(group.price) ? Number(group.price).toFixed(2) : '',
    totalQuantity: group.totalQuantity,
  }));
};
