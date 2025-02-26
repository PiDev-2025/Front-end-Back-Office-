import React, { useState, useEffect, useMemo } from "react";
import { Badge, Button, Card, CardBody } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import EcommerceOrdersModal from "../Ecommerce/EcommerceOrders/EcommerceOrdersModal";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [modal1, setModal1] = useState(false);
  const [transaction, setTransaction] = useState("");

  const toggleViewModal = () => setModal1(!modal1);

  useEffect(() => {
    fetch("http://localhost:3001/User/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const columns = useMemo(() => [
    {
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      enableSorting: true,
    },
    {
      header: "Role",
      accessorKey: "role",
      enableSorting: true,
      cell: (cellProps) => (
        <Badge className={`badge-soft-${cellProps.row.original.role === "admin" ? "success" : "info"}`}>
          {cellProps.row.original.role}
        </Badge>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      enableSorting: true,
    },
    {
      header: "Vehicle Type",
      enableSorting: true,
      cell: (cellProps) => {
        const vehicleType = cellProps.row.original.vehicleType;
    
        // Define the correct image paths
        const vehicleImages = {
          "Moto": "/src/assets/images/moto.png",
          "Citadine": "/src/assets/images/voiture-de-ville.png",
          "Berline / Petit SUV": "/src/assets/images/wagon-salon.png",
          "Utilitaire": "/src/assets/images/voiture-de-livraison.png",
          "Familiale / Grand SUV": "/src/assets/images/voiture-familiale.png"
        };
    
        return (
          <span className="flex items-center gap-2">
            <img 
              src={vehicleImages[vehicleType] || "/src/assets/images/default.png"} 
              alt={vehicleType} 
              style={{ width: "1.8rem" , marginRight: "0.5rem" }}
            />
            
            {vehicleType}
          </span>
        );
      },
    },
    
    {
      header: "Actions",
      cell: (cellProps) => (
        <Button
          type="button"
          color="primary"
          className="btn-sm btn-rounded"
          onClick={() => {
            setTransaction(cellProps.row.original);
            toggleViewModal();
          }}
        >
          View Details
        </Button>
      ),
    },
  ], []);

  return (
    <React.Fragment>
      <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} transaction={transaction} />
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">Users List</div>
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

export default UsersTable;
