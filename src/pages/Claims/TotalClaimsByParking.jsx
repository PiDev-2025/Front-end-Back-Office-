import React, { useEffect, useState } from "react";
import { Col, Card, CardBody, Table } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const getChartOptions = index => {
  var options = {
    chart: { sparkline: { enabled: !0 } },
    dataLabels: { enabled: !1 },
    colors: ["#556ee6"],
    plotOptions: {
      radialBar: {
        hollow: { margin: 0, size: "60%" },
        track: { margin: 0 },
        dataLabels: { show: !1 },
      },
    },
  };
  switch (index) {
    case 1:
      options["colors"][0] = "#556ee6";
      break;
    case 2:
      options["colors"][0] = "#34c38f";
      break;
    case 3:
      options["colors"][0] = "#f46a6a";
      break;
    default:
      break;
  }

  return options;
};

const TotalClaimsByParking = (props) => {
  const [parkingClaims, setParkingClaims] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("jan");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const claimsResponse = await axios.get("http://localhost:3001/api/All_claims");
        const claims = claimsResponse.data.claims;

        const parkingClaimCounts = {};

        for (const claim of claims) {
          const reservationId = claim.reservationId._id;
          const reservationResponse = await axios.get(`http://localhost:3001/api/reservation/${reservationId}`);
          const parkingName = reservationResponse.data.parkingId.name;
          console.log("Parking Name:", parkingName);
          console.log("Claim:", claim);
          console.log("Reservation ID:", reservationId);
          console.log("Reservation Response:", reservationResponse.data);

          if (!parkingClaimCounts[parkingName]) {
            parkingClaimCounts[parkingName] = 0;
          }
          parkingClaimCounts[parkingName]++;
        }

        const totalClaims = claims.length;
        const parkingClaimsData = Object.entries(parkingClaimCounts).map(([parkingName, count]) => ({
          name: parkingName,
          desc: "Percentage of Claims",
          value: ((count / totalClaims) * 100).toFixed(2),
        }));

        setParkingClaims(parkingClaimsData);
      } catch (error) {
        console.error("Error fetching claims or reservations:", error);
      }
    };

    fetchClaims();
  }, [selectedMonth]);

  const onChangeMonth = (value) => {
    setSelectedMonth(value);
  };

  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <div className="clearfix">
              <div className="float-end">
                <div className="input-group input-group-sm">
                  <select
                    className="form-select form-select-sm"
                    value={selectedMonth}
                    onChange={(e) => {
                      onChangeMonth(e.target.value);
                    }}
                  >
                    <option value="jan">Jan</option>
                    <option value="dec">Dec</option>
                    <option value="nov">Nov</option>
                    <option value="oct">Oct</option>
                  </select>
                  <label className="input-group-text">Month</label>
                </div>
              </div>
              <h4 className="card-title mb-4">Claims by Parking</h4>
            </div>

            <div className="text-muted text-center">
              <p className="mb-2">Parking Claims</p>
              <h4>{parkingClaims.reduce((acc, claim) => acc + parseFloat(claim.value), 0).toFixed(2)}%</h4>
              <p className="mt-4 mb-0">
                <span className="badge badge-soft-success font-size-11 me-2">
                  {" "}
                  Updated <i className="mdi mdi-arrow-up" />{" "}
                </span>{" "}
                Based on current data
              </p>
            </div>

            <div className="table-responsive mt-4">
              <Table className="table align-middle mb-0">
                <tbody>
                  {(parkingClaims || []).map((data, key) => {
                    const options = getChartOptions(key + 1);
                    return (
                      <tr key={key}>
                        <td>
                          <h5 className="font-size-14 mb-1">{data.name}</h5>
                          <p className="text-muted mb-0">{data.desc}</p>
                        </td>

                        <td>
                          <div id="radialchart-1">
                            <ReactApexChart
                              options={options}
                              series={[data.value]}
                              type="radialBar"
                              height={60}
                              width={60}
                              className="apex-charts"
                            />
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-1">Claims</p>
                          <h5 className="mb-0">{data.value} %</h5>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TotalClaimsByParking;
