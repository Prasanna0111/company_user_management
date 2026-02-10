import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import "../../styles/componentStyles/Table.css";

const Table = ({
  columns,
  data,
  onSort,
  currentSort,
  onFilterChange,
  filters,
  loading,
}) => {
  return (
    <div className={`table-wrapper ${loading ? "loading" : ""}`}>
      {loading && (
        <div className="table-loading-overlay">
          <div className="table-loader">
            <Loader2 className="animate-spin" size={32} />
            <span>Loading data...</span>
          </div>
        </div>
      )}
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ width: column.width }}>
                <div className="th-content">
                  <div
                    className={`th-label ${column.sortable ? "sortable" : ""}`}
                    onClick={() => column.sortable && onSort(column.key)}
                  >
                    {column.label}
                    {column.sortable && (
                      <span className="sort-icons">
                        <ChevronUp
                          size={12}
                          className={
                            currentSort.key === column.key &&
                            currentSort.order === "ASC"
                              ? "active"
                              : ""
                          }
                        />
                        <ChevronDown
                          size={12}
                          className={
                            currentSort.key === column.key &&
                            currentSort.order === "DESC"
                              ? "active"
                              : ""
                          }
                        />
                      </span>
                    )}
                  </div>
                  {column.filterable && (
                    <div className="column-filter">
                      {column.filterType === "select" ? (
                        <select
                          value={filters[column.key] || ""}
                          onChange={(e) =>
                            onFilterChange(column.key, e.target.value)
                          }
                          className="filter-input"
                        >
                          <option value="">All</option>
                          {column.filterOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={filters[column.key] || ""}
                          onChange={(e) =>
                            onFilterChange(column.key, e.target.value)
                          }
                          className="filter-input"
                        />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!loading && data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((column) => (
                  <td key={`${row.id || index}-${column.key}`}>
                    {column.render
                      ? column.render(row[column.key], row, index)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : !loading ? (
            <tr>
              <td colSpan={columns.length} className="empty-message">
                No data found
              </td>
            </tr>
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`loading-row-${i}`} className="loading-row">
                <td colSpan={columns.length}>&nbsp;</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
