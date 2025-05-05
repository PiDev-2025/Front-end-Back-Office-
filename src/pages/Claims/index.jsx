import React from "react";
import { Container, Row, Col, Table } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Components
import CardUser from "./card-user";
import CardWelcome from "./card-welcome";
import MiniWidget from "./mini-widget";
import ClaimGrowth from "./ClaimGrowth";
import TotalClaimsByParking from "./TotalClaimsByParking";
import TableClaim from "./TableClaim";
import Tasks from "./tasks";
import ChatBox from "./chat-box";


const Claims = () => {
  //meta title
  document.title = "Parkini Dashboard";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboards" breadcrumbItem="Claims" />

          <CardUser />

          <Row>
            <CardWelcome />

            <Col xl="8">
              <Row>
                <MiniWidget />
              </Row>
            </Col>
          </Row>

          <Row>
            <ClaimGrowth dataColors='["--bs-primary"]' />

            <TotalClaimsByParking />
          
          </Row>

          <Row>
         

           <TableClaim />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Claims;
