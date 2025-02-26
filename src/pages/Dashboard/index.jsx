import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";

import classNames from "classnames";

//import Charts
import StackedColumnChart from "./StackedColumnChart";

//import action
import { getChartsData as onGetChartsData } from "../../store/actions";

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";

// Pages Components
import WelcomeComp from "./WelcomeComp";
import MonthlyEarning from "./MonthlyEarning";
import SocialSource from "./SocialSource";
import ActivityComp from "./ActivityComp";
import TopCities from "./TopCities";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import LatestTranactions from "./LatestTranaction";

const Dashboard = (props) => {

  const [modal, setmodal] = useState(false);
  const [subscribemodal, setSubscribemodal] = useState(false);

  const DashboardProperties = createSelector(
    (state) => state.Dashboard,
    (dashboard) => ({
      chartsData: dashboard.chartsData
    })
  );

  const {
    chartsData
  } = useSelector(DashboardProperties);

  const reports = [
    { title: "Orders", iconClass: "bx-copy-alt", description: "1,235" },
    { title: "Revenue", iconClass: "bx-archive-in", description: "$35, 723" },
    { title: "Average Price", iconClass: "bx-purchase-tag-alt", description: "$16.2" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setSubscribemodal(true);
    }, 2000);
  }, []);

  const [periodData, setPeriodData] = useState([]);
  const [periodType, setPeriodType] = useState("Year");

  useEffect(() => {
    setPeriodData(chartsData);
  }, [chartsData]);

  const onChangeChartPeriod = pType => {
    setPeriodType(pType);
    dispatch(onGetChartsData(pType));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetChartsData("Year"));
  }, [dispatch]);

  //meta title
  document.title = "Dashboard | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={props.t("Dashboards")} breadcrumbItem={props.t("Dashboard Users")} />

          <Row>
            <Col lg="12">
              <LatestTranactions />
            </Col>
          </Row>
        </Container>
      </div>

   
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);
