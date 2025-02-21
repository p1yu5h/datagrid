import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DataGrid from ".";
import { sampleData } from "../../utils/sampleData";

describe("DataGrid", () => {
  it("renders the datagrid with correct header and all rows", () => {
    render(<DataGrid />);

    // Check header
    expect(screen.getByText("Datagrid")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Device")).toBeInTheDocument();
    expect(screen.getByText("Path")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check if all rows are rendered
    sampleData.forEach((row) => {
      expect(screen.getByText(row.name)).toBeInTheDocument();
      expect(screen.getByText(row.device)).toBeInTheDocument();
      expect(screen.getByText(row.path)).toBeInTheDocument();
      // Use getAllByText for status since it might appear multiple times
      const statusElements = screen.getAllByText(row.status);
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  it("shows correct selection count", () => {
    render(<DataGrid />);

    // Initially shows "None Selected"
    expect(screen.getByText("None Selected")).toBeInTheDocument();

    // Select one row
    const firstCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(firstCheckbox);
    expect(screen.getByText("1 Selected")).toBeInTheDocument();

    // Select another row
    const secondCheckbox = screen.getAllByRole("checkbox")[2];
    fireEvent.click(secondCheckbox);
    expect(screen.getByText("2 Selected")).toBeInTheDocument();
  });

  it("handles 'Select All' checkbox correctly", () => {
    render(<DataGrid />);

    const selectAllCheckbox = screen.getAllByRole("checkbox")[0];

    // Initially unchecked
    expect(selectAllCheckbox).not.toBeChecked();

    // Select all
    fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).toBeChecked();
    expect(screen.getByText(`${sampleData.length} Selected`)).toBeInTheDocument();

    // Deselect all
    fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).not.toBeChecked();
    expect(screen.getByText("None Selected")).toBeInTheDocument();
  });

  it("enables download button only for available items", () => {
    render(<DataGrid />);

    const downloadButton = screen.getByText("Download Selected");
    expect(downloadButton).toBeDisabled();

    // Select an item with "scheduled" status
    const scheduledItem = sampleData.find((item) => item.status === "scheduled");
    const scheduledCheckbox =
      screen.getAllByRole("checkbox")[sampleData.findIndex((item) => item.path === scheduledItem.path) + 1];
    fireEvent.click(scheduledCheckbox);
    expect(downloadButton).toBeDisabled();

    // Select an item with "available" status
    const availableItem = sampleData.find((item) => item.status === "available");
    const availableCheckbox =
      screen.getAllByRole("checkbox")[sampleData.findIndex((item) => item.path === availableItem.path) + 1];
    fireEvent.click(availableCheckbox);
    expect(downloadButton).toBeDisabled(); // Still disabled due to mixed selection

    // Deselect scheduled item
    fireEvent.click(scheduledCheckbox);
    expect(downloadButton).toBeEnabled(); // Now enabled with only available items
  });

  it("shows green dot only for available status", () => {
    render(<DataGrid />);

    const availableItems = sampleData.filter((item) => item.status === "available");
    const scheduledItems = sampleData.filter((item) => item.status === "scheduled");

    // Check for green dots on available items
    availableItems.forEach((item) => {
      // Find the row containing this item's name first
      const rowElement = screen.getByText(item.name).closest(".row");
      // Then find the status cell within that row
      const statusCell = rowElement.querySelector(".status");
      expect(statusCell).toContainHTML("●");
    });

    // Check that scheduled items don't have green dots
    scheduledItems.forEach((item) => {
      // Find the row containing this item's name first
      const rowElement = screen.getByText(item.name).closest(".row");
      // Then find the status cell within that row
      const statusCell = rowElement.querySelector(".status");
      expect(statusCell).not.toContainHTML("●");
    });
  });

  it("formats download alert correctly", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<DataGrid />);

    // Select an available item
    const availableItem = sampleData.find((item) => item.status === "available");
    const availableCheckbox =
      screen.getAllByRole("checkbox")[sampleData.findIndex((item) => item.path === availableItem.path) + 1];
    fireEvent.click(availableCheckbox);

    // Click download
    const downloadButton = screen.getByText("Download Selected");
    fireEvent.click(downloadButton);

    // Check alert format
    const expectedFormat = `Name: ${availableItem.name} Device: ${availableItem.device} Path: ${availableItem.path}`;
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining(expectedFormat));

    alertMock.mockRestore();
  });
});
