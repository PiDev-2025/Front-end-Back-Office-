import React, { useState, useEffect } from "react";
import { Col, Card, CardBody } from "reactstrap";
import axios from "axios";

const MiniWidget = () => {
  const [claimStats, setClaimStats] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get("https://parkini-backend.onrender.com//api/All_claims");
        const claims = response.data.claims;

        const stats = [
          {
            icon: "bx bx-time-five",
            title: "Pending Claims",
            value: claims.filter(claim => claim.status === "pending").length,
            color: "warning",
            desc: "Claims awaiting action",
          },
          {
            icon: "bx bx-check-circle",
            title: "Resolved Claims",
            value: claims.filter(claim => claim.status === "resolved").length,
            color: "success",
            desc: "Claims successfully resolved",
          },
          {
            icon: "bx bx-x-circle",
            title: "Rejected Claims",
            value: claims.filter(claim => claim.status === "rejected").length,
            color: "danger",
            desc: "Claims that were rejected",
          },
      
        ];

        setClaimStats(stats);
      } catch (error) {
        console.error("Error fetching claims data:", error);
      }
    };

    fetchClaims();
  }, []);

  return (
    <React.Fragment>
      {claimStats.map((stat, key) => (
        <Col sm="4" key={key}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <div className="avatar-xs me-3">
                  <span className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-18">
                    <i className={stat.icon} />
                  </span>
                </div>
                <h5 className="font-size-14 mb-0">{stat.title}</h5>
              </div>
              <div className="text-muted mt-4">
                <h4>{stat.value}</h4>
                <div className="d-flex">
                  <span className={"badge badge-soft-" + stat.color + " font-size-12"}>
                    {stat.desc}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default MiniWidget;
