import React, { useState } from "react";
import { Data } from "./EmployeeData";

const CheckBoxFilter = () => {
  const [selectedFilters, setSelectedFilters] = useState([]); // State for managing selected filters
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const filterOptions = ["Id", "First Name", "Last Name", "Age", "Email"]; // Available filter options

  const handleCheckboxChange = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((item) => item !== filter)
        : [...prevFilters, filter]
    );
  };
  // Handle apply button click
  const handleApplyFilters = () => {
    const mappedData = Data.map((item) => {
      const filteredItem = {};
      if (selectedFilters.includes("Id")) filteredItem.id = item.id;
      if (selectedFilters.includes("First Name"))
        filteredItem.firstName = item.firstName;
      if (selectedFilters.includes("Last Name"))
        filteredItem.lastName = item.lastName;
      if (selectedFilters.includes("Age")) filteredItem.age = item.age;
      if (selectedFilters.includes("Email")) filteredItem.email = item.email;
      return filteredItem;
    });

    setFilteredData(mappedData); // Update filtered data state
  };
  const handleRemoveFilter = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.filter((item) => item !== filter)
    );
  };

  return (
    <div className="container text-center bg-body-tertiary my-4">
      <div className="dropdown">
        <button
          className="btn btn-secondary mt-2 dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filters
        </button>
        <ul className="dropdown-menu p-3">
          {filterOptions.map((filter, index) => (
            <li key={index} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`filter-${index}`}
                value={filter}
                checked={selectedFilters.includes(filter)}
                onChange={() => handleCheckboxChange(filter)}
              />
              <label className="form-check-label" htmlFor={`filter-${index}`}>
                {filter}
              </label>
            </li>
          ))}
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li className="text-center">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </li>
        </ul>
      </div>
      {/* Display selected filters */}
      <div className="mt-4">
        <h4>Selected Filters:</h4>
        <p>
          {selectedFilters.length > 0 ? selectedFilters.join(", ") : "None"}
        </p>
      </div>
      {/* Display filtered data */}
      <div className="mt-4">
        <h4>Filtered Data:</h4>
        {filteredData && selectedFilters.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                {selectedFilters.map((filter, index) => (
                  <th key={index}>
                    {filter}{" "}
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => handleRemoveFilter(filter)}
                      style={{
                        marginLeft: "8px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "red",
                      }}
                    >
                      ×
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  {selectedFilters.includes("Id") && <td>{item.id}</td>}
                  {selectedFilters.includes("First Name") && (
                    <td>{item.firstName}</td>
                  )}
                  {selectedFilters.includes("Last Name") && (
                    <td>{item.lastName}</td>
                  )}
                  {selectedFilters.includes("Age") && <td>{item.age}</td>}
                  {selectedFilters.includes("Email") && <td>{item.email}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data to display</p>
        )}
      </div>
    </div>
  );
};

export default CheckBoxFilter;
