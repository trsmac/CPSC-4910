// Mock data for chart switching
const chartData = {
    sell: [10, 20, 30, 25, 40, 50],
    dead: [5, 7, 10, 9, 6, 4],
    avg: [200, 210, 215, 220, 225, 230]
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// Line Chart
const lineChartOptions = {
    series: [{
        name: "Sell-through Rate",
        data: chartData.sell
    }],
    chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false }
    },
    stroke: {
        curve: 'smooth'
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: months
    }
};

const lineChart = new ApexCharts(document.querySelector("#line-chart"), lineChartOptions);
lineChart.render();

// Switch Tab
function updateLineChart(type) {
    lineChart.updateSeries([{
        name: type === "sell" ? "Sell-through Rate" :
            type === "dead" ? "Dead Stock" : "Average Inventory",
        data: chartData[type]
    }]);
    setActiveTab(type);
}

function setActiveTab(tabId) {
    document.querySelectorAll(".tab-btn-tab").forEach(btn => {
        btn.classList.remove("active-tab");
    });
    document.getElementById(`tab-${tabId}`).classList.add("active-tab");
}


// Pie Chart
const pieChart = new ApexCharts(document.querySelector("#pie-chart"), {
    series: [40, 20, 15, 10, 15],
    chart: {
        type: 'donut',
        width: 350
    },
    labels: ['Checked-out', 'Damaged', 'Returned', 'Missing', 'Available'],
    colors: ['#4e73df', '#e74a3b', '#f6c23e', '#36b9cc', '#1cc88a'],
    dataLabels: {
        enabled: true
    },
    legend: {
        show: false
    }
});

pieChart.render();

function toggleMenu(type) {
    document.querySelectorAll(".chart-dropdown").forEach(menu => {
        menu.classList.remove("show");
    });
    const menu = document.getElementById(`${type}-menu`);
    if (menu) menu.classList.toggle("show");
}

function downloadChart(type, format) {
    // Always hide dropdown FIRST before capture
    toggleMenu(null); // Closes all open menus

    const chart = type === 'line' ? lineChart : pieChart;

    if (type === 'line') {
        const titleText = document.querySelector(".tab-btn-tab.active-tab")?.textContent?.trim() || "Inventory Rate";

        const label = document.createElement("div");
        label.className = "download-title-label";
        label.innerText = titleText;
        label.style.textAlign = "center";
        label.style.fontWeight = "bold";
        label.style.marginBottom = "10px";

        const chartWrapper = document.querySelector("#line-chart");
        chartWrapper.parentNode.insertBefore(label, chartWrapper);

        setTimeout(() => {
            html2canvas(chartWrapper.parentNode).then(canvas => {
                triggerDownload(canvas, `${titleText.replace(/\s+/g, '_')}_line_chart`, format);
                label.remove();
            });
        }, 100);
    } else {
        const pieSection = document.querySelector(".charts-card:nth-child(2)");

        setTimeout(() => {
            html2canvas(pieSection).then(canvas => {
                triggerDownload(canvas, `item_status_pie_chart`, format);
            });
        }, 100);
    }
}

function triggerDownload(canvas, filename, format) {
    if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();
    } else if (format === 'pdf') {
        const pdf = new window.jspdf.jsPDF();
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);
    }
}

window.addEventListener('click', (e) => {
    if (!e.target.closest('.chart-menu')) {
        document.querySelectorAll(".chart-dropdown").forEach(menu => {
            menu.classList.remove("show");
        });
    }
});
