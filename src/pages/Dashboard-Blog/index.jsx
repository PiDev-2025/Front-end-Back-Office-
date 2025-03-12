import React from "react";
import { Container, Row } from "reactstrap";

//import component
import CardUser from "../Parking/CardParkingStats";
import Settings from "./Settings";
import Posts from "../Parking/Posts";
import Comments from "../Parking/Comments";
import TapVisitors from "../Parking/TapParkings";
import Activity from "../Parking/Activity";
import PopularPost from "../Parking/ParkingList";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const index = () => {
  //meta title
  document.title = "Blog Dashboard | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboards" breadcrumbItem="Blog" />
          <Row>
            <CardUser dataColors='["--bs-primary", "--bs-warning"]' />
            <Settings />
          </Row>
          <Row>
            <Posts />
            <Comments />
            <TapVisitors />
          </Row>
          <Row>
            <Activity />
            <PopularPost />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default index;
