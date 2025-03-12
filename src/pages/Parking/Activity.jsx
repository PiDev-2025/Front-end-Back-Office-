import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

// SimpleBar
import SimpleBar from "simplebar-react";
import axios from "axios";

const Activity = () => {
  const [latestParkings, setLatestParkings] = useState([]);

  // Fetch latest 3 parkings
  useEffect(() => {
    axios
      .get("http://localhost:3001/parkings/parkings") // Adjust API endpoint as needed
      .then((response) => {
        const parkings = response.data;
        if (parkings.length > 0) {
          // Sort parkings by creation date (newest first) and take the last 3 added
          const latest = parkings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6); // Get last 3 entries
          setLatestParkings(latest);
        }
      })
      .catch((error) => console.error("Error fetching parking data:", error));
  }, []);

  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <CardBody>
            <div className="d-flex align-items-start">
              <div className="me-2">
                <h5 className="card-title mb-4">Recent Parking Activity</h5>
              </div>
              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle className="text-muted font-size-16" tag="a" color="white" type="button">
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end" direction="right">
                  <Link className="dropdown-item" to="#">Action</Link>
                  <Link className="dropdown-item" to="#">Another action</Link>
                  <Link className="dropdown-item" to="#">Something else</Link>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="#">Separated link</Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <SimpleBar className="mt-2" style={{ maxHeight: "340px" }}>
              <ul className="verti-timeline list-unstyled">
                {/* Display latest 3 parkings */}
                {latestParkings.length > 0 ? (
                  latestParkings.map((parking, index) => (
                    <li className="event-list active" key={index}>
                      <div className="event-timeline-dot">
                        <i className="bx bxs-right-arrow-circle font-size-18 bx-fade-right"></i>
                      </div>
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <h5 className="font-size-14">
                            {new Date(parking.createdAt).toLocaleDateString()}{" "}
                            <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"></i>
                          </h5>
                        </div>
                        <div className="flex-grow-1">
                          <div>
                            New Parking Created: <span className="fw-semibold">{parking.name}</span>{" "}
                            by {parking.Owner?.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="event-list">
                    <div className="event-timeline-dot">
                      <i className="bx bx-right-arrow-circle font-size-18"></i>
                    </div>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <h5 className="font-size-14">No Recent Parkings</h5>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </SimpleBar>

            <div className="text-center mt-4">
              <Link to="#" className="btn btn-primary btn-sm">
                View More <i className="mdi mdi-arrow-right ms-1"></i>
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default Activity;
