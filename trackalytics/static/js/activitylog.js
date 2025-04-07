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

            if (logs.length === 0) {
                logBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="no-logs">No activity logs found</td>
                    </tr>
                `;
                return;
            }

            logBody.innerHTML = logs.map(log => `
                <tr>
                    <td>${formatDate(log.timestamp)}</td>
                    <td>${log.user}</td>
                    <td>${log.action}</td>
                    <td>${log.ip_address || 'N/A'}</td>
                </tr>
            `).join('');
        } catch(error) {
            console.error('Error loading activity logs:', error);
            logBody.innerHTML = `
                <tr>
                    <td colspan="4" class="error">Error loading logs: ${error.message}</td>
                </tr>
            `;
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
});