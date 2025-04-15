import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";

const ReservationDonutChart = ({ dataColors }) => {
  const chartColors = getChartColorsArray(dataColors);
  const [reservationStats, setReservationStats] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/reservations")
      .then((res) => res.json())
      .then((data) => {
        const total = data.length;
        const confirmed = data.filter(res => res.status === "Confirmed").length;
        const cancelled = data.filter(res => res.status === "Cancelled").length;

        setReservationStats({ total, confirmed, cancelled });
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);

  const getPercentage = (count) => reservationStats.total > 0
    ? ((count / reservationStats.total) * 100).toFixed(2)
    : "0.00";

  const series = [reservationStats.confirmed, reservationStats.cancelled];
  const options = {
    labels: ["Confirmed", "Cancelled"],
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
                      <i className="mdi mdi-circle text-primary me-1" /> Confirmed
                    </p>
                    <h5>
                      {reservationStats.confirmed} ({getPercentage(reservationStats.confirmed)}%)
                    </h5>
                  </div>
                </Col>
                <Col xs="6">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-danger me-1" /> Cancelled
                    </p>
                    <h5>
                      {reservationStats.cancelled} ({getPercentage(reservationStats.cancelled)}%)
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
