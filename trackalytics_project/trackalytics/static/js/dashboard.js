document.addEventListener('DOMContentLoaded', () => {
    // Bar Chart (Top 5 Products)
    const barOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        series: [{
            name: 'Quantity',
            data: [30, 40, 35, 50, 49], // Placeholder data
        }],
        xaxis: {
            categories: ['Tents', 'Kayaks', 'Camping Gear', 'Tools', 'Others'],
        },
        colors: ['#1a1a2e'],
    };
    const barChart = new ApexCharts(document.querySelector('#bar-chart'), barOptions);
    barChart.render();

    // Area Chart (Overall Inventory)
    const areaOptions = {
        chart: {
            type: 'area',
            height: 350,
        },
        series: [{
            name: 'Inventory',
            data: [100, 120, 90, 130, 110, 140], // Placeholder data
        }],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        },
        colors: ['#162447'],
        fill: {
            opacity: 0.5,
        },
    };
    const areaChart = new ApexCharts(document.querySelector('#area-chart'), areaOptions);
    areaChart.render();

    // Line Chart (Reservation Trends)
    const lineOptions = {
        chart: {
            type: 'line',
            height: 350,
        },
        series: [{
            name: 'Reservations',
            data: [10, 15, 12, 20, 18, 25], // Placeholder data
        }],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        },
        colors: ['#1a1a2e'],
    };
    if (document.querySelector('#line-chart')) {
        const lineChart = new ApexCharts(document.querySelector('#line-chart'), lineOptions);
        lineChart.render();
    }

    // Pie Chart (Inventory Usage)
    const pieOptions = {
        chart: {
            type: 'pie',
            height: 350,
        },
        series: [44, 55, 13, 33], // Placeholder data
        labels: ['Tents', 'Kayaks', 'Gear', 'Others'],
        colors: ['#1a1a2e', '#162447', '#4e4e8e', '#a1a1d6'],
    };
    if (document.querySelector('#pie-chart')) {
        const pieChart = new ApexCharts(document.querySelector('#pie-chart'), pieOptions);
        pieChart.render();
    }
});