// trackalytics/static/js/activitylog.js
document.addEventListener("DOMContentLoaded", function() {
    const filterSelect = document.getElementById("userSelect");
    const logBody = document.getElementById("activityLogBody");
    
    // Load initial logs
    loadLogs('all');

    // Filter change handler
    filterSelect.addEventListener('change', function() {
        loadLogs(this.value);
    });

    async function loadLogs(username) {
        try {
            const response = await fetch(`/api/activity-logs/?user=${username}`);
            const logs = await response.json();
            
            logBody.innerHTML = logs.map(log => `
                <tr>
                    <td>${new Date(log.timestamp).toLocaleString()}</td>
                    <td>${log.user}</td>
                    <td>${log.action}</td>
                </tr>
            `).join('');
        } catch(error) {
            console.error('Error loading activity logs:', error);
        }
    }
});