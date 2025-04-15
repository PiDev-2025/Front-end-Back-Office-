import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import { Card, CardBody, Col } from "reactstrap";

const PeakReservationHoursChart = ({ dataColors }) => {
  const chartColors = getChartColorsArray(dataColors);
  const [hourlyData, setHourlyData] = useState(Array(24).fill(0)); // 0-23 hours

  useEffect(() => {
    fetch("http://localhost:3001/api/reservations")
      .then((res) => res.json())
      .then((data) => {
        const hourCount = Array(24).fill(0);

        data.forEach((reservation) => {
          const hour = new Date(reservation.startTime).getHours();
          hourCount[hour]++;
        });

        setHourlyData(hourCount);
      })
      .catch((error) => console.error("Error fetching reservation data:", error));
  }, []);

  const options = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      zlevel: 0,
      x: 50,
      x2: 50,
      y: 30,
      y2: 30,
      borderWidth: 0,
    },
    xAxis: {
      type: "category",
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`), // "0:00", "1:00", ..., "23:00"
      axisLine: {
        lineStyle: {
          color: "#8791af",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8791af",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(166, 176, 207, 0.1)",
        },
      },
    },
    series: [
      {
        data: hourlyData,
        type: "line",
        smooth: true,
        areaStyle: {
          color: chartColors[0],
          opacity: 0.1,
        },
      },
    ],
    color: chartColors,
    textStyle: {
      color: ["#8791af"],
    },
  };

  return (
    <Col xl="8">
      <Card>
        <CardBody>
          <h4 className="card-title mb-4">Peak Reservation Hours</h4>
          <ReactEcharts style={{ height: "350px" }} option={options} />
        </CardBody>
      </Card>
    </Col>
  );
};

export default PeakReservationHoursChart;
