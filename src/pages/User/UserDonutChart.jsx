import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";

const UserDonutChart = ({ dataColors }) => {
  const apexsaleschartColors = getChartColorsArray(dataColors);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    owners: 0,
    employees: 0,
    drivers: 0,
  });

  useEffect(() => {
    fetch("https://parkini-backend.onrender.com/User/users")
      .then((res) => res.json())
      .then((data) => {
        const totalUsers = data.length;
        const owners = data.filter(user => user.role === "Owner").length;
        const employees = data.filter(user => user.role === "Employe").length;
        const drivers = data.filter(user => user.role === "Driver").length;

        setUserStats({ totalUsers, owners, employees, drivers });
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Calculate percentages
  const getPercentage = (count) => userStats.totalUsers > 0 ? ((count / userStats.totalUsers) * 100).toFixed(2) : "0.00";

  // Prepare chart data
  const series = [userStats.owners, userStats.employees, userStats.drivers];
  const options = {
    labels: ["Owners", "Employees", "Drivers"],
    colors: apexsaleschartColors,
    legend: { show: true },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
  };

  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Users Distribution</h4>

            <div>
              <div id="donut-chart">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="donut"
                  height={260}
                  className="apex-charts"
                />
              </div>
            </div>

            <div className="text-center text-muted">
              <Row>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-primary me-1" /> Owners
                    </p>
                    <h5>{userStats.owners} ({getPercentage(userStats.owners)}%)</h5>
                  </div>
                </Col>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-success me-1" /> Employees
                    </p>
                    <h5>{userStats.employees} ({getPercentage(userStats.employees)}%)</h5>
                  </div>
                </Col>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-danger me-1" /> Drivers
                    </p>
                    <h5>{userStats.drivers} ({getPercentage(userStats.drivers)}%)</h5>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default UserDonutChart;
