import React, { useState, useEffect, useMemo } from "react";
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { Badge, Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
//import images
import avatar from "../../assets/images/users/avatar-1.jpg";

const Section = () => {



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

    // Handle form change
    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };
    const toggleAddUserModal = () => setAddUserModal(!addUserModal);
    return (
        <React.Fragment>
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

            <Row className="mb-4">
                <Col lg={12}>
                    <div className="d-flex align-items-center">
                        <img src={avatar} alt="" className="avatar-sm rounded" />
                        <div className="ms-3 flex-grow-1">
                            <h5 className="mb-2 card-title">Hello</h5>
                            <p className="text-muted mb-0">Dashboard for admin</p>
                        </div>
                        <div>
                            <Link to="#" onClick={toggleAddUserModal} className="btn btn-primary"><i className="bx bx-plus align-middle"></i> Add New User</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default Section;