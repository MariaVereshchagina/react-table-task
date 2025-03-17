import { useState, useMemo, useCallback } from "react";
import TableRow from "./components/TableRow";
import data from "./data/data.json";
import "./App.css";

function App() {
  const [filterActive, setFilterActive] = useState("all");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const texts = {
    title: "Таблица",
    filterLabel: "Фильтр по активности:",
    filterOptions: {
      all: "Все",
      true: "Активные",
      false: "Неактивные",
    },
  };

  const buildTree = (data) => {
    const map = new Map(
      data.map((item) => [item.id, { ...item, children: [] }])
    );
    const tree = [];

    for (const item of map.values()) {
      if (item.parentId === 0) {
        tree.push(item);
      } else {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children.push(item);
        }
      }
    }
    return tree;
  };

  const filterTreeByActive = (nodes, filter) => {
    return nodes
      .map((node) => {
        const filteredChildren = filterTreeByActive(node.children, filter);
        const matchesFilter =
          filter === "all" || node.isActive === (filter === "true");

        if (matchesFilter || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        return null;
      })
      .filter((node) => node !== null);
  };

  const sortTree = (nodes, field, order) => {
    const parseBalance = (balance) =>
      parseFloat(balance.replace("$", "").replace(",", ""));

    const sortedNodes = [...nodes].sort((a, b) => {
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

    return sortedNodes.map((node) => ({
      ...node,
      children: sortTree(node.children, field, order),
    }));
  };

  const processedData = useMemo(() => {
    let result = buildTree(data);

    result = filterTreeByActive(result, filterActive);

    if (sortField) {
      result = sortTree(result, sortField, sortOrder);
    }

    return result;
  }, [filterActive, sortField, sortOrder]);

  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
    },
    [sortField]
  );

  return (
    <div className="container">
      <h1>{texts.title}</h1>

      <div className="controls">
        <div className="filter">
          <label>{texts.filterLabel}</label>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <option value="all">{texts.filterOptions.all}</option>
            <option value="true">{texts.filterOptions.true}</option>
            <option value="false">{texts.filterOptions.false}</option>
          </select>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th
              onClick={() => handleSort("email")}
              className={sortField === "email" ? `sorted-${sortOrder}` : ""}
            >
              Email
            </th>
            <th
              onClick={() => handleSort("balance")}
              className={sortField === "balance" ? `sorted-${sortOrder}` : ""}
            >
              Баланс
            </th>
            <th>Активен</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((item) => (
            <TableRow key={item.id} item={item} level={0} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
