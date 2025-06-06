import React from "react";
import { Container, Row } from "reactstrap";
import ActivityFeed from "./ActivityFeed";
import AddedJobs from "./AddedJobs";


//Import Components

import JobVacancy from "./JobVacancy";
import Section from "./SectionR";
import StatisticsApplications from "./StatisticsApplications";
import ReservationDonutChart from "./ReservationDonutChart";
import Line from "./peekhours";

const DashboardJob = () => {

  document.title = "Parkini Dashboard";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Section />

          <Row>
            <StatisticsApplications />

            <ReservationDonutChart dataColors='["--bs-primary", "--bs-success", "--bs-danger"]' />
          </Row>

       

          <Row>

           
              <Line dataColors='["--bs-success"]' />
         
            <ActivityFeed />
          
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardJob;
