import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
//Import Images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const CardUser = () => {
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [claims, setclaims] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/All_claims")
      .then((response) => {
        const data = response.data;
        if (data.success && Array.isArray(data.claims)) {
          setclaims(data.claims);
        } else {
          console.error("API response does not contain a valid claims array:", data);
          setclaims([]); // Set to an empty array to avoid errors
        }
      })
      .catch((error) => console.error("Error fetching claims data:", error));
  }, []);
  
  const pending =  claims.filter(p => p.status === "pending").length ;
  const  resolved =  claims.filter(p => p.status === "resolved").length ;
   const rejected =  claims.filter(p => p.status === "rejected").length ;
  const inProgress=  claims.filter(p => p.status === "in_progress").length ;


  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <Row>
                <Col lg="4">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <img
                        src={avatar1}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5 className="mb-1">Claim Dashboard</h5>
                        <p className="mb-0">View All Claims in Parkini</p>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col lg="4" className="align-self-center">
                  <div className="text-lg-center mt-4 mt-lg-0">
                    <Row>
                      <Col xs="3">
                        <div>
                          <p className="text-muted text-truncate mb-2">Pending</p>
                          <h5 className="mb-0">{pending}</h5>
                        </div>
                      </Col>
                      <Col xs="3">
                        <div>
                          <p className="text-muted text-truncate mb-2">Resolved</p>
                          <h5 className="mb-0">{resolved}</h5>
                        </div>
                      </Col>
                      <Col xs="3">
                        <div>
                          <p className="text-muted text-truncate mb-2">Rejected</p>
                          <h5 className="mb-0">{rejected}</h5>
                        </div>
                      </Col>
                      <Col xs="3">
                        <div>
                          <p className="text-muted text-truncate mb-2">In Progress</p>
                          <h5 className="mb-0">{inProgress}</h5>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col lg="4" className="d-none d-lg-block">
                  <div className="clearfix mt-4 mt-lg-0">
                    <Dropdown
                      isOpen={settingsMenu}
                      toggle={() => {
                        setSettingsMenu(!settingsMenu);
                      }}
                      className="float-end"
                    >
                      <DropdownToggle tag="button" className="btn btn-primary">
                        <i className="bx bxs-cog align-middle me-1" /> Generate Report
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem href="#">Action</DropdownItem>
                        <DropdownItem href="#">Another action</DropdownItem>
                        <DropdownItem href="#">Something else</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CardUser;
