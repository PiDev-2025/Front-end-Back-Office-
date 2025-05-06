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
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css"; // Import SimpleBar styles

const TapParkings = () => {
  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://parkini-backend.onrender.com/parkings/parkings");
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          setRegionData([]);
          setLoading(false);
          return;
        }

        const totalParkings = data.length;
        const regionCounts = {};

        // Function to fetch region name from lat/lng using Mapbox Geocoding API
        const getRegionFromLatLng = async (lat, lng) => {
          try {
            const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=region,place`
            );
            
            if (!res.ok) throw new Error("Geocoding API request failed");
            
            const geoData = await res.json();
            
            // Extract region name from Mapbox response
            if (geoData.features && geoData.features.length > 0) {
              // Find the region feature, or use the most relevant place
              const regionFeature = geoData.features.find(
                (feature) => feature.place_type.includes("region")
              );
              
              return regionFeature ? regionFeature.text : geoData.features[0].text;
            }
            return "Unknown";
          } catch (error) {
            console.error("Error in geocoding:", error);
            return "Unknown";
          }
        };

        // Use a rate-limited approach to avoid hitting API limits
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        
        // Process parkings in batches to avoid overwhelming the geocoding API
        const batchSize = 5;
        const regions = [];
        
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          const batchPromises = batch.map(async (parking) => {
            const { lat, lng } = parking.position;
            const region = await getRegionFromLatLng(lat, lng);
            return region;
          });
          
          const batchRegions = await Promise.all(batchPromises);
          regions.push(...batchRegions);
          
          // Add a short delay between batches
          if (i + batchSize < data.length) {
            await delay(1000);
          }
        }

        // Count occurrences per region
        regions.forEach((region) => {
          if (!regionCounts[region]) {
            regionCounts[region] = 0;
          }
          regionCounts[region]++;
        });

        // Format data for display and assign colors
        const colors = ["primary", "success", "info", "warning", "danger"];
        const regionList = Object.keys(regionCounts)
          .map((region, index) => ({
            label: region,
            percentage: ((regionCounts[region] / totalParkings) * 100).toFixed(1),
            color: colors[index % colors.length],
            count: regionCounts[region]
          }))
          .sort((a, b) => b.count - a.count); // Sort by highest count

        setRegionData(regionList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parking data:", error);
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  return (
    <React.Fragment>
      <Col xl={4}>
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
                  <Link className="dropdown-item" to="#">Refresh</Link>
                  <Link className="dropdown-item" to="#">Export</Link>
                  <Link className="dropdown-item" to="#">View All</Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <Row className="text-center">
              <Col xs={6}>
                <div className="mt-3">
                  <p className="text-muted mb-1">Total Parkings</p>
                  <h5>100 %</h5>
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

            {loading ? (
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <SimpleBar style={{ maxHeight: "450px" }}>
                <ul className="list-group list-group-flush">
                  {regionData.map((region, index) => (
                    <li className="list-group-item" key={index}>
                      <div className="py-2">
                        <div className="d-flex justify-content-between">
                          <h5 className="font-size-14">
                            {region.label} 
                          </h5>
                          <span>{region.percentage}%</span>
                        </div>
                        <div className="progress animated-progress progress-sm mt-2">
                          <Progress
                            className={`progress-bar bg-${region.color}`}
                            style={{ width: `${region.percentage}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                  {regionData.length === 0 && (
                    <li className="list-group-item text-center text-muted py-3">
                      No parking data available
                    </li>
                  )}
                </ul>
              </SimpleBar>
            )}
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TapParkings;
