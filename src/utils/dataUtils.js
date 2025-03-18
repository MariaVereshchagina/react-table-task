// Фильтрация по isActive
export const filterByActive = (data, filter) => {
  if (filter === "all") return data;
  return data.filter((item) => item.isActive === (filter === "true"));
};

// Сортировка по полю
export const sortData = (data, field, order) => {
  const parseBalance = (balance) =>
    parseFloat(balance.replace("$", "").replace(",", ""));
  return [...data].sort((a, b) => {
    const aValue = field === "balance" ? parseBalance(a[field]) : a[field];
    const bValue = field === "balance" ? parseBalance(b[field]) : b[field];
    return order === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : aValue < bValue
      ? 1
      : -1;
  });
};
