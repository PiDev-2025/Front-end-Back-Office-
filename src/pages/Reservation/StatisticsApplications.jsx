import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Nav, NavItem, NavLink } from 'reactstrap';
import { StatisticsReservationsChart } from './ReservationCharts';

const StatisticsReservations = () => {
    const [active, setActive] = useState(1);
    const [seriesData, setSeriesData] = useState({
        totalReservations: [],
        totalParkings: [],
        monthlyReservations: [],
        labels: []
    });

    const groupByMonth = (data, dateKey) => {
        const grouped = {};
        data.forEach(item => {
            const month = new Date(item[dateKey]).toISOString().slice(0, 7);
            grouped[month] = (grouped[month] || 0) + 1;
        });
        return Object.entries(grouped).sort(([a], [b]) => new Date(a) - new Date(b));
    };

    const fetchStatistics = async () => {
        try {
            const [resRes, resParks] = await Promise.all([
                fetch('https://parkini-backend.onrender.com/api/list-all').then(res => res.json()),
                fetch('https://parkini-backend.onrender.com/parkings/parkings').then(res => res.json())
            ]);

            const reservationData = resRes;
            const parkingData = resParks;

            const monthlyRes = groupByMonth(reservationData, 'startTime');
            const monthlyParks = groupByMonth(parkingData, 'createdAt');

            // Combine all months from both datasets
            const allMonthsSet = new Set([
                ...monthlyRes.map(([month]) => month),
                ...monthlyParks.map(([month]) => month)
            ]);

            const sortedMonths = Array.from(allMonthsSet).sort((a, b) => new Date(a) - new Date(b));
            const labels = sortedMonths.map(month => `${month}-01`);

            // Map month -> count
            const resMap = Object.fromEntries(monthlyRes);
            const parkMap = Object.fromEntries(monthlyParks);

            const monthlyReservationCounts = sortedMonths.map(month => resMap[month] || 0);
            const monthlyParkingCounts = sortedMonths.map(month => parkMap[month] || 0);

            setSeriesData({
                totalReservations: monthlyReservationCounts,
                totalParkings: monthlyParkingCounts,
                monthlyReservations: monthlyReservationCounts,
                labels
            });

        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [active]);

    const handleChangeChart = (chartType) => {
        setActive(chartType);
    };

    return (
       
        <Col lg={8} > 
        
            <Card>
                <CardBody>
                    <div className="d-sm-flex flex-wrap">
                        <h4 className="card-title mb-4">Reservation Statistics</h4>
                      
                    </div>
                    <StatisticsReservationsChart
                        seriesData={seriesData}
                        dataColors='["--bs-primary", "--bs-success", "--bs-warning"]'
                        dir="ltr"
                    />
                </CardBody>
            </Card>
           
        </Col>
        
    );
};

export default StatisticsReservations;
