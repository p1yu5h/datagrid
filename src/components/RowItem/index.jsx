import PropTypes from "prop-types";
import "./RowItem.css";

const RowItem = ({ row, isSelected, onToggleSelection }) => {
  return (
    <div className="row">
      <div className="checkbox-cell">
        <input type="checkbox" checked={isSelected} onChange={() => onToggleSelection(row)} />
      </div>
      <div className="cell">{row.name}</div>
      <div className="cell">{row.device}</div>
      <div className="path-cell">{row.path}</div>
      <div className="cell">
        <span className="status">
          {row.status === "available" && <span className="status-dot">● </span>}
          {row.status}
        </span>
      </div>
    </div>
  );
};

RowItem.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    device: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
};

export default RowItem;
