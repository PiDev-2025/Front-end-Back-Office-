import React, { useState, useEffect, useMemo } from "react";
import { Badge, Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, ListGroup, ListGroupItem } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";

const TableClaim = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const toggleViewModal = () => setViewModal(!viewModal);

  useEffect(() => {
    fetch("https://parkini-backend.onrender.com//api/All_claims")
      .then(response => response.json())
      .then(async data => {
        const claimsWithReservation = await Promise.all(
          data.claims.map(async claim => {
            const reservationResponse = await fetch(`https://parkini-backend.onrender.com//api/reservation/${claim.reservationId._id}`);
            const reservationData = await reservationResponse.json();
            return {
              ...claim,
              reservationUserName: reservationData.userId.name,
              reservationUserEmail: reservationData.userId.email,
              parkingName: reservationData.parkingId.name,
            };
          })
        );
        setClaims(claimsWithReservation);
      })
      .catch(error => console.error("Error fetching claims:", error));
  }, []);

  const columns = useMemo(() => [
    { header: "Claimer Name", accessorKey: "userId.name" },
    { header: "Reservation By", accessorKey: "reservationUserName" },
    {
      header: "status", accessorKey: "status", cell: (cellProps) => (
        <Badge color={cellProps.row.original.status === "resolved" ? "success" :
          cellProps.row.original.status === "pending" ? "warning" : "info"}>
          {cellProps.row.original.status}
        </Badge>
      )
    },
    { header: "Claim Time", accessorKey: "createdAt", cell: (cellProps) => new Date(cellProps.getValue()).toLocaleString() },
    { header: "Description", accessorKey: "description" },
    {
      header: "Actions",
      cell: (cellProps) => (
        <Button
          color="primary"
          className="btn-sm"
          onClick={() => {
            setSelectedClaim(cellProps.row.original);
            toggleViewModal();
          }}
        >
          View
        </Button>
      ),
    },
  ], []);

  return (
    <React.Fragment>
      <Modal isOpen={viewModal} toggle={toggleViewModal} centered>
        <ModalHeader toggle={toggleViewModal}>Claim Details</ModalHeader>
        <ModalBody>
          {selectedClaim ? (
            <div className="p-3">
              <ListGroup>
                <ListGroupItem>
                  <strong>Claimer Name:</strong> {selectedClaim.userId.name}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Claimer Email:</strong> {selectedClaim.userId.email}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Reservation User Name:</strong> {selectedClaim.reservationUserName}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Reservation User Email:</strong> {selectedClaim.reservationUserEmail}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>License Plate:</strong> {selectedClaim.plateNumber}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Parking Name:</strong> {selectedClaim.parkingName}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Start Time:</strong> {new Date(selectedClaim.reservationId.startTime).toLocaleString()}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>End Time:</strong> {new Date(selectedClaim.reservationId.endTime).toLocaleString()}
                </ListGroupItem>
              </ListGroup>
            </div>
          ) : (
            <p>No claim selected.</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleViewModal}>Close</Button>
        </ModalFooter>
      </Modal>

      <Card>
        <CardBody>
          <h4 className="card-title">Claims List</h4>
          <TableContainer
            columns={columns}
            data={claims}
            isGlobalFilter={false}
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light"
          />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default TableClaim;