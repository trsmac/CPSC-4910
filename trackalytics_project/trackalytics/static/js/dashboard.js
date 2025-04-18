document.addEventListener('DOMContentLoaded', () => {
    // Bar Chart (Top 5 Products)
    const barOptions = {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false }
      },
      series: [{
        name: 'Quantity',
        data: [30, 40, 35, 50, 49], // placeholder
      }],
      colors: ['#3b82f6'],
      xaxis: {
        categories: ['Tents', 'Kayaks', 'Camping Gear', 'Tools', 'Others'],
        labels: { style: { colors: '#4b5563', fontSize: '14px' } }
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: '12px', colors: ['#fff'] }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '50%',
        }
      }
    };
    new ApexCharts(document.querySelector('#bar-chart'), barOptions).render();
  
    // Area Chart (Inventory Over Time)
    const areaOptions = {
      chart: {
        type: 'area',
        height: 300,
        toolbar: { show: false }
      },
      series: [
        {
          name: 'Total Inventory',
          data: [30, 50, 45, 70, 90, 130],
        },
        {
          name: 'Added Inventory',
          data: [10, 20, 25, 30, 40, 60],
        }
      ],
      colors: ['#2563eb', '#facc15'],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0,
        }
      },
      xaxis: {
        categories: ['Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 'Jan 25'],
        labels: { style: { colors: '#4b5563' } }
      },
      yaxis: {
        labels: { style: { colors: '#4b5563' } }
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2
      }
    };
    new ApexCharts(document.querySelector('#area-chart'), areaOptions).render();
  });
  