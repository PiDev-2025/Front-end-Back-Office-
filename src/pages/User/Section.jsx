import React, { useState, useEffect, useMemo } from "react";

import {

    Row,
    Col,
    Button,
    Spinner,
} from "reactstrap";
//import images
import avatar from "../../assets/images/users/avatar-1.jpg";
import { saveAs } from "file-saver";


const Section = () => {
    const generateAIReport = async (setLoading) => {
        const API_KEY = "AIzaSyBkIMKoI-5wLl2q7EsznL3rUHnd0EiH7CI";
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        try {
            setLoading(true);

            // Step 1: Fetch live user data
            const response = await fetch("http://localhost:3001/User/users");
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
    const [loading, setLoading] = useState(false);
    return (
        <React.Fragment>

            <Row className="mb-4">
                <Col lg={12}>
                    <div className="d-flex align-items-center">
                        <img src={avatar} alt="" className="avatar-sm rounded" />
                        <div className="ms-3 flex-grow-1">
                            <h5 className="mb-2 card-title">User Dashboard </h5>
                            <p className="text-muted mb-0">View all Users in Parkini</p>
                        </div>
                        <div className="text-left mt-4">
                        <Button
                            color="primary"
                            onClick={() => generateAIReport(setLoading)}
                            disabled={loading}
                            style={{ padding: "10px 20px", fontSize: "16px" }}
                        >
                            {loading ? <Spinner size="sm" /> : "Generate Rapport"}
                        </Button>
                    </div>

                    </div>
                </Col>
               
            </Row>
        </React.Fragment>
    );
}

export default Section;