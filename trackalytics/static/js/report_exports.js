document.addEventListener("DOMContentLoaded", function() {
    // Date Picker Initialization
    const startDate = document.getElementById('start_date');
    const endDate = document.getElementById('end_date');
    
    if (startDate && endDate) {
        startDate.addEventListener('change', function() {
            endDate.min = this.value;
        });
    }

    // Export Format Selection
    const exportFormat = document.getElementById('export_format');
    if (exportFormat) {
        exportFormat.addEventListener('change', function() {
            console.log(`Selected format: ${this.value}`);
        });
    }
});