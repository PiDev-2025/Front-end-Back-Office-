import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
import SimpleBar from "simplebar-react";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Step 1: Fetch all reservations
    fetch("http://localhost:3001/api/list-all")
      .then((res) => res.json())
      .then(async (reservations) => {
        // Step 2: Fetch each reservation's user info
        const activityData = await Promise.all(
          reservations.map(async (reservation) => {
           // const userRes = await fetch(`http://localhost:3001/api/reservations/${reservation._id}/user`);
            const userData = await userRes.json();

            return {
              id: reservation._id,
              user: userData.user,
              timestamp: new Date(reservation.startTime).toLocaleString(), // Format date
            };
          })
        );

        // Step 3: Sort by latest reservation first
        const sortedActivities = activityData.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setActivities(sortedActivities);
      })
      .catch((error) => console.error("Error fetching activity feed:", error));
  }, []);

  return (
    <Col lg={4}>
      <Card>
        <CardBody>
          <h4 className="card-title mb-4">Activity Feed</h4>
          <SimpleBar style={{ maxHeight: "376px" }}>
            <ul className="verti-timeline list-unstyled">
              {(activities || []).map((event, index) => (
                <li key={index} className="event-list">
                  <div className="event-timeline-dot">
                    <i className="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <img
                        src={event.user.image}
                        alt={event.user.name}
                        className="avatar-xs rounded-circle"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div>
                        <b>{event.user.name}</b> made a reservation.
                        <p className="mb-0 text-muted">{event.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-center mt-4">
              <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
                View More <i className="mdi mdi-arrow-right ms-1"></i>
              </Link>
            </div>
          </SimpleBar>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ActivityFeed;
