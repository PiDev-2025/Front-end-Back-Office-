import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import ParkingGrowth from "./ParkingGrowth ";

const CardParkingStats = ({ dataColors }) => {
  const [parkings, setParkings] = useState([]);
  const [pendingParkings, setPendingParkings] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    // Fetch all parkings
    axios.get("http://localhost:3001/parkings/parkings")
      .then(response => setParkings(response.data))
      .catch(error => console.error("Error fetching parking data:", error));

    // Fetch pending parkings
    axios.get("http://localhost:3001/parkings/requests")
      .then(response => setPendingParkings(response.data))
      .catch(error => console.error("Error fetching pending parkings:", error));
  }, []);

  // Compute statistics
  const totalParkings = parkings.length;
  const acceptedParkings = parkings.filter(p => p.status === "accepted").length;
  const pendingParkingCount = pendingParkings.length;
  const rejectedParkings = parkings.filter(p => p.status === "rejected").length;

  const totalSpots = parkings.reduce((sum, p) => sum + p.totalSpots, 0);
  const availableSpots = parkings.reduce((sum, p) => sum + p.availableSpots, 0);
  const occupancyRate = totalSpots ? ((availableSpots / totalSpots) * 100).toFixed(2) : 0;

  const avgHourlyPrice = (parkings.reduce((sum, p) => sum + p.pricing.hourly, 0) / totalParkings).toFixed(2);

  // Mock monthly data for chart
  const series = [
    {
      name: "New Parkings",
      data: [5, 8, 10, 15, 20, 18, 22, 25, 30, 28, 32, 40], // Mock data
    }
  ];

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["#008FFB"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  return (
    <React.Fragment>
      <Col xl={8}>
        <Row>
          {/* Parking Stats Cards */}
          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <p className="text-muted mb-2">Total Parkings</p>
                <h5 className="mb-0">{totalParkings}</h5>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <p className="text-muted mb-2">Accepted Parkings</p>
                <h5 className="mb-0">{acceptedParkings}</h5>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <p className="text-muted mb-2">Pending Parkings</p>
                <h5 className="mb-0">{pendingParkingCount}</h5>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
        
        <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <p className="text-muted mb-2">Avg. Hourly Price</p>
                <h5 className="mb-0">${avgHourlyPrice}</h5>
              </CardBody>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <p className="text-muted mb-2">Occupancy Rate</p>
                <h5 className="mb-0">{occupancyRate}%</h5>
              </CardBody>
            </Card>
          </Col>
        </Row>

       
         
      


      
        
            <ParkingGrowth dataColors='["--bs-primary"]' />
           
        

      </Col>
    </React.Fragment>
  );
};

CardParkingStats.propTypes = {
  dataColors: PropTypes.any,
};

export default CardParkingStats;
