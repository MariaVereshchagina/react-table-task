import React, { useState } from "react";
import PropTypes from "prop-types";

function TableRow({ item, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isChild = item.parentId !== 0;
  const hasChildren = item.children.length > 0;

  const handleRowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <>
      <tr
        onClick={handleRowClick}
        className={`${isChild ? "child-row" : "parent-row"} ${
          isExpanded ? "expanded" : ""
        } ${isChild && hasChildren ? "child-with-children" : ""}`}
        data-level={level}
      >
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.balance}</td>
        <td>{item.isActive ? "✅" : "❌"}</td>
      </tr>
      {isExpanded &&
        item.children.map((child) => (
          <TableRow key={child.id} item={child} level={level + 1} />
        ))}
    </>
  );
}

TableRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    parentId: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    balance: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    children: PropTypes.array,
  }).isRequired,
  level: PropTypes.number,
};

export default TableRow;
