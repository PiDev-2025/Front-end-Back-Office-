import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from "reactstrap";


//import action
import { getChartsData as onGetChartsData } from "../../store/actions";


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import TableUsers from "./TableUsers";
import Section from "./Section";
import ChartSection from "./ChartSection";
import UserGrowth from "./UserGrowth";
import UserDonutChart from "./UserDonutChart";

import { saveAs } from "file-saver";

const generateAIReport = async (setLoading) => {
  const API_KEY = "AIzaSyBkIMKoI-5wLl2q7EsznL3rUHnd0EiH7CI";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    setLoading(true);

    // Step 1: Fetch live user data
    const response = await fetch("https://parkini-backend.onrender.com/User/users");
    const users = await response.json();

    // Step 2: Calculate statistics
    const stats = {
      totalUsers: users.length,
      owners: users.filter(user => user.role === "Owner").length,
      employees: users.filter(user => user.role === "Employe").length,
      drivers: users.filter(user => user.role === "Driver").length,
    };

    // Step 3: Create a clear prompt
    const prompt = `Generate a professional summary report for the following user statistics:
- Total users: ${stats.totalUsers}
- Owners: ${stats.owners}
- Employees: ${stats.employees}
- Drivers: ${stats.drivers}

Please include key insights or observations.`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    // Step 4: Send to Gemini API
    const aiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await aiResponse.json();

    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
      saveAs(blob, "User_Statistics_Report.txt");
    } else {
      console.error("Unexpected Gemini response:", data);
      alert("No content returned from Gemini.");
    }
  } catch (err) {
    console.error("Error generating report:", err);
    alert("Failed to generate report. See console for details.");
  } finally {
    setLoading(false);
  }
};

const Dashboard = (props) => {
  const [loading, setLoading] = useState(false);

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
  document.title = "Parkini Dashboard";

  return (
    <React.Fragment>
      <div className="page-content">

        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={props.t("Dashboards")} breadcrumbItem={props.t("Dashboard Users")} />

          <Section />
        
        
          <ChartSection />

          <Row>
            <Col lg="12">
              <TableUsers />
            </Col>
          </Row>
          <Row>
            <UserGrowth dataColors='["--bs-primary"]' />

            <UserDonutChart dataColors='["--bs-primary", "--bs-success", "--bs-danger"]' />
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
