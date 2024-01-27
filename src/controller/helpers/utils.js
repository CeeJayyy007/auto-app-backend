const getStatus = (quantity, lowLevel) => {
  if (quantity === 0) {
    return 'Out of Stock';
  }

  if (quantity <= lowLevel) {
    return 'Low Stock';
  }

  return 'In Stock';
};

module.exports = getStatus;
