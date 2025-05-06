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
    const generateReservationReport = async () => {
        const API_KEY = "AIzaSyBkIMKoI-5wLl2q7EsznL3rUHnd0EiH7CI";
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        try {
            setLoading(true);
            const response = await fetch("https://parkini-backend.onrender.com//api/list-all");
            const reservations = await response.json();

            // Step 1: Basic statistics
            const totalReservations = reservations.length;

            const now = new Date();
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);

            const recentReservations = reservations.filter(r =>
                new Date(r.createdAt?.$date || r.createdAt) > sevenDaysAgo
            );

            const statusCounts = {
                accepted: reservations.filter(r => r.status === "accepted").length,
                rejected: reservations.filter(r => r.status === "rejected").length,
            };

            // Step 2: Calculate peak reservation hours
            const hourCounts = {};
            reservations.forEach(r => {
                const startHour = new Date(r.startTime?.$date || r.startTime).getHours();
                hourCounts[startHour] = (hourCounts[startHour] || 0) + 1;
            });

            const peakHour = Object.keys(hourCounts).reduce((a, b) =>
                hourCounts[a] > hourCounts[b] ? a : b
            );

            // Step 3: Build the prompt
            const prompt = `Generate a professional summary report for reservation statistics:
      - Total Reservations: ${totalReservations}
      - Reservations in last 7 days: ${recentReservations.length}
      - Status breakdown:
        - Accepted: ${statusCounts.accepted}
        - Rejected: ${statusCounts.rejected}
      - Peak Reservation Hour: Around ${peakHour}:00
      - Average Reservation Duration: ${reservations.reduce((sum, r) => {
                const start = new Date(r.startTime?.$date || r.startTime);
                const end = new Date(r.endTime?.$date || r.endTime);
                return sum + (end - start) / (1000 * 60 * 60);
            }, 0) / totalReservations
                } hours
      
      Include insights such as customer behavior patterns, preferred time slots, and any unusual trends.`;

            const requestBody = {
                contents: [{ parts: [{ text: prompt }] }],
            };

            const aiResponse = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await aiResponse.json();

            if (data.candidates && data.candidates.length > 0) {
                const text = data.candidates[0].content.parts[0].text;
                const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
                saveAs(blob, "Reservation_Statistics_Report.txt");
            } else {
                console.error("No content from Gemini:", data);
                alert("No content returned from Gemini.");
            }
        } catch (err) {
            console.error("Error generating reservation report:", err);
            alert("Failed to generate reservation report.");
        }finally {
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
                            <h5 className="mb-2 card-title">Reservation Dashboard </h5>
                            <p className="text-muted mb-0">View all Reservations in Parkini</p>
                        </div>
                        <div className="text-left mt-4">
                            <Button
                                color="primary"
                                onClick={() => generateReservationReport(setLoading)}
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