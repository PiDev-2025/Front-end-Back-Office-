import React, { useState, useEffect, useMemo } from "react";
import { Badge, Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import EcommerceOrdersModal from "../Ecommerce/EcommerceOrders/EcommerceOrdersModal";

const LatestTranaction = () => {
  const [users, setUsers] = useState([]);
  const [modal1, setModal1] = useState(false);
  const [transaction, setTransaction] = useState(null);

  // Add User Modal State
  const [addUserModal, setAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Driver",
    vehicleType: "Moto",
    password: "default123",
  });

  // Update User Modal State
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    vehicleType: ""
  });

  const toggleViewModal = () => setModal1(!modal1);
  const toggleAddUserModal = () => setAddUserModal(!addUserModal);
  const toggleUpdateUserModal = () => setUpdateUserModal(!updateUserModal);

  // Fetch all users
  useEffect(() => {
    fetch("http://localhost:3001/User/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Handle update form change
  const handleUpdateChange = (e) => {
    setUserToUpdate({ ...userToUpdate, [e.target.name]: e.target.value });
  };

  // Submit new user
  const handleAddUser = () => {
    // Validate that required fields are not empty
    if (!newUser.name || !newUser.email) {
      alert("Name and email are required!");
      return;
    }

    // Ensure password is set
    const userToSend = {
      ...newUser,
      password: newUser.password || "default123" // Make sure there's a default password
    };

    console.log("Sending user data:", userToSend); // Debug log
    
    fetch("http://localhost:3001/User/users", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userToSend)
    })
      .then(response => {
        console.log("Response status:", response.status);
        return response.json().then(data => {
          if (!response.ok) {
            // For error responses, include the response data in the error
            throw new Error(data.message || data.error || "Error creating user");
          }
          return data;
        });
      })
      .then(data => {
        console.log("Success:", data);
        // Make sure we're getting the user object in the response
        if (data.user) {
          setUsers([...users, data.user]);
          toggleAddUserModal();
          alert("User created successfully!");
        } else {
          console.warn("User data not found in response:", data);
          alert("User created but data not returned properly.");
        }
      })
      .catch(error => {
        console.error("Error adding user:", error);
        alert(`Failed to create user: ${error.message}`);
      });
  };

  // Open Update Modal with user data
  const handleUpdateClick = (user) => {
    setUserToUpdate({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      vehicleType: user.vehicleType || ""
    });
    toggleUpdateUserModal();
  };

  // Submit updated user
  const handleUpdateUser = () => {
    // Validate that required fields are not empty
    if (!userToUpdate.name || !userToUpdate.email) {
      alert("Name and email are required!");
      return;
    }

    console.log("Sending updated user data:", userToUpdate); // Debug log
    
    fetch(`http://localhost:3001/User/users/${userToUpdate._id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userToUpdate)
    })
      .then(response => {
        console.log("Response status:", response.status);
        return response.json().then(data => {
          if (!response.ok) {
            // For error responses, include the response data in the error
            throw new Error(data.message || data.error || "Error updating user");
          }
          return data;
        });
      })
      .then(data => {
        console.log("Success:", data);
        // Update the users state with the updated user
        setUsers(users.map(user => 
          user._id === userToUpdate._id ? data.user || userToUpdate : user
        ));
        toggleUpdateUserModal();
        alert("User updated successfully!");
      })
      .catch(error => {
        console.error("Error updating user:", error);
        alert(`Failed to update user: ${error.message}`);
      });
  };

  // Delete user function
  const handleDeleteUser = (userId) => {
    fetch(`http://localhost:3001/User/users/${userId}`, {
      method: "DELETE",
    })
      .then(() => {
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(error => console.error("Error deleting user:", error));
  };

  const columns = useMemo(() => [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Role",
      accessorKey: "role",
      cell: (cellProps) => (
        <Badge color={cellProps.row.original.role === "Admin" ? "success" : 
                      cellProps.row.original.role === "Driver" ? "warning" : "info"}>
          {cellProps.row.original.role}
        </Badge>
      ),
    },
    { 
      header: "Vehicle Type", 
      accessorKey: "vehicleType",
      cell: (cellProps) => (
        cellProps.row.original.role === "Driver" ? 
          <span>{cellProps.row.original.vehicleType || "Not specified"}</span> : 
          <span>-</span>
      )
    },
    { header: "Phone", accessorKey: "phone" },
    {
      header: "Actions",
      cell: (cellProps) => (
        <div className="d-flex gap-2">
          <Button color="primary" className="btn-sm" onClick={() => {
            if (cellProps.row.original) {
              setTransaction(cellProps.row.original); 
              toggleViewModal();
            }
          }}>
            View
          </Button>
          <Button color="warning" className="btn-sm" onClick={() => handleUpdateClick(cellProps.row.original)}>
            Update
          </Button>
          <Button color="danger" className="btn-sm" onClick={() => handleDeleteUser(cellProps.row.original._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ], [users]);

  return (
    <React.Fragment>
      <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} transaction={transaction || {}} />

      {/* Add User Modal */}
      <Modal isOpen={addUserModal} toggle={toggleAddUserModal}>
        <ModalHeader toggle={toggleAddUserModal}>Add New User</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" name="name" value={newUser.name} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" value={newUser.email} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input type="text" name="phone" value={newUser.phone} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="role">Role</Label>
              <Input type="select" name="role" value={newUser.role} onChange={handleChange}>
                <option>Driver</option>
                <option>Owner</option>
                <option>Admin</option>
                <option>Employee</option>
              </Input>
            </FormGroup>
            
            {/* Conditionally show vehicle type for drivers */}
            {newUser.role === "Driver" && (
              <FormGroup>
                <Label for="vehicleType">Vehicle Type</Label>
                <Input type="select" name="vehicleType" value={newUser.vehicleType} onChange={handleChange}>
                  <option value="Moto">Moto</option>
                  <option value="Citadine">Citadine</option>
                  <option value="Berline / Petit SUV">Berline / Petit SUV</option>
                  <option value="Familiale / Grand SUV">Familiale / Grand SUV</option>
                  <option value="Utilitaire">Utilitaire</option>
                </Input>
              </FormGroup>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddUser}>Add User</Button>
          <Button color="secondary" onClick={toggleAddUserModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Update User Modal */}
      <Modal isOpen={updateUserModal} toggle={toggleUpdateUserModal}>
        <ModalHeader toggle={toggleUpdateUserModal}>Update User</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" name="name" value={userToUpdate.name} onChange={handleUpdateChange} />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" value={userToUpdate.email} onChange={handleUpdateChange} />
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input type="text" name="phone" value={userToUpdate.phone} onChange={handleUpdateChange} />
            </FormGroup>
            <FormGroup>
              <Label for="role">Role</Label>
              <Input type="select" name="role" value={userToUpdate.role} onChange={handleUpdateChange}>
                <option>Driver</option>
                <option>Owner</option>
                <option>Admin</option>
                <option>Employee</option>
              </Input>
            </FormGroup>
            
            {/* Conditionally show vehicle type for drivers */}
            {userToUpdate.role === "Driver" && (
              <FormGroup>
                <Label for="vehicleType">Vehicle Type</Label>
                <Input type="select" name="vehicleType" value={userToUpdate.vehicleType} onChange={handleUpdateChange}>
                  <option value="Moto">Moto</option>
                  <option value="Citadine">Citadine</option>
                  <option value="Berline / Petit SUV">Berline / Petit SUV</option>
                  <option value="Familiale / Grand SUV">Familiale / Grand SUV</option>
                  <option value="Utilitaire">Utilitaire</option>
                </Input>
              </FormGroup>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateUser}>Update User</Button>
          <Button color="secondary" onClick={toggleUpdateUserModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title">Users List</h4>
            <Button color="success" onClick={toggleAddUserModal}>+ Add User</Button>
          </div>

          <TableContainer
            columns={columns}
            data={users}
            isGlobalFilter={false}
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light"
          />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default LatestTranaction;