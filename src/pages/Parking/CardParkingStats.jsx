import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Row, Button,Spinner, } from "reactstrap";

import axios from "axios";
import ParkingGrowth from "./ParkingGrowth ";
import { saveAs } from "file-saver";
const CardParkingStats = ({ dataColors }) => {
  const [parkings, setParkings] = useState([]);
  const [pendingParkings, setPendingParkings] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    // Fetch all parkings
    axios.get("https://parkini-backend.onrender.com/parkings/parkings")
      .then(response => setParkings(response.data))
      .catch(error => console.error("Error fetching parking data:", error));

    // Fetch pending parkings
    axios.get("https://parkini-backend.onrender.com/parkings/requests")
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





  //gemini APi
  const generateParkingReport = async () => {
    const API_KEY = "AIzaSyBkIMKoI-5wLl2q7EsznL3rUHnd0EiH7CI";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      setLoading(true);
      // Step 1: Fetch parking data
      const response = await fetch("https://parkini-backend.onrender.com/parkings/parkings");
      const parkings = await response.json();

      // Step 2: Calculate statistics
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      const recentParkings = parkings.filter(p =>
        new Date(p.createdAt.$date || p.createdAt) > sevenDaysAgo
      );

      const statusCounts = {
        accepted: parkings.filter(p => p.status === "accepted").length,
        pending: parkings.filter(p => p.status === "pending").length,
        rejected: parkings.filter(p => p.status === "rejected").length,
      };

      const averageHourlyPrice =
        parkings.reduce((sum, p) => sum + (p.pricing?.hourly || 0), 0) /
        parkings.length;

      // Step 3: Build the prompt
      const prompt = `Generate a professional summary report for the current parking statistics:
- Total parkings: ${parkings.length}
- Recently added parkings (last 7 days): ${recentParkings.length}
- Parking status:
  - Accepted: ${statusCounts.accepted}
  - Pending: ${statusCounts.pending}
  - Rejected: ${statusCounts.rejected}
- Average hourly parking price: ${averageHourlyPrice.toFixed(2)} TND

Please include insights on recent growth, trends in acceptance, and pricing implications.`;

      const requestBody = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      // Step 4: Call Gemini API
      const aiResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await aiResponse.json();

      if (data.candidates && data.candidates.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
        saveAs(blob, "Parking_Statistics_Report.txt");
      } else {
        console.error("Unexpected Gemini response:", data);
        alert("No content returned from Gemini.");
      }
    } catch (err) {
      console.error("Error generating parking report:", err);
      alert("Failed to generate parking report.");
    } finally {
      setLoading(false);
    }
  };



  const [loading, setLoading] = useState(false);











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
                <h5 className="mb-0">{avgHourlyPrice}DT</h5>
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
          <Col lg={4}>

            <div className="text-left mt-4">
              <Button
                color="primary"
                onClick={() => generateParkingReport(setLoading)}
                disabled={loading}
                style={{ padding: "10px 20px", fontSize: "16px" }}
              >
                {loading ? <Spinner size="sm" /> : "Generate Rapport"}
              </Button>
            </div>
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
