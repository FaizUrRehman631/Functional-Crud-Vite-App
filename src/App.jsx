import { Data } from "./EmployeeData";
import { useState, useEffect } from "react";

function App() {
  // State for managing table data
  const [data, setData] = useState([]);
  // State for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(0);
  const [age, setAge] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [newFilteredData, setNewFilteredData] = useState([]);

  useEffect(() => {
    setData(Data);
    setNewFilteredData(Data);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("Data");
    if (savedData) {
      setData(JSON.parse(savedData));
      setNewFilteredData(JSON.parse(savedData));
    } else {
      setData(Data); // Default to initial data
      setNewFilteredData(Data);
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("Data", JSON.stringify(data));
    }
  }, [data]); // Trigger this effect whenever data changes

  useEffect(() => {
    let updatedData = [...data];
    // Filter by search query
    if (searchQuery) {
      updatedData = updatedData.filter(
        (item) =>
          item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.age.toString().includes(searchQuery) ||
          item.id.toString().includes(searchQuery)
      );
    }
    // Sort by selected order
    if (orderBy) {
      updatedData.sort((a, b) => {
        if (typeof a[orderBy] === "string") {
          return a[orderBy].localeCompare(b[orderBy]);
        }
        return a[orderBy] - b[orderBy];
      });
    }

    setNewFilteredData(updatedData);
  }, [searchQuery, orderBy, data]);
  // Handle edit action: populate fields with data to edit
  const handleEdit = (id) => {
    const userToEdit = data.find((user) => user.id === id);
    if (userToEdit) {
      setId(id);
      setFirstName(userToEdit.firstName);
      setLastName(userToEdit.lastName);
      setEmail(userToEdit.email);
      setAge(userToEdit.age);
      setIsUpdate(true);
    }
  };
  // Handle delete action: filter out the deleted record
  const handleDelete = (id) => {
    if (id > 0 && window.confirm("Are you sure to delete?")) {
      const updatedDate = data.filter((user) => user.id !== id);
      setData(updatedDate);
    }
  };

  // Handle save action: add a new record
  const handleSave = (e) => {
    e.preventDefault();
    // Trim spaces and validate fields
    const trimmedFirstName = firstName.trim().replace(/\s+/g, "");
    const trimmedLastName = lastName.trim().replace(/\s+/g, "");
    const trimmedEmail = email.trim().replace(/\s+/g, "");
    const parsedAge = parseInt(age, 10);

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      isNaN(parsedAge) ||
      !trimmedEmail
    ) {
      alert("Please fill all the fields.");
      return;
    }
    if (age < 18) {
      alert("Age must be 18 or older.");
      return;
    }
    const newRecord = {
      id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      age: parsedAge,
    };
    setData([...data, newRecord]);
    handleClear(); // Reset fields after saving
  };
  // Handle update action: modify an existing record
  const handleUpdate = () => {
    // Trim spaces and validate fields
    const trimmedFirstName = firstName.trim().replace(/\s+/g, "");
    const trimmedLastName = lastName.trim().replace(/\s+/g, "");
    const trimmedEmail = email.trim().replace(/\s+/g, "");
    const parsedAge = parseInt(age, 10);

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      isNaN(parsedAge) ||
      !trimmedEmail
    ) {
      alert("Please fill all the fields.");
      return;
    }
    if (age < 18) {
      alert("Age must be 18 or older.");
      return;
    }

    const updatedData = data.map((user) =>
      user.id === id
        ? {
            ...user,
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            email: trimmedEmail,
            age: parsedAge,
          }
        : user
    );

    setData(updatedData);
    handleClear(); // Reset fields after updating
  };
  // Reset form fields
  const handleClear = () => {
    setId(0);
    setFirstName("");
    setLastName("");
    setEmail("");
    setAge("");
    setIsUpdate(false);
  };

  return (
    <>
      <div className="container text-center my-2 mb-4 ">
        <div className="container d-flex justify-content-center">
          <h2
            className="text-light bg-success  rounded mb-3"
            style={{ width: "30%" }}
          >
            CRUD OPERATION
          </h2>
        </div>
        <h2 className="text-light-emphasis">
          {" "}
          <span className="text-success">Create</span> -{" "}
          <span className="text-primary">Read</span> -{" "}
          <span className="text-warning">Update</span> -{" "}
          <span className="text-danger">Delete</span>
        </h2>
        <div
          className="badge text-bg-primary fs-6 text-wrap"
          style={{ width: "16rem" }}
        >
          Using useState and useEffect
        </div>
      </div>
      <div className="container text-center my-2 d-flex justify-content-evenly ">
        <label>
          FirstName
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </label>
        <label>
          LastName
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </label>
        <label>
          Email
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          Age
          <input
            type="number"
            onChange={(e) => setAge(e.target.value)}
            value={age}
          />
        </label>
        {!isUpdate ? (
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="btn btn-warning" onClick={handleUpdate}>
            Update
          </button>
        )}
        <button className="btn btn-secondary " onClick={handleClear}>
          Clear
        </button>
      </div>
      {/* Search button  */}
      <div className="container text-center my-2 d-flex justify-content-center gap-2">
        <select
          className="form-select w-auto d-inline-block"
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="">Order By</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
          <option value="id">ID</option>
          <option value="age">Age</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="btn btn-secondary"
          onClick={() => setSearchQuery("")}
        >
          Clear Search
        </button>
      </div>

      <div className="container my-4 ">
        <table className="table table-hover text-center">
          <thead>
            <tr>
              <th>Sr</th>
              <th>Id</th>
              <th>FirstName</th>
              <th>LastName</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newFilteredData.length > 0 ? (
              newFilteredData.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        handleEdit(user.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => {
                        handleDelete(user.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // if there is no data then show No records found
              <tr>
                <td colSpan="8" className="text-center">
                  Oops! No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
