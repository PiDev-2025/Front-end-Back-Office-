import React from 'react';
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";

const StatisticsReservationsChart = ({ seriesData, dataColors }) => {
    const colors = getChartColorsArray(dataColors);

    const series = [
        {
            name: 'Total Reservations',
            type: 'column',
            data: seriesData?.totalReservations || []
        },
        {
            name: 'Total Parkings',
            type: 'column',
            data: seriesData?.totalParkings || []
        },
        {
            name: 'Monthly Reservations',
            type: 'line',
            data: seriesData?.monthlyReservations || []
        }
    ];

    const options = {
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        legend: {
            show: true,
            offsetY: 10,
        },
        stroke: {
            width: [0, 0, 2],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                columnWidth: '30%'
            }
        },
        fill: {
            opacity: [1, 1, 0.25],
        },
        labels: seriesData?.labels || [],
        colors,
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime'
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => typeof y !== "undefined" ? `${y} entries` : y
            }
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart
                options={options}
                series={series}
                type="line"
                height="350"
                className="apex-charts pb-3"
            />
        </React.Fragment>
    );
};

export { StatisticsReservationsChart };
