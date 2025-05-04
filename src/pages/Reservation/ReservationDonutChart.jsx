import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";

const ReservationDonutChart = ({ dataColors }) => {
  const chartColors = getChartColorsArray(dataColors);
  const [reservationStats, setReservationStats] = useState({
    total: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/list-all")
      .then((res) => res.json())
      .then((data) => {
        const total = data.length;
        const pending = data.filter(res => res.status === "pending").length;
        const rejected = data.filter(res => res.status === "rejected").length;

        setReservationStats({ total, pending, rejected });
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);

  const getPercentage = (count) => reservationStats.total > 0
    ? ((count / reservationStats.total) * 100).toFixed(2)
    : "0.00";

  const series = [reservationStats.pending, reservationStats.rejected];
  const options = {
    labels: ["pending", "rejected"],
    colors: chartColors,
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
            <h4 className="card-title mb-4">Reservation Status</h4>

            <div id="donut-chart">
              <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={260}
                className="apex-charts"
              />
            </div>

            <div className="text-center text-muted">
              <Row>
                <Col xs="6">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-primary me-1" /> pending
                    </p>
                    <h5>
                      {reservationStats.pending} ({getPercentage(reservationStats.pending)}%)
                    </h5>
                  </div>
                </Col>
                <Col xs="6">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-danger me-1" /> rejected
                    </p>
                    <h5>
                      {reservationStats.rejected} ({getPercentage(reservationStats.rejected)}%)
                    </h5>
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

export default ReservationDonutChart;
