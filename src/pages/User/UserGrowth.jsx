import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";

const UserGrowth = ({ dataColors }) => {
  const apexlineColors = getChartColorsArray(dataColors);
  const [userGrowth, setUserGrowth] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("jan");

  useEffect(() => {
    fetch("https://parkini-backend.onrender.com//User/users")
      .then((res) => res.json())
      .then((data) => {
        const monthlyGrowth = {};

        data.forEach(user => {
          const createdAt = new Date(user.createdAt);
          const month = createdAt.toLocaleString("en-US", { month: "short" }).toLowerCase();
          
          if (!monthlyGrowth[month]) {
            monthlyGrowth[month] = 0;
          }
          monthlyGrowth[month]++;
        });

        setUserGrowth(monthlyGrowth);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const monthLabels = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const seriesData = monthLabels.map(month => userGrowth[month] || 0);

  const options = {
    chart: {
      toolbar: false,
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 8,
        opacity: 0.2,
      },
    },
    xaxis: {
      categories: monthLabels.map(m => m.toUpperCase()),
    },
    dataLabels: { enabled: false },
    colors: apexlineColors,
    stroke: { curve: "smooth", width: 3 },
  };

  return (
    <React.Fragment>
      <Col xl="8">
        <Card>
          <CardBody>
            <div className="clearfix">
              <div className="float-end">
                <div className="input-group input-group-sm">
                  <select
                    className="form-select form-select-sm"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {monthLabels.map((month) => (
                      <option key={month} value={month}>{month.toUpperCase()}</option>
                    ))}
                  </select>
                  <label className="input-group-text">Month</label>
                </div>
              </div>
              <h4 className="card-title mb-4">User Growth</h4>
            </div>

            <Row>
              <Col lg="4">
                <div className="text-muted">
                  <div className="mb-4">
                    <p>New Users each Month </p>
                    <h4>{userGrowth[selectedMonth] || 0}</h4>
                  </div>
                  <div>
                    <Link to="#" className="btn btn-primary btn-sm">
                      View Details <i className="mdi mdi-chevron-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </Col>

              <Col lg="8">
                <div id="line-chart" dir="ltr">
                  <ReactApexChart
                    series={[{ name: "New Users", data: seriesData }]}
                    options={options}
                    type="line"
                    height={320}
                    className="apex-charts"
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default UserGrowth;
