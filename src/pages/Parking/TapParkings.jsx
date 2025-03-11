import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Row,
  Progress,
} from "reactstrap";

const TapParkings = () => {
  const [regionData, setRegionData] = useState([]);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch("http://localhost:3001/parkings/parkings");
        const data = await response.json();

        if (!Array.isArray(data)) return;

        const totalParkings = data.length;
        const regionCounts = {};

        // Function to fetch region name from lat/lng
        const getRegionFromLatLng = async (lat, lng) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const geoData = await res.json();
            return geoData.address?.state || "Unknown"; // Use "state" as region name
          } catch {
            return "Unknown";
          }
        };

        // Convert parking locations to regions
        const promises = data.map(async (parking) => {
          const { lat, lng } = parking.position;
          const region = await getRegionFromLatLng(lat, lng);
          return region;
        });

        const resolvedRegions = await Promise.all(promises);

        // Count occurrences per region
        resolvedRegions.forEach((region) => {
          if (!regionCounts[region]) {
            regionCounts[region] = 0;
          }
          regionCounts[region]++;
        });

        // Format data for display
        const regionList = Object.keys(regionCounts).map((region) => ({
          label: region,
          percentage: ((regionCounts[region] / totalParkings) * 100).toFixed(1),
          color: "primary",
        }));

        setRegionData(regionList);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };

    fetchParkings();
  }, []);

  return (
    <React.Fragment>
      <Col xl={4} >
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap align-items-start">
              <div className="me-2">
                <h5 className="card-title mb-3">Top Parking Regions</h5>
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

            <Row className="text-center">
              <Col xs={6}>
                <div className="mt-3">
                  <p className="text-muted mb-1">Total Parkings</p>
                  <h5>{regionData.reduce((sum, r) => sum + parseFloat(r.percentage), 0)}%</h5>
                </div>
              </Col>

              <Col xs={6}>
                <div className="mt-3">
                  <p className="text-muted mb-1">Top Region</p>
                  <h5>
                    {regionData.length > 0 ? regionData[0].label : "N/A"}{" "}
                    <span className="text-success font-size-13">
                      {regionData.length > 0 ? regionData[0].percentage : "0"}% <i className="mdi mdi-arrow-up ms-1"></i>
                    </span>
                  </h5>
                </div>
              </Col>
            </Row>

            <hr />
            <div>
              <ul className="list-group list-group-flush">
                {regionData.map((region, index) => (
                  <li className="list-group-item" key={index}>
                    <div className="py-2">
                      <h5 className="font-size-14">
                        {region.label} <span className="float-end">{region.percentage}%</span>
                      </h5>
                      <div className="progress animated-progess progress-sm">
                        <Progress
                          className={`progress-bar bg-${region.color}`}
                          style={{ width: `${region.percentage}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TapParkings;
