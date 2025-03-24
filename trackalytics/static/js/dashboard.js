// trackalytics/static/js/dashboard.js
document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from Django backend
    fetch('/api/dashboard-data/')
        .then(response => response.json())
        .then(data => {
            updateCharts(data);
            updateMetrics(data);
        });

    function updateCharts(data) {
        // Bar Chart
        const barChartOptions = {
            series: [{
                data: data.top_products.map(p => p.total)
            }],
            chart: { type: 'bar', height: 400, width: 650 },
            xaxis: { categories: data.top_products.map(p => p.name) },
            // ... keep other bar chart options
        };
        
        const barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
        barChart.render();

        // Area Chart
        const areaChartOptions = {
            series: [{
                name: 'Total Inventory',
                data: data.inventory_history.total
            }, {
                name: 'Added Inventory',
                data: data.inventory_history.added
            }],
            xaxis: { categories: data.inventory_history.dates },
            // ... keep other area chart options
        };
        
        const areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
        areaChart.render();
    }

    function updateMetrics(data) {
        document.querySelectorAll('[data-metric="total"]').forEach(el => {
            el.textContent = data.metrics.total_inventory;
        });
        // Update other metrics similarly
    }
});