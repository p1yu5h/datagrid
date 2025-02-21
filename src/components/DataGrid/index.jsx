import { useCallback, useState, useRef, useEffect } from "react";
import { sampleData } from "../../utils/sampleData";
import { File } from "../../utils/File";
import "./DataGrid.css";
import RowItem from "../RowItem";

/**
 * DataGrid Component
 * - Displays a grid of files with selection and download capabilities
 * - Allows for individual and bulk selection of rows
 * - Only allows downloading of items with "available" status
 */
const DataGrid = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  // Reference for the main checkbox to handle indeterminate/intermediate state
  const checkboxRef = useRef(null);

  // Handle indeterminate/intermediate state of main checkbox
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = selectedRows.length > 0 && selectedRows.length < sampleData.length;
    }
  }, [selectedRows]);

  // Toggle selection of individual row
  const toggleRowSelection = useCallback((row) => {
    setSelectedRows((prev) => {
      const isSelected = prev.some((item) => item.path === row.path);

      if (isSelected) {
        return prev.filter((item) => item.path !== row.path);
      }

      return [...prev, row];
    });
  }, []);

  // Toggle selection of all rows
  const toggleSelectAll = () => {
    if (selectedRows.length === sampleData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...sampleData]);
    }
  };

  // Check if all selected items are available for download
  const allAvailable = selectedRows.every((row) => row.status === "available");

  const handleDownload = () => {
    const formattedItems = selectedRows.map((row) => new File(row).toString());
    alert("Downloaded Items:\n" + formattedItems.join("\n"));
  };

  return (
    <div className="datagrid-container">
      <h2>Datagrid</h2>

      <div className="controls">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={selectedRows.length === sampleData.length}
          onChange={toggleSelectAll}
        />
        <span>{selectedRows.length === 0 ? "None Selected" : `${selectedRows.length} Selected`}</span>
        <button onClick={handleDownload} disabled={!selectedRows.length || !allAvailable}>
          Download Selected
        </button>
      </div>

      <div className="grid">
        {/* Header */}
        <div className="header">
          <div className="checkbox-cell" />
          <div className="cell">Name</div>
          <div className="cell">Device</div>
          <div className="path-cell">Path</div>
          <div className="cell">Status</div>
        </div>

        {/* Rows */}
        {sampleData.map((row) => (
          <RowItem
            key={row.path}
            row={row}
            isSelected={selectedRows.some((item) => item.path === row.path)}
            onToggleSelection={toggleRowSelection}
          />
        ))}
      </div>
    </div>
  );
};

export default DataGrid;
