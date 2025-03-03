document.addEventListener("DOMContentLoaded", function () {
    const logs = {
        JohnDoe: [
            { date: "2025-02-25", action: "Added inventory item - Item #123" },
            { date: "2025-02-26", action: "Updated inventory item - Item #124" }
        ],
        JaneSmith: [
            { date: "2025-02-24", action: "Deleted inventory item - Item #456" },
            { date: "2025-02-26", action: "Added new product - Item #789" }
        ],
        ChrisBrown: [
            { date: "2025-02-22", action: "Logged in" },
            { date: "2025-02-25", action: "Exported inventory report" }
        ]
    };

    const userSelect = document.getElementById("userSelect");
    const logBody = document.getElementById("activityLogBody");

    userSelect.addEventListener("change", function () {
        const user = this.value;
        logBody.innerHTML = ""; // Clear previous logs

        if (logs[user]) {
            logs[user].forEach(log => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${log.date}</td>
                    <td>${user}</td>
                    <td>${log.action}</td>
                `;
                logBody.appendChild(row);
            });
        }
    });
});
