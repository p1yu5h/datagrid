import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RowItem from "./index";

describe("RowItem", () => {
  const mockRow = {
    name: "test.exe",
    device: "TestDevice",
    path: "\\Device\\Test\\path1\\test.exe",
    status: "available",
  };

  it("renders row data correctly", () => {
    render(<RowItem row={mockRow} isSelected={false} onToggleSelection={() => {}} />);

    expect(screen.getByText(mockRow.name)).toBeInTheDocument();
    expect(screen.getByText(mockRow.device)).toBeInTheDocument();
    expect(screen.getByText(mockRow.path)).toBeInTheDocument();
    expect(screen.getByText(mockRow.status)).toBeInTheDocument();
  });

  it("shows checkbox in correct state", () => {
    const { rerender } = render(<RowItem row={mockRow} isSelected={false} onToggleSelection={() => {}} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    rerender(<RowItem row={mockRow} isSelected={true} onToggleSelection={() => {}} />);
    expect(checkbox).toBeChecked();
  });

  it("calls onToggleSelection when checkbox is clicked", () => {
    const mockToggle = vi.fn();
    render(<RowItem row={mockRow} isSelected={false} onToggleSelection={mockToggle} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith(mockRow);
  });

  it("shows green dot only for available status", () => {
    const { rerender } = render(<RowItem row={mockRow} isSelected={false} onToggleSelection={() => {}} />);

    expect(screen.getByText("●")).toBeInTheDocument();

    const scheduledRow = {
      ...mockRow,
      path: "\\Device\\Test\\path2\\test.exe",
      status: "scheduled",
    };
    rerender(<RowItem row={scheduledRow} isSelected={false} onToggleSelection={() => {}} />);

    expect(screen.queryByText("●")).not.toBeInTheDocument();
  });
});
