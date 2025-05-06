import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  DropdownMenu,
  DropdownToggle,
  Table,
  UncontrolledDropdown,
  Input
} from "reactstrap";
import SimpleBar from "simplebar-react"; // Import SimpleBar
import "simplebar-react/dist/simplebar.min.css"; // Import SimpleBar styles

// Helper function to determine the color based on availability percentage
const getAvailabilityColor = (availabilityPercentage) => {
  if (availabilityPercentage > 75) return "bg-success";
  if (availabilityPercentage > 50) return "bg-warning";
  return "bg-danger";
};

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);
  const [filteredParkings, setFilteredParkings] = useState([]);
  const [regionFilter, setRegionFilter] = useState("");

  useEffect(() => {
    fetch("https://parkini-backend.onrender.com/parkings/parkings")
      .then((res) => res.json())
      .then((data) => {
        setParkings(data);
        setFilteredParkings(data); // Initially set filtered parkings to all parkings
      })
      .catch((error) => console.error("Error fetching parking data:", error));
  }, []);

  const handleRegionFilterChange = (e) => {
    const filter = e.target.value;
    setRegionFilter(filter);

    // Filter parkings by region if regionFilter is not empty
    if (filter) {
      setFilteredParkings(parkings.filter((parking) => parking.region?.toLowerCase().includes(filter.toLowerCase())));
    } else {
      setFilteredParkings(parkings); // Reset the filter
    }
  };

  return (
    <React.Fragment>
      <Col xl={8}>
        <Card>
          <CardBody>
            <div className="d-flex align-items-start">
              <div className="me-2">
                <h5 className="card-title mb-4">Parking List</h5>
              </div>
              <div className="ms-auto">
                <Input
                  type="text"
                  placeholder="Search by region"
                  value={regionFilter}
                  onChange={handleRegionFilterChange}
                />
              </div>
              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle className="text-muted font-size-16" tag="a" color="white">
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <Link className="dropdown-item" to="#">Action</Link>
                  <Link className="dropdown-item" to="#">Another action</Link>
                  <Link className="dropdown-item" to="#">Something else</Link>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="#">Separated link</Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            {/* Scrollable Table */}
            <SimpleBar style={{ maxHeight: "400px" }}>
              <div className="table-responsive">
                <Table className="align-middle table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Parking Name</th>
                      <th scope="col">Owner</th>
                      <th scope="col">Disponibility</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParkings.map((parking, index) => {
                      const availabilityPercentage = (parking.availableSpots / parking.totalSpots) * 100;
                      return (
                        <tr key={index}>
                          <td style={{ width: "100px" }}>
                            <img
                              src={parking.images?.[0] || "https://via.placeholder.com/100"}
                              alt="Parking"
                              className="avatar-md h-auto d-block rounded"
                            />
                          </td>
                          <td>
                            <h5 className="font-size-13 text-truncate mb-1">
                              <Link to="#" className="text-dark">{parking.name}</Link>
                            </h5>
                          </td>
                          <td>{parking.Owner?.name || "Unknown"}</td>
                          <td>
                            <div className="progress" style={{ height: "10px" }}>
                              <div
                                className={`progress-bar ${getAvailabilityColor(availabilityPercentage)}`}
                                role="progressbar"
                                style={{ width: `${availabilityPercentage}%` }}
                                aria-valuenow={availabilityPercentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </td>
                          <td>
                            <UncontrolledDropdown className="dropdown">
                              <DropdownToggle className="text-muted font-size-16" tag="a" color="white">
                                <i className="mdi mdi-dots-horizontal"></i>
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-end">
                                <Link className="dropdown-item" to="#">View</Link>
                                <Link className="dropdown-item" to="#">Edit</Link>
                                <Link className="dropdown-item" to="#">Delete</Link>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </SimpleBar>
            {/* End Scrollable Table */}

          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default ParkingList;
