import React from "react";
import { Container, Row, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import CardParkingStats from "./CardParkingStats";
import ParkingGrowth from "./ParkingGrowth ";
import Activity from "./Activity";
import ParkingList from "./ParkingList";

import TapParkings from "./TapParkings";
import TablePendingParking from "./TablePendingParking";
import MapsGoogle from "./MapsGoogle";



const Dashboard = () => {

  //meta title
  document.title = "Parkini Dashboard";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboards" breadcrumbItem="Dashboard Parkings" />
          <Row>
            <CardParkingStats dataColors='["--bs-primary", "--bs-warning"]' />
            <TapParkings />
          </Row>

          <Row>
            <Activity />
            <ParkingList />
          </Row>
          <Row>
            <Col lg="12">
              <TablePendingParking />
            </Col>
          </Row>
        
            <Col lg="12">
              <MapsGoogle />
            </Col>
        







        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
