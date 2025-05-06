import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const ChartSection = () => {
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        owners: 0,
        employees: 0,
        drivers: 0,
    });

    useEffect(() => {
        fetch("https://parkini-backend.onrender.com//User/users")
            .then((res) => res.json())
            .then((data) => {
                const totalUsers = data.length;
                const owners = data.filter(user => user.role === "Owner").length;
                const employees = data.filter(user => user.role === "Employe").length;
                const drivers = data.filter(user => user.role === "Driver").length;

                setUserStats({ totalUsers, owners, employees, drivers });
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    // Function to calculate percentage
    const getPercentage = (count) => {
        return userStats.totalUsers > 0 ? ((count / userStats.totalUsers) * 100).toFixed(2) : "0.00";
    };

    const chartsData = [
        {
            id: 1,
            title: "Total Users",
            price: userStats.totalUsers,
            perstangeValue: "100",
            badgeColor: "primary",
            seriesData: [{ name: "Users", data: [userStats.totalUsers] }],
            color: '["--bs-primary", "--bs-transparent"]'
        },
        {
            id: 2,
            title: "Owners",
            price: userStats.owners,
            perstangeValue: getPercentage(userStats.owners),
            badgeColor: "success",
            seriesData: [{ name: "Owners", data: [userStats.owners] }],
            color: '["--bs-success", "--bs-transparent"]'
        },
        {
            id: 3,
            title: "Employees",
            price: userStats.employees,
            perstangeValue: getPercentage(userStats.employees),
            badgeColor: "info",
            seriesData: [{ name: "Employees", data: [userStats.employees] }],
            color: '["--bs-info", "--bs-transparent"]'
        },
        {
            id: 4,
            title: "Drivers",
            price: userStats.drivers,
            perstangeValue: getPercentage(userStats.drivers),
            badgeColor: "warning",
            seriesData: [{ name: "Drivers", data: [userStats.drivers] }],
            color: '["--bs-warning", "--bs-transparent"]'
        }
    ];

    return (
        <Row>
            {chartsData.map((item) => (
                <Col lg={3} key={item.id}>
                    <Card className="mini-stats-wid">
                        <CardBody>
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <p className="text-muted fw-medium">{item.title}</p>
                                    <h4 className="mb-0">{item.price}</h4>
                                </div>
                                <div className="flex-shrink-0 align-self-center">
                                    <span className={"badge badge-soft-" + item.badgeColor + " me-2"}>
                                        {item.perstangeValue}%
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default ChartSection;
