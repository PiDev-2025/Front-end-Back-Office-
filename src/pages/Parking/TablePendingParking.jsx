import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, CardBody, Badge } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";

const TablePendingParking = () => {
  const [pendingParkings, setPendingParkings] = useState([]);

  // Fetch all pending parking requests
  useEffect(() => {
    fetch("http://localhost:3001/parkings/requests", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(response => response.json())
      .then(data => setPendingParkings(data))
      .catch(error => console.error("Error fetching pending parkings:", error));
  }, []);

  // Function to check user role
  const isAdmin = () => {
    const token = localStorage.getItem("authUser");
    console.log("Token:", token);
    if (!token) return false;

   
  };

  // Accept parking request
  const handleAcceptParking = (parkingId) => {
    

    fetch(`http://localhost:3001/parkings/requests/${parkingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDBiY2U2NWZlMTMyZmUxMDI3NjRiZiIsIm5hbWUiOiJBZG1pbiB5YXNzaW5lIiwiZW1haWwiOiJ5YXNzb250YTIwMDFAZ21haWwuY29tIiwiaWF0IjoxNzQxNzMzMjM4LCJleHAiOjE3NDIzMzgwMzh9.oLJGdl_KIjc2iFugXnnJT-eSQTYd_j0DFC5cOFcL2v0`,
      },
      body: JSON.stringify({ status: "accepted" }),
    })
      .then(response => response.json())
      .then(() => {
        setPendingParkings(pendingParkings.filter(parking => parking._id !== parkingId));
      })
      .catch(error => console.error("Error accepting parking:", error));
  };

  // Delete parking request
  const handleDeleteParking = (parkingId) => {
    if (!isAdmin()) {
      alert("You don't have permission to perform this action.");
      return;
    }

    fetch(`http://localhost:3001/parkings/delete/${parkingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        setPendingParkings(pendingParkings.filter(parking => parking._id !== parkingId));
      })
      .catch(error => console.error("Error deleting parking:", error));
  };

  const columns = useMemo(() => [
    { header: "Parking Name", accessorKey: "name" },
    { header: "Owner name", accessorKey: "Owner.name" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (cellProps) => (
        <Badge color={cellProps.row.original.status === "accepted" ? "success" : "warning"}>
          {cellProps.row.original.status}
        </Badge>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (cellProps) => (
        <span>{new Date(cellProps.row.original.createdAt).toLocaleString()}</span>
      ),
    },
    {
      header: "Actions",
      cell: (cellProps) => (
        <div className="d-flex gap-2">
          <Button color="success" className="btn-sm" onClick={() => handleAcceptParking(cellProps.row.original._id)}>
            Accept
          </Button>
          <Button color="danger" className="btn-sm" onClick={() => handleDeleteParking(cellProps.row.original._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ], [pendingParkings]);

  return (
    <Card>
      <CardBody>
        <h4 className="card-title">Pending Parking Requests</h4>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <TableContainer
            columns={columns}
            data={pendingParkings}
            isGlobalFilter={false}
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default TablePendingParking;
