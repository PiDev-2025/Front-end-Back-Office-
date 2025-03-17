import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, CardBody, Badge, Modal, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import { GoogleMap, Marker } from "@react-google-maps/api";

const TablePendingParking = () => {
  const [pendingParkings, setPendingParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      },
      body: JSON.stringify({ status: "accepted" }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Mettre à jour l'état local
        setPendingParkings(prevParkings => 
          prevParkings.filter(parking => parking._id !== parkingId)
        );
        
        // Afficher un message de succès
        toast.success("Demande de parking acceptée avec succès");
      })
      .catch(error => {
        console.error("Error accepting parking:", error);
        // Afficher un message d'erreur
        toast.error("Erreur lors de l'acceptation de la demande");
      });
  };

  // Delete parking request
  const handleDeleteParking = (parkingId) => {
    

    fetch(`http://localhost:3001/parkings/requests/${parkingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDExZTk3ZDA5OGZjNTM5ZjEzOTM0MyIsIm5hbWUiOiJFbXBsb3nDqSIsImVtYWlsIjoiYXltZW4uamFsb3VsaUBlc3ByaXQudG4iLCJpYXQiOjE3NDE4MzI5NTYsImV4cCI6MTc0MjQzNzc1Nn0.twCtZ_fZvthg1Iy1CZwvquZwy4u7LO-5TLOEFyGYZJM`,      },
      body: JSON.stringify({ status: "rejected" }),
    })
      .then(response => response.json())
      .then(() => {
        setPendingParkings(pendingParkings.filter(parking => parking._id !== parkingId));
      })
      .catch(error => console.error("Error rejecting parking:", error));
  };

  // Fonction pour afficher le modal avec les détails
  const handleViewDetails = (parking) => {
    setSelectedParking(parking);
    setModalOpen(true);
  };

  const columns = useMemo(() => [
    { header: "Parking Name", accessorKey: "name" },
    { header: "Owner name", accessorKey: "Owner.name" },
    { 
      header: "Action Type",
      accessorKey: "action",
      cell: (cellProps) => (
        <Badge color={cellProps.row.original.action === "create" ? "info" : "warning"}>
          {cellProps.row.original.action}
        </Badge>
      ),
    },
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
          <Button color="info" className="btn-sm" onClick={() => handleViewDetails(cellProps.row.original)}>
            View
          </Button>
          <Button color="success" className="btn-sm" onClick={() => handleAcceptParking(cellProps.row.original._id)}>
            Accept
          </Button>
          <Button color="danger" className="btn-sm" onClick={() => handleDeleteParking(cellProps.row.original._id)}>
            Reject
          </Button>
        </div>
      ),
    },
  ], [pendingParkings]);

  const mapContainerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "8px"
  };

  const currencyFormatter = (value) => {
    return `${value} DT`;
  };

  // Modal content component
  const ParkingDetailsModal = ({ parking, isOpen, toggle }) => {
    const center = parking?.position ? 
      { lat: parking.position.lat, lng: parking.position.lng } : 
      { lat: 36.8065, lng: 10.1815 }; // Default to Tunis

    return (
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle} className="bg-light">
          <span className="font-weight-bold">{parking?.name}</span>
          <Badge color="info" className="ml-2">
            {parking?.action}
          </Badge>
        </ModalHeader>
        <ModalBody>
          <Row>
            {/* Images Gallery */}
            <Col xs="12" className="mb-4">
              <h5 className="mb-3">Images</h5>
              <div className="d-flex gap-2 flex-wrap">
                {parking?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Parking view ${index + 1}`}
                    style={{
                      width: "120px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid #dee2e6"
                    }}
                  />
                ))}
              </div>
            </Col>

            {/* Main Info */}
            <Col md="6" className="mb-4">
              <h5 className="mb-3">Basic Information</h5>
              <div className="bg-light p-3 rounded">
                <p><strong>Owner:</strong> {parking?.Owner?.name}</p>
                <p><strong>Total Spots:</strong> {parking?.totalSpots}</p>
                <p><strong>Available Spots:</strong> {parking?.availableSpots}</p>
                <p><strong>Description:</strong> {parking?.description || 'N/A'}</p>
              </div>
            </Col>

            {/* Pricing Info */}
            <Col md="6" className="mb-4">
              <h5 className="mb-3">Pricing</h5>
              <div className="bg-light p-3 rounded">
                <p><strong>Hourly:</strong> {currencyFormatter(parking?.pricing?.hourly)}</p>
                <p><strong>Daily:</strong> {currencyFormatter(parking?.pricing?.daily)}</p>
                <p><strong>Weekly:</strong> {currencyFormatter(parking?.pricing?.weekly)}</p>
                <p><strong>Monthly:</strong> {currencyFormatter(parking?.pricing?.monthly)}</p>
              </div>
            </Col>

            {/* Vehicle Types */}
            <Col md="6" className="mb-4">
              <h5 className="mb-3">Vehicle Types</h5>
              <div className="d-flex flex-wrap gap-2">
                {parking?.vehicleTypes?.map((type) => (
                  <Badge key={type} color="primary" className="p-2">
                    {type}
                  </Badge>
                ))}
              </div>
            </Col>

            {/* Features */}
            <Col md="6" className="mb-4">
              <h5 className="mb-3">Features</h5>
              <div className="d-flex flex-wrap gap-2">
                {parking?.features?.map((feature) => (
                  <Badge key={feature} color="secondary" className="p-2">
                    {feature}
                  </Badge>
                ))}
              </div>
            </Col>

            {/* Map */}
            <Col xs="12">
              <h5 className="mb-3">Location</h5>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                options={{ 
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false
                }}
              >
                <Marker position={center} />
              </GoogleMap>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  };

  return (
    <>
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

      {selectedParking && (
        <ParkingDetailsModal
          parking={selectedParking}
          isOpen={modalOpen}
          toggle={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default TablePendingParking;
