var barChartOptions = {
    series: [{
        data: [10, 8, 6, 4, 2]
    }],
    chart: {
        type: 'bar',
        height: 500,
        toolbar: {
            show: false
        }
    },
    colors: ['#246dec', '#cc3c43', '#f5b74f', '#28C76F', '#FF9F43'],
    plotOptions: {
        bar: {
            distributed: true,
            borderRadius: 4,
            horizontal: false,
            columnWidth: '50%',
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    xaxis: {
        categories: ['1', '2', '3', '4', '5'],
    },
    yaxis: {
        title: {
            text: "Count"
        }
    }
};

var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
barChart.render();
