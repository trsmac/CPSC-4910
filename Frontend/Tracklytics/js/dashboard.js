/* Bar Chart*/

var barChartOptions = {
    series: [{
        data: [10, 8, 6, 4, 2]
    }],
    chart: {
        type: 'bar',
        height: 400,
        width: 650,
        toolbar: {
            show: false
        },
        background: '#FFFFFF'
    },
    colors: ['#246dec', '#cc3c43', '#f5b74f', '#28C76F', '#FF9F43'],
    plotOptions: {
        bar: {
            distributed: true,
            borderRadius: 10,
            horizontal: false,
            columnWidth: '60%',
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    xaxis: {
        categories: ['ProductA', 'ProductB', 'ProductC', 'ProductD', 'ProductE'],
    },
    yaxis: {
        title: {
            text: "Amount"
        }
    },
    tooltip: {
        y: {
            formatter: function (value) {
                return value;
            },
            title: {
                formatter: function () {
                    return ''; // Remove "Series 1" or any title
                }
            }
        }
    }
};

var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
barChart.render();

/* Area Chart */

var areaChartOptions = {
    series: [{
        name: 'Total Inventory',
        data: [31, 40, 28, 51, 42, 109, 100]
    }, {
        name: 'Added Inventory',
        data: [11, 32, 45, 32, 34, 52, 41]
    }],
    chart: {
        height: 400,
        width: 650,
        type: 'area',
        toolbar: {
            show: false,
        },
        background: '#FFFFFF'
    },
    colors: ['#246dec','#f5b74f'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: [
            "2024-08-01T00:00:00.000Z",
            "2024-09-01T00:00:00.000Z",
            "2024-10-01T00:00:00.000Z",
            "2024-11-01T00:00:00.000Z",
            "2024-12-01T00:00:00.000Z",
            "2025-01-01T00:00:00.000Z",
            "2025-02-01T00:00:00.000Z"
        ],
        labels: {
            format: 'MMM yy' // Display as abbreviated month and year (e.g., Aug 2024)
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        },
};

var areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
areaChart.render();
